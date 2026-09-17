# WhatsApp Notification Setup Guide

When customers submit the contact form, you can automatically receive notifications on WhatsApp. This guide covers multiple setup options.

## Quick Setup (Recommended for Testing)

### Option 1: CallMeBot API (Free & Simple)

CallMeBot is a free service that sends WhatsApp messages without requiring complex API setup.

**Step-by-step:**

1. **Add CallMeBot to WhatsApp Contacts**
   - Save this number: `+34 644 35 80 65`
   - Save contact name as: `CallMeBot`

2. **Get Your API Key**
   - Open WhatsApp and send this exact message to CallMeBot:
     ```
     I allow callmebot to send me messages
     ```
   - You'll receive a reply with your API key (example: `123456`)

3. **Configure Environment Variables**
   
   Create a `.env` file in your project root:
   ```env
   NP_WHATSAPP_NUMBER=918866595666
   NP_WHATSAPP_API_KEY=123456
   ```
   
   Replace:
   - `918866595666` with your WhatsApp number (country code + number, no + or spaces)
   - `123456` with your actual API key from CallMeBot

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Test It**
   Submit a test form on your website, and you should receive a WhatsApp message!

**Example WhatsApp Message You'll Receive:**
```
🔔 New Enquiry from NP Digital Website

👤 Name: Rajesh Kumar
📧 Email: rajesh@example.com
📱 Phone: +91 98765 43210
🛠️ Service: Website Development

💬 Message:
I need a professional website for my restaurant business with online ordering system.

🆔 ID: abc-123-xyz
⏰ 17/09/2026, 2:30:45 pm
```

---

## Production Setup Options

### Option 2: WhatsApp Business API (Official, Paid)

For production use with high volume, use the official WhatsApp Business API.

**Providers:**
- [Twilio WhatsApp API](https://www.twilio.com/whatsapp) - $0.005 per message
- [MessageBird](https://www.messagebird.com/whatsapp-business-api)
- [Vonage](https://www.vonage.com/communications-apis/messages/)

**Setup with Twilio:**

1. Sign up at [Twilio.com](https://www.twilio.com)
2. Get WhatsApp enabled number or sandbox
3. Create a webhook endpoint or use their API directly
4. Configure environment variables:
   ```env
   NP_WHATSAPP_WEBHOOK_URL=https://your-server.com/api/send-whatsapp
   NP_WHATSAPP_NUMBER=918866595666
   ```

### Option 3: Zapier/Make.com Integration (No-Code)

Use automation platforms to connect your form to WhatsApp.

**Using Zapier:**

1. Create a Zap: Webhook → WhatsApp (via Twilio/other service)
2. Get your webhook URL from Zapier
3. Configure:
   ```env
   NP_WHATSAPP_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/
   NP_WHATSAPP_NUMBER=918866595666
   ```

**Using Make.com:**

1. Create a scenario: Webhook → WhatsApp module
2. Use the webhook URL provided
3. Configure message format

### Option 4: Custom Webhook (DIY)

Create your own webhook server that sends WhatsApp messages.

```javascript
// Example webhook handler
app.post('/api/send-whatsapp', async (req, res) => {
  const { phone, message, inquiry } = req.body;
  
  // Your WhatsApp sending logic here
  // Could use any WhatsApp API service
  
  res.json({ ok: true });
});
```

Configure:
```env
NP_WHATSAPP_WEBHOOK_URL=https://your-domain.com/api/send-whatsapp
NP_WHATSAPP_NUMBER=918866595666
```

---

## Testing the Integration

### Test via Command Line

```bash
# Test the form submission
curl -X POST http://localhost:8787/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "service": "Website Development",
    "message": "Testing WhatsApp integration"
  }'
```

Check your WhatsApp - you should receive a message!

### Test via Website

1. Open your website: http://localhost:8787
2. Scroll to the Contact section
3. Fill in the form
4. Click "Send project enquiry"
5. Check WhatsApp for the notification

---

## Troubleshooting

### Not Receiving Messages?

**Check 1: Environment Variables**
```bash
# Verify your .env file exists and has correct values
cat .env
```

**Check 2: Server Logs**
Look for these messages in your terminal:
- ✅ `WhatsApp notification sent to 918866595666`
- ❌ `WhatsApp API failed 401` - Invalid API key
- ❌ `WhatsApp API error` - Network or service issue

**Check 3: CallMeBot API Key**
- Make sure you sent the exact message: "I allow callmebot to send me messages"
- Wait for the reply with your API key
- The API key should be numeric

**Check 4: Phone Number Format**
- ✅ Correct: `918866595666` (country code + number)
- ❌ Wrong: `+91 88665 9566` (no + or spaces)
- ❌ Wrong: `8866595666` (missing country code)

**Check 5: Rate Limits**
- CallMeBot: Free tier may have rate limits
- Wait a few minutes between tests

### Server Not Starting?

Make sure you rebuilt after adding environment variables:
```bash
npm run server:build
npm start
```

### Messages Going to Wrong Number?

Double-check the phone number in `.env`:
```env
NP_WHATSAPP_NUMBER=918866595666
```

---

## Message Customization

Edit the message format in `server/index.ts`:

```typescript
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
```

After editing, rebuild:
```bash
npm run server:build
npm start
```

---

## Security Notes

- ✅ API keys are stored in `.env` (not committed to git)
- ✅ `.env` is in `.gitignore` by default
- ✅ Never share your WhatsApp API key publicly
- ✅ Rate limiting prevents spam (5 submissions per 10 minutes)

---

## Cost Comparison

| Service | Cost | Setup Difficulty | Best For |
|---------|------|------------------|----------|
| CallMeBot | Free | ⭐ Easy | Testing, Low Volume |
| Twilio WhatsApp | ~$0.005/msg | ⭐⭐ Medium | Production |
| WhatsApp Business API | Varies | ⭐⭐⭐ Hard | Enterprise |
| Zapier | $20+/month | ⭐ Easy | No-Code Users |

---

## Need Help?

Contact NP Digital:
- 📧 Email: npdigitalinfo@gmail.com
- 📱 Phone: +91 88665 9566
- 🌐 Website: https://www.npdigital.in
