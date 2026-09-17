# NP Digital - Deployment Guide

## Contact Form Setup

The contact form now collects the following information:
- **Name** (required)
- **Email** (required)
- **Phone Number** (optional)
- **Service** (optional dropdown)
- **Message** (optional)

### Form Submission

The form submits to `/api/inquiries` via POST request and:
1. Validates all fields server-side using Zod
2. **Sends WhatsApp notification** (if configured)
3. Stores inquiries in `.data/inquiries.ndjson` file
4. Optionally sends to CRM webhook if configured
5. Rate limits to 5 submissions per 10 minutes per IP

### Production Setup

#### 1. Build the project
```bash
npm run build
npm run server:build
```

#### 2. Start the production server
```bash
npm start
```
The server runs on port 8787 by default (configurable via PORT env variable).

#### 3. Configure WhatsApp Notifications (Recommended)

**See the complete guide:** [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md)

**Quick Setup with CallMeBot (Free):**

1. Add `+34 644 35 80 65` to WhatsApp contacts as "CallMeBot"
2. Send message: `I allow callmebot to send me messages`
3. You'll receive your API key
4. Create `.env` file:
   ```env
   NP_WHATSAPP_NUMBER=918866595666
   NP_WHATSAPP_API_KEY=your_api_key_here
   ```

Now every form submission will be sent to your WhatsApp!

#### 4. Configure CRM Integration (Optional)

Set environment variable for webhook integration:
```bash
export NP_CRM_WEBHOOK_URL="https://your-crm-webhook-url.com/endpoint"
```

Supported platforms:
- HubSpot Forms API
- Zapier Webhooks
- Make.com Webhooks
- Custom webhook endpoints

The webhook receives JSON payload:
```json
{
  "source": "npdigital.in website",
  "id": "uuid",
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+91 88665 9566",
  "service": "Website Development",
  "message": "Project details...",
  "receivedAt": "2026-09-17T09:00:00.000Z"
}
```

#### 4. Data Storage

All inquiries are stored locally in `.data/inquiries.ndjson` as a backup, regardless of CRM configuration.

To customize the data directory:
```bash
export NP_DATA_DIR="/path/to/data"
```

## Netlify Deployment

### Option 1: Netlify CLI (Recommended)

```bash
# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=dist

# Or initialize and link to a site
netlify init
netlify deploy --prod
```

### Option 2: Continuous Deployment

1. Push code to GitHub/GitLab
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `.netlify/functions` (if using serverless functions)

### Environment Variables on Netlify

Add these in Netlify dashboard under Site settings > Environment variables:

```
NP_CRM_WEBHOOK_URL=https://your-webhook-url.com/endpoint
```

### Netlify Forms Alternative

If you prefer to use Netlify Forms instead of the custom API:

1. Add `netlify` attribute to form tag in `index.html`
2. Add a hidden input: `<input type="hidden" name="form-name" value="contact" />`
3. View submissions in Netlify dashboard under Forms

## Testing Locally

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Start production server:**
   ```bash
   npm run build
   npm run server:build
   npm start
   ```
   Then visit: http://localhost:8787

3. **Test form submission:**
   ```bash
   curl -X POST http://localhost:8787/api/inquiries \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+91 9876543210",
       "service": "Website Development",
       "message": "This is a test message"
     }'
   ```

4. **Check saved inquiries:**
   ```bash
   cat .data/inquiries.ndjson
   ```

## Server Health Check

The API includes a health check endpoint:
```bash
curl http://localhost:8787/api/health
```

Response:
```json
{
  "ok": true,
  "service": "np-digital-api",
  "time": "2026-09-17T09:00:00.000Z"
}
```

## Rate Limiting

- **Limit:** 5 requests per 10 minutes per IP address
- **Response:** 429 Too Many Requests
- Configurable in `server/index.ts`

## Security Features

- ✅ Input validation with Zod
- ✅ Rate limiting
- ✅ CORS protection (same-origin only)
- ✅ JSON payload size limit (16KB)
- ✅ SQL injection safe (no database queries)
- ✅ XSS protection (no HTML rendering of user input)

## Troubleshooting

### Form not submitting
1. Check browser console for errors
2. Verify server is running: `curl http://localhost:8787/api/health`
3. Check server logs for validation errors

### Inquiries not being saved
1. Check `.data` directory exists and is writable
2. Check server logs for file system errors
3. Verify NP_DATA_DIR environment variable if set

### CRM webhook not working
1. Test webhook URL directly
2. Check server logs for delivery errors
3. Verify webhook URL in environment variables
4. Note: Inquiries still save locally even if webhook fails

## Contact

For questions about deployment:
- Email: npdigitalinfo@gmail.com
- Phone: +91 88665 9566
- Website: https://www.npdigital.in
