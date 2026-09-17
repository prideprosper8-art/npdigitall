# CI/CD Pipeline Setup - Automatic Deployments

## Current Status
✅ GitHub Repository: https://github.com/prideprosper8-art/npdigitall
✅ Netlify Site: https://npdigitall.netlify.app
⚠️ **Manual deployments only** - need to connect GitHub to Netlify

## Setup Automatic Deployments (5 minutes)

### Step 1: Connect GitHub to Netlify

1. **Go to Netlify Site Settings:**
   https://app.netlify.com/sites/npdigitall/configuration/deploys

2. **Link to Git Repository:**
   - Scroll to **"Build & deploy"** section
   - Click **"Link repository"** or **"Configure continuous deployment"**
   - Click **"GitHub"**

3. **Authorize Netlify:**
   - Grant Netlify access to your GitHub account
   - Select **"prideprosper8-art"** organization (if needed)
   - Select **"npdigitall"** repository

4. **Configure Build Settings:**
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Branch to deploy:** `main`

5. **Click "Deploy site"**

### Step 2: Verify Automatic Deployment

Once connected, **every push to GitHub** will trigger:
1. ✅ Netlify pulls latest code from GitHub
2. ✅ Runs `npm install`
3. ✅ Runs `npm run build`
4. ✅ Deploys `dist` folder to production
5. ✅ Your site is live at https://npdigitall.netlify.app

### Step 3: Test It

1. Make a small change to any file
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test CI/CD pipeline"
   git push
   ```
3. Watch deployment at: https://app.netlify.com/sites/npdigitall/deploys
4. Check live site after deploy completes

## CI/CD Pipeline Flow

```
┌─────────────────┐
│  Code Changes   │
│   (Local Dev)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Git Commit    │
│   & Push to     │
│  GitHub (main)  │
└────────┬────────┘
         │
         ↓ (Webhook triggers Netlify)
┌─────────────────┐
│ Netlify Starts  │
│  Build Process  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  npm install    │
│  (Dependencies) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  npm run build  │
│  (Vite builds   │
│   to dist/)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Netlify Deploys │
│  dist/ folder   │
│   to CDN        │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   🚀 LIVE!      │
│ npdigitall.net  │
│  lify.app       │
└─────────────────┘
```

## Build Configuration

Already configured in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self'"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
```

## Benefits of CI/CD

✅ **Automatic deployments** - Push to GitHub → Live in minutes
✅ **No manual steps** - No need to run `netlify deploy` manually
✅ **Build logs** - See build output and errors in Netlify dashboard
✅ **Deploy previews** - Pull requests get preview URLs automatically
✅ **Rollback capability** - Easily revert to previous deploys
✅ **Branch deploys** - Deploy from different branches for testing
✅ **Notifications** - Get email/Slack alerts on deploy success/failure

## Advanced: Deploy Previews for Pull Requests

Once connected, Netlify automatically creates **preview deployments** for every pull request:

1. Create a new branch: `git checkout -b feature/new-feature`
2. Make changes and push: `git push origin feature/new-feature`
3. Create a Pull Request on GitHub
4. Netlify builds and deploys a **preview URL**
5. Preview URL is unique: `https://deploy-preview-123--npdigitall.netlify.app`
6. Test changes before merging to main
7. Merge PR → Automatically deploys to production

## Monitoring Deployments

**Netlify Dashboard:**
- View all deploys: https://app.netlify.com/sites/npdigitall/deploys
- See build logs: Click any deploy → "Deploy log"
- Monitor build time, errors, and warnings

**GitHub Integration:**
- See deploy status on commits (✅ or ❌)
- Deploy previews linked in Pull Requests
- Commit SHA tracked for each deploy

## Troubleshooting

### Build Fails
1. Check build log in Netlify dashboard
2. Verify `npm run build` works locally
3. Check for missing environment variables
4. Ensure Node.js version compatibility

### Deploy Doesn't Update
1. Check if build succeeded in Netlify dashboard
2. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check CDN cache (may take 1-2 minutes)
4. Verify correct branch is deployed

### Forms Not Working
1. Go to: https://app.netlify.com/sites/npdigitall/settings/forms
2. Enable form detection
3. Add email notifications

## Environment Variables (If Needed)

If you need environment variables:

1. Go to: https://app.netlify.com/sites/npdigitall/configuration/env
2. Click **"Add variable"**
3. Add key-value pairs (e.g., `API_KEY=your_key_here`)
4. Variables are available during build process

## Current Deployment Method

**Manual CLI Deployment (what we've been doing):**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**After GitHub Integration (automatic):**
```bash
git add .
git commit -m "Your changes"
git push
# ✅ Automatically deploys!
```

---

## Quick Start Checklist

- [ ] Connect GitHub repo to Netlify (Step 1 above)
- [ ] Verify build settings (npm run build, dist folder)
- [ ] Test push to GitHub
- [ ] Check deployment success in Netlify dashboard
- [ ] Verify live site updated

**Once connected, you'll never need to manually deploy again!**
