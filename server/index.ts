/**
 * NP Digital API server.
 * - Serves the built site from dist/
 * - POST /api/inquiries — zod-validated, rate-limited enquiry intake
 * - Pluggable CRM/email adapters via env vars (no keys in frontend code).
 */
import express from "express";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { mkdir, appendFile } from "node:fs/promises";
import { join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path_dirname();
function path_dirname() {
  return fileURLToPath(new URL(".", import.meta.url));
}

const app = express();
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const DATA_DIR = process.env.NP_DATA_DIR ?? join(ROOT, ".data");
const PORT = Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 8787;

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

// ------------------------------------------------------------ rate limiting
type Hit = { count: number; reset: number };
const buckets = new Map<string, Hit>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
  const now = Date.now();
  const hit = buckets.get(ip);
  if (!hit || hit.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return next();
  }
  hit.count += 1;
  if (hit.count > MAX_PER_WINDOW) {
    res.status(429).json({ ok: false, error: "Too many requests. Please try again later." });
    return;
  }
  next();
}

// ------------------------------------------------------------ validation
const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.preprocess((val) => val || "", z.string().trim().max(20)),
  service: z.preprocess((val) => val || "", z.string().trim().max(120)),
  message: z.preprocess((val) => val || "", z.string().trim().max(4000)),
});

type Inquiry = z.infer<typeof inquirySchema> & {
  id: string;
  receivedAt: string;
};

// ------------------------------------------------------------ CRM adapters
// Configure via env vars only — never in frontend code.
// NP_CRM_WEBHOOK_URL  — generic JSON webhook (HubSpot/Zapier/Make/custom)
// NP_WHATSAPP_NUMBER  — WhatsApp number to receive notifications (e.g., 918866595666)
// NP_WHATSAPP_API_KEY — API key for WhatsApp service (optional, for CallMeBot or similar)
// NP_SMTP_*           — reserved for a future SMTP adapter

async function sendWhatsAppNotification(inquiry: Inquiry): Promise<boolean> {
  const whatsappNumber = process.env.NP_WHATSAPP_NUMBER;
  if (!whatsappNumber) return false;

  // Format message for WhatsApp
  const message = `
🔔 *New Enquiry from NP Digital Website*

👤 *Name:* ${inquiry.name}
📧 *Email:* ${inquiry.email}
${inquiry.phone ? `📱 *Phone:* ${inquiry.phone}` : ''}
${inquiry.service ? `🛠️ *Service:* ${inquiry.service}` : ''}
${inquiry.message ? `\n💬 *Message:*\n${inquiry.message}` : ''}

🆔 ID: ${inquiry.id}
⏰ ${new Date(inquiry.receivedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
  `.trim();

  const encodedMessage = encodeURIComponent(message);
  
  // Option 1: Use CallMeBot API (free, no registration needed for own number)
  // https://www.callmebot.com/blog/free-api-whatsapp-messages/
  const apiKey = process.env.NP_WHATSAPP_API_KEY;
  if (apiKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${whatsappNumber}&text=${encodedMessage}&apikey=${apiKey}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        console.log(`WhatsApp notification sent to ${whatsappNumber}`);
        return true;
      }
      console.error("WhatsApp API failed", res.status);
    } catch (err) {
      console.error("WhatsApp API error", err);
    }
  }

  // Option 2: Use wa.me link (opens WhatsApp web/app - requires manual setup)
  // This creates a direct WhatsApp link that can be used with webhooks
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  console.log(`WhatsApp link generated: ${waLink}`);
  
  // Option 3: Use webhook to send to WhatsApp via services like:
  // - Twilio WhatsApp API
  // - WhatsApp Business API
  // - Zapier/Make.com integrations
  const whatsappWebhook = process.env.NP_WHATSAPP_WEBHOOK_URL;
  if (whatsappWebhook) {
    try {
      const res = await fetch(whatsappWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: whatsappNumber,
          message: message,
          inquiry: inquiry,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        console.log(`WhatsApp webhook notification sent`);
        return true;
      }
      console.error("WhatsApp webhook failed", res.status);
    } catch (err) {
      console.error("WhatsApp webhook error", err);
    }
  }

  return false;
}

async function deliver(inquiry: Inquiry): Promise<{ ok: boolean; via: string }> {
  let methods: string[] = [];

  // Try WhatsApp notification
  const whatsappSent = await sendWhatsAppNotification(inquiry);
  if (whatsappSent) methods.push("whatsapp");

  // Try CRM webhook
  const webhook = process.env.NP_CRM_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "npdigital.in website",
          ...inquiry,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        methods.push("crm-webhook");
      } else {
        console.error("CRM webhook failed", res.status);
      }
    } catch (err) {
      console.error("CRM webhook error", err);
    }
  }

  // Always save to file as backup
  methods.push("file");
  
  return { 
    ok: true, 
    via: methods.length > 0 ? methods.join("+") : "file" 
  };
}

async function persist(inquiry: Inquiry): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(
    join(DATA_DIR, "inquiries.ndjson"),
    JSON.stringify(inquiry) + "\n",
    "utf8"
  );
}

// ------------------------------------------------------------ routes
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "np-digital-api", time: new Date().toISOString() });
});

app.post("/api/inquiries", rateLimit, async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    res.status(400).json({ ok: false, error: first?.message ?? "Invalid submission." });
    return;
  }

  const inquiry: Inquiry = {
    ...parsed.data,
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
  };

  try {
    await persist(inquiry);
    const result = await deliver(inquiry);
    console.log(`inquiry ${inquiry.id} stored (${result.via})`);
    res.status(201).json({ ok: true, id: inquiry.id });
  } catch (err) {
    console.error("inquiry persist error", err);
    res.status(500).json({ ok: false, error: "We could not save your enquiry. Please email us directly." });
  }
});

// ------------------------------------------------------------ static site
const MIME_CACHE_CONTROL: Record<string, string> = {
  ".html": "no-cache",
  ".js": "public, max-age=31536000, immutable",
  ".css": "public, max-age=31536000, immutable",
  ".png": "public, max-age=604800",
  ".jpg": "public, max-age=604800",
  ".svg": "public, max-age=604800",
  ".webp": "public, max-age=604800",
  ".woff2": "public, max-age=31536000, immutable",
};

app.use(express.static(DIST, { setHeaders(res, filePath) {
  const ext = extname(filePath);
  const cc = MIME_CACHE_CONTROL[ext];
  if (cc) res.setHeader("Cache-Control", cc);
} }));

// SPA-less MPA fallback: /privacy -> privacy.html, /terms -> terms.html, etc.
const prettyPages = new Set(["privacy", "terms", "projects"]);
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  const clean = req.path.replace(/^\/+|\/+$/g, "");
  if (prettyPages.has(clean)) {
    res.setHeader("Cache-Control", "no-cache");
    return res.sendFile(join(DIST, `${clean}.html`));
  }
  next();
});

// 404
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ ok: false, error: "Not found" });
    return;
  }
  res.setHeader("Cache-Control", "no-cache");
  res.status(404).sendFile(join(DIST, "404.html"));
});

// ------------------------------------------------------------ boot
app.listen(PORT, () => {
  console.log(`NP Digital server running on http://localhost:${PORT}`);
});
