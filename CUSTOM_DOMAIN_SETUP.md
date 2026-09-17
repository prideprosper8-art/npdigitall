# Custom Domain Setup Guide

## 🌐 Your Custom Domain

**What domain did you buy?** (e.g., npdigital.com, npdigitall.com, etc.)

This guide will help you connect your custom domain to your Netlify site.

## 📋 Before You Start

You'll need:
- ✅ Your domain name (the one you purchased)
- ✅ Access to your domain registrar (where you bought it)
- ✅ Netlify dashboard access

## 🚀 Option 1: Use Netlify DNS (Recommended - Easiest)

### Step 1: Add Domain to Netlify

1. Go to: **https://app.netlify.com/sites/npdigitall/configuration/domain**

2. Click **"Add domain"** or **"Add custom domain"**

3. Enter your domain name:
   - If you bought `npdigital.com`, enter: `npdigital.com`
   - Also add `www.npdigital.com` (optional but recommended)

4. Click **"Verify"**

5. If you own the domain, click **"Yes, add domain"**

### Step 2: Use Netlify DNS (Easiest Method)

1. Netlify will ask: **"Do you want Netlify to manage DNS for this domain?"**

2. Click **"Yes, use Netlify DNS"**

3. You'll see **4 nameservers** like:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

4. **Copy these nameservers** (you'll need them next)

### Step 3: Update Nameservers at Your Registrar

Go to where you bought your domain (common registrars):

#### If you bought from **Namecheap:**
1. Login to Namecheap
2. Go to Domain List → Click your domain
3. Find "Nameservers" section
4. Select "Custom DNS"
5. Paste the 4 Netlify nameservers
6. Click "Save"

#### If you bought from **GoDaddy:**
1. Login to GoDaddy
2. Go to My Products → Domains
3. Click your domain → Manage DNS
4. Scroll to "Nameservers"
5. Click "Change" → "Custom"
6. Paste the 4 Netlify nameservers
7. Click "Save"

#### If you bought from **Google Domains:**
1. Login to Google Domains
2. Select your domain
3. Click "DNS" in left sidebar
4. Find "Name servers"
5. Click "Use custom name servers"
6. Add the 4 Netlify nameservers
7. Click "Save"

#### If you bought from **Hostinger/Other:**
1. Login to your domain registrar
2. Find "Domain Management" or "DNS Settings"
3. Look for "Nameservers" or "Name Servers"
4. Change to "Custom Nameservers"
5. Add the 4 Netlify nameservers
6. Save changes

### Step 4: Wait for DNS Propagation

⏱️ **DNS changes take time:**
- Usually: 30 minutes to 2 hours
- Sometimes: Up to 24-48 hours (rare)

Check status:
- Go to: https://www.whatsmydns.net
- Enter your domain name
- See if it resolves to Netlify

### Step 5: Enable HTTPS (Automatic)

1. Once DNS propagates, go back to Netlify:
   https://app.netlify.com/sites/npdigitall/configuration/domain

2. Find "HTTPS" section

3. Click **"Verify DNS configuration"**

4. Once verified, click **"Provision certificate"**

5. Wait 2-3 minutes for SSL certificate

6. ✅ Your site will be live at `https://yourdomain.com`!

---

## 🔧 Option 2: Keep Current DNS Provider (Advanced)

If you want to keep your current DNS provider (not use Netlify DNS):

### Step 1: Add Domain to Netlify

1. Go to: https://app.netlify.com/sites/npdigitall/configuration/domain
2. Click **"Add domain"**
3. Enter your domain name
4. Click **"Yes, add domain"**

### Step 2: Get Netlify's IP Address

Netlify will show you DNS records to add:

**For Apex Domain (example.com):**
```
Type: A
Name: @
Value: 75.2.60.5
```

**For WWW Subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: npdigitall.netlify.app
```

### Step 3: Add DNS Records at Your Registrar

1. Login to your domain registrar
2. Go to DNS Management or DNS Settings
3. Add the A record:
   - Type: **A**
   - Host/Name: **@** or leave blank
   - Value/Points to: **75.2.60.5**
   - TTL: **3600** (or automatic)

4. Add the CNAME record:
   - Type: **CNAME**
   - Host/Name: **www**
   - Value/Points to: **npdigitall.netlify.app**
   - TTL: **3600** (or automatic)

5. Save changes

### Step 4: Wait and Enable HTTPS

- Wait 30 minutes to 2 hours for DNS propagation
- Go to Netlify → Domain settings
- Click "Verify DNS configuration"
- Enable HTTPS once verified

---

## ✅ After Domain Setup Checklist

- [ ] Domain added to Netlify
- [ ] Nameservers updated (Option 1) OR DNS records added (Option 2)
- [ ] DNS propagation complete (check whatsmydns.net)
- [ ] HTTPS certificate provisioned
- [ ] Website loads at https://yourdomain.com
- [ ] Website loads at https://www.yourdomain.com
- [ ] Old netlify.app URL still works (redirects to custom domain)

## 🔄 Redirect Rules

Netlify automatically handles:
- ✅ HTTP → HTTPS redirect
- ✅ www → non-www (or vice versa)
- ✅ netlify.app → your custom domain

You can configure redirect preferences at:
https://app.netlify.com/sites/npdigitall/configuration/domain

## 📧 Email Setup (Optional)

**Note:** Netlify only hosts websites, not email. For email:

### Option 1: Use Gmail for Business (Google Workspace)
- $6/user/month
- email@yourdomain.com
- Setup: https://workspace.google.com

### Option 2: Use Zoho Mail (Free for 5 users)
- Free tier available
- email@yourdomain.com
- Setup: https://www.zoho.com/mail

### Option 3: Email Forwarding
- Forward yourdomain.com emails to existing Gmail
- Setup through your domain registrar
- Usually free

### MX Records for Email

If you use Netlify DNS and want email:
1. Go to Netlify DNS settings
2. Add MX records from your email provider
3. Examples:
   - **Google Workspace:** MX records from Google
   - **Zoho Mail:** MX records from Zoho

---

## 🌐 Multiple Domains (Optional)

Want both `npdigital.com` and `npdigitall.com`?

1. Add all domains in Netlify
2. Set one as "Primary domain"
3. Others automatically redirect to primary

**Example:**
- Primary: `npdigital.com`
- Redirects: `npdigitall.com` → `npdigital.com`

---

## 🚨 Troubleshooting

### "Domain already registered"
- Domain is already claimed by another Netlify account
- Make sure you're logged into the correct Netlify account
- If you own it, remove it from other account first

### DNS not propagating
- Wait 24-48 hours (usually resolves itself)
- Clear browser cache: Ctrl+Shift+Delete
- Try different browser or incognito mode
- Check DNS at: https://www.whatsmydns.net

### HTTPS certificate failing
- Make sure DNS is fully propagated first
- Verify A and CNAME records are correct
- Wait 24 hours after DNS changes
- Contact Netlify support if still failing

### Website shows "Not Found"
- Verify domain is added in Netlify
- Check DNS records are correct
- Confirm site is deployed successfully
- Hard refresh: Ctrl+Shift+R

### Email not working
- Remember: Netlify doesn't provide email hosting
- You need separate email service (Gmail, Zoho, etc.)
- Add MX records from your email provider
- MX records are separate from website DNS

---

## 📊 Expected Timeline

| Step | Time |
|------|------|
| Add domain to Netlify | 2 minutes |
| Update nameservers | 5 minutes |
| DNS propagation | 30 min - 24 hours |
| HTTPS certificate | 2-5 minutes |
| **Total** | **1-24 hours** |

Most domains work within **2-4 hours**.

---

## 📞 What Domain Did You Buy?

**Tell me your domain name and I'll give you specific instructions!**

Example:
- npdigital.com
- npdigitall.co.zw
- npdigital.africa
- etc.

Also let me know:
- **Where did you buy it?** (Namecheap, GoDaddy, Hostinger, etc.)
- **Do you want email?** (Yes/No)
- **Preferred version?** (with www or without www)

I'll create a **custom setup guide** specifically for your domain! 🎯
