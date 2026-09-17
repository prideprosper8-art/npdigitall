# Quick Start Guide - NP Digital Website

## ✅ What's New

Your contact form now:
- ✅ Only requires **Name** and **Email** (everything else is optional)
- ✅ Sends **WhatsApp notifications** when customers submit inquiries
- ✅ Saves all submissions to a local file
- ✅ Includes testimonials section with Hotelia Solutions

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up WhatsApp Notifications (5 minutes)

**Step 1:** Add CallMeBot to WhatsApp
- Save contact: `+34 644 35 80 65` as "CallMeBot"

**Step 2:** Get API Key
- Send this message to CallMeBot in WhatsApp:
  ```
  I allow callmebot to send me messages
  ```
- You'll receive your API key (e.g., "123456")

**Step 3:** Configure .env File
Edit the `.env` file in your project:
```env
NP_WHATSAPP_NUMBER=918866595566    # Your WhatsApp number
NP_WHATSAPP_API_KEY=123456          # Your API key from step 2
```

### 3. Build & Start
```bash
npm run build
npm run server:build
npm start
```

Your website is now running at: http://localhost:8787

### 4. Test the Contact Form

Open http://localhost:8787 and:
1. Scroll to the Contact section
2. Fill in:
   - Name: Test User
   - Email: test@example.com
3. Click "Send project enquiry"

**You should receive a WhatsApp message like:**
```
🔔 New Enquiry from NP Digital Website

👤 Name: Test User
📧 Email: test@example.com

🆔 ID: abc-123-xyz
⏰ 17/09/2026, 2:30 pm
```

---

## 📝 Form Field Requirements

| Field | Required? | Notes |
|-------|-----------|-------|
| Name | ✅ Yes | Minimum 2 characters |
| Email | ✅ Yes | Must be valid email |
| Phone | ❌ No | Optional |
| Service | ❌ No | Optional dropdown |
| Message | ❌ No | Optional text area |

Customers can submit with just **name and email**!

---

## 📱 WhatsApp Notification Format

When a customer submits the form, you'll receive:

**Full submission:**
```
🔔 New Enquiry from NP Digital Website

👤 Name: Rajesh Kumar
📧 Email: rajesh@example.com
📱 Phone: +91 98765 43210
🛠️ Service: Website Development

💬 Message:
I need a website for my restaurant

🆔 ID: abc-123-xyz
⏰ 17/09/2026, 2:30:45 pm
```

**Minimal submission (only name & email):**
```
🔔 New Enquiry from NP Digital Website

👤 Name: Quick Enquiry
📧 Email: quick@example.com

🆔 ID: xyz-456-abc
⏰ 17/09/2026, 3:15:20 pm
```

---

## 🗂️ Where Data is Stored

All form submissions are saved to:
```
.data/inquiries.ndjson
```

View submissions:
```bash
cat .data/inquiries.ndjson
```

Each line is a JSON object with:
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+91 98765 43210",
  "service": "Website Development",
  "message": "Project details...",
  "id": "unique-id",
  "receivedAt": "2026-09-17T09:00:00.000Z"
}
```

---

## 🌐 Deploy to Netlify

### Option 1: Quick Deploy
```bash
netlify deploy --prod --dir=dist
```

### Option 2: Connect to Git
1. Push code to GitHub
2. Connect repository in Netlify dashboard
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

**Important for WhatsApp on Netlify:**
- Add environment variables in Netlify dashboard:
  - `NP_WHATSAPP_NUMBER`
  - `NP_WHATSAPP_API_KEY`
- Or use Netlify Functions for the backend

---

## 🔧 Troubleshooting

### Not receiving WhatsApp messages?

**Check 1:** Verify .env file
```bash
cat .env
```

**Check 2:** Check server logs
Look for:
- ✅ `WhatsApp notification sent to 918866595566`
- ❌ `WhatsApp API failed` - Check API key

**Check 3:** Phone number format
- ✅ Correct: `918866595566`
- ❌ Wrong: `+91 88665 9566` (no + or spaces)

**Check 4:** Restart server
```bash
npm run server:build
npm start
```

### Form not submitting?

**Check 1:** Server running?
```bash
curl http://localhost:8787/api/health
```

**Check 2:** Browser console
Open DevTools (F12) and check for errors

**Check 3:** Test with curl
```bash
curl -X POST http://localhost:8787/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

---

## 📚 Documentation

- **Full deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **WhatsApp setup guide:** [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md)
- **Environment variables:** [.env.example](./.env.example)

---

## 📞 Need Help?

**NP Digital Support:**
- 📧 Email: npdigitalinfo@gmail.com
- 📱 Phone: +91 88665 9566
- 🌐 Website: https://www.npdigital.in

---

## ✨ Features Summary

✅ Modern, responsive design  
✅ Testimonials section (including Hotelia Solutions)  
✅ Contact form with WhatsApp notifications  
✅ Only name & email required  
✅ Automatic data backup  
✅ Rate limiting (anti-spam)  
✅ Form validation  
✅ Mobile-friendly  
✅ Fast performance  
✅ SEO optimized  

Your website is ready to go! 🚀
