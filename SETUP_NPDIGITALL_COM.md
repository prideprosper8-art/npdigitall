# Setup npdigitall.com with Netlify - Complete Guide

## 🌐 Your Domain: npdigitall.com (GoDaddy)

This guide will connect your GoDaddy domain to your Netlify site.

**Time needed:** 5-10 minutes setup + 2-4 hours DNS propagation

---

## 🚀 Step-by-Step Setup

### Step 1: Add Domain to Netlify

1. **Go to Netlify Domain Settings:**
   https://app.netlify.com/sites/npdigitall/configuration/domain

2. **Click "Add domain" or "Add custom domain"**

3. **Enter your domain:**
   ```
   npdigitall.com
   ```

4. **Click "Verify"**

5. **Click "Yes, add domain"** (Netlify will confirm you own it)

6. **Important:** Also add the www version:
   - Click "Add domain alias" or "Add domain"
   - Enter: `www.npdigitall.com`
   - Click "Add domain"

### Step 2: Choose DNS Method

Netlify will ask: **"Do you want to use Netlify DNS?"**

I recommend **YES** (easier option). Here's why:
- ✅ Simpler setup
- ✅ Automatic SSL/HTTPS
- ✅ Better performance
- ✅ Easier to manage

**Click "Use Netlify DNS"**

### Step 3: Get Netlify Nameservers

Netlify will show you **4 nameservers** like:
```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

**Copy these** (or keep this tab open - you'll need them)

---

## 🔧 Step 4: Update Nameservers in GoDaddy

### A. Login to GoDaddy

1. Go to: https://www.godaddy.com
2. Click **"Sign In"** (top right)
3. Enter your credentials

### B. Access Domain Settings

1. After login, click your **profile icon** (top right)
2. Click **"My Products"**
3. Find **"Domains"** section
4. Find **npdigitall.com**
5. Click the **three dots (⋮)** next to it
6. Click **"Manage DNS"**

### C. Change Nameservers

1. Scroll down to **"Nameservers"** section
2. Click **"Change"** button
3. Select **"I'll use my own nameservers"** or **"Custom"**
4. You'll see input fields for nameservers

5. **Enter the 4 Netlify nameservers:**
   - Nameserver 1: `dns1.p01.nsone.net`
   - Nameserver 2: `dns2.p01.nsone.net`
   - Nameserver 3: `dns3.p01.nsone.net`
   - Nameserver 4: `dns4.p01.nsone.net`

   (Use the ones Netlify gave you - they might be slightly different)

6. Click **"Save"**

7. **Confirm:** GoDaddy will warn you about changing nameservers. Click **"Continue"** or **"OK"**

---

## ⏱️ Step 5: Wait for DNS Propagation

**This is the waiting part:**
- DNS changes take time to spread across the internet
- **Typical time:** 2-4 hours
- **Maximum:** 24-48 hours (rare)

### Check DNS Status:

**Option 1: Use Online Tool**
1. Go to: https://www.whatsmydns.net
2. Enter: `npdigitall.com`
3. Select: `NS` (Nameserver) in dropdown
4. Click search
5. Wait until you see Netlify nameservers globally

**Option 2: Command Line**
```bash
nslookup -type=NS npdigitall.com
```
Should show Netlify nameservers

### What You Can Do While Waiting:
- ☕ Get coffee
- 📧 Check other emails
- 🎮 Take a break
- ✅ Connect GitHub to Netlify (if not done yet)

---

## 🔒 Step 6: Enable HTTPS (After DNS Propagates)

Once DNS has propagated (2-4 hours later):

1. **Go back to Netlify:**
   https://app.netlify.com/sites/npdigitall/configuration/domain

2. Find **"HTTPS"** section

3. Click **"Verify DNS configuration"**

4. If verified, click **"Provision certificate"**

5. Wait **2-3 minutes**

6. ✅ **Done!** You'll see "Your site has HTTPS enabled"

---

## ✅ Step 7: Test Your Domain

Once everything is set up:

### Test These URLs:
- ✅ http://npdigitall.com → Should redirect to https://npdigitall.com
- ✅ https://npdigitall.com → Should load your site
- ✅ http://www.npdigitall.com → Should redirect to https://npdigitall.com
- ✅ https://www.npdigitall.com → Should work
- ✅ https://npdigitall.netlify.app → Should redirect to your custom domain

### Expected Behavior:
- All URLs should work
- All HTTP automatically redirects to HTTPS
- www and non-www both work (redirects to primary)

---

## 🎯 Primary Domain Setting

**Set which version is primary:**

1. Go to: https://app.netlify.com/sites/npdigitall/configuration/domain

2. Find your domains listed:
   - `npdigitall.com`
   - `www.npdigitall.com`

3. Click **"Options"** (three dots) next to your preferred one

4. Click **"Set as primary domain"**

**Recommended:** Use `npdigitall.com` (without www) as primary

**Result:** All other URLs will redirect to your primary domain

---

## 📧 Email Setup (Optional)

GoDaddy doesn't automatically provide email with domain registration.

### Option 1: GoDaddy Email (Paid)
- Go to: https://www.godaddy.com/email
- Purchase email plan (~$6/month)
- email@npdigitall.com

### Option 2: Google Workspace (Recommended)
- Go to: https://workspace.google.com
- Professional email: email@npdigitall.com
- Cost: $6/user/month
- Includes Gmail, Drive, Calendar

### Option 3: Zoho Mail (Free)
- Go to: https://www.zoho.com/mail
- Free for up to 5 users
- email@npdigitall.com

### Option 4: Email Forwarding (Free)
- In GoDaddy, set up forwarding
- Forward contact@npdigitall.com → npdigitalinfo@gmail.com
- No cost, but can't send from custom domain

**Note:** If you use Netlify DNS, you'll need to add MX records from your email provider

---

## 🚨 Troubleshooting

### "Domain verification failed"
**Solution:** 
- Make sure nameservers are updated in GoDaddy
- Wait 24 hours for full propagation
- Try again

### "HTTPS provisioning failed"
**Solution:**
- Verify DNS is fully propagated first
- Click "Verify DNS configuration" again
- Wait another hour and retry
- If still failing after 48 hours, contact Netlify support

### Website shows GoDaddy parking page
**Solution:**
- Nameservers haven't updated yet
- Clear browser cache (Ctrl+Shift+Delete)
- Wait another 2-4 hours
- Check whatsmydns.net to verify propagation

### SSL certificate pending
**Solution:**
- This is normal - can take 2-5 minutes
- Refresh the Netlify page
- If stuck for >30 minutes, click "Provision certificate" again

### Email not working
**Solution:**
- Domain pointing and email are separate services
- You need to purchase email hosting separately
- OR set up email forwarding in GoDaddy
- OR use third-party email (Google Workspace, Zoho)

---

## 📊 Timeline Summary

| Step | Time |
|------|------|
| Add domain to Netlify | 2 minutes |
| Update GoDaddy nameservers | 3 minutes |
| **DNS propagation** | **2-4 hours** ⏱️ |
| Provision HTTPS certificate | 2-3 minutes |
| **Total** | **2-4 hours** |

---

## ✅ Completion Checklist

- [ ] Domain added to Netlify (npdigitall.com)
- [ ] WWW version added (www.npdigitall.com)
- [ ] Nameservers updated in GoDaddy
- [ ] DNS propagation complete (verified on whatsmydns.net)
- [ ] HTTPS certificate provisioned
- [ ] Primary domain set (npdigitall.com or www.npdigitall.com)
- [ ] All URLs tested and working
- [ ] HTTP redirects to HTTPS
- [ ] Old netlify.app URL redirects to custom domain

---

## 🎉 After Setup

Once complete, your website will be live at:
- **Primary:** https://npdigitall.com
- **Also works:** https://www.npdigitall.com

### Your Emails:
- **Contact:** contact@npdigitall.com (once email is set up)
- **General:** npdigitalinfo@gmail.com

### Your Contact Info:
- **Website:** npdigitall.com
- **Emails:** npdigitalinfo@gmail.com, contact@npdigitall.com
- **Phone:** +263 71 694 2118 / +91 88665 9566
- **Location:** Harare, Zimbabwe

---

## 📞 Need Help?

**GoDaddy Support:**
- Phone: Check your GoDaddy account for support number
- Chat: Available in GoDaddy dashboard
- Help: https://www.godaddy.com/help

**Netlify Support:**
- Forum: https://answers.netlify.com
- Docs: https://docs.netlify.com
- Support: https://www.netlify.com/support

---

## 🔄 Update Website Contact Info (After Domain is Live)

Once your domain is live, I can update the website to show:
- **Website:** npdigitall.com (instead of npdigital.in)

Just let me know when the domain is working and I'll update all references!

---

**Start with Step 1 and work your way through. The hardest part is just waiting for DNS propagation! 🚀**
