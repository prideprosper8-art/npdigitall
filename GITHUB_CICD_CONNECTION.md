# Connect GitHub to Netlify - Step by Step

## ✅ What This Does

After this setup, every time you push code to GitHub, it will **automatically deploy** to your live website. No more manual `netlify deploy` commands!

## 🚀 Steps to Connect

### Step 1: Open Netlify Site Settings

Go to this URL:
**https://app.netlify.com/sites/npdigitall/configuration/deploys**

Or:
1. Go to https://app.netlify.com
2. Click on **"npdigitall"** site
3. Click **"Site configuration"** in the top menu
4. Click **"Build & deploy"** in the left sidebar

### Step 2: Link to Git Repository

1. Look for **"Continuous deployment"** section
2. Click **"Link site to Git"** or **"Link repository"**
3. You'll see three options:
   - GitHub
   - GitLab
   - Bitbucket

4. Click **"GitHub"**

### Step 3: Authorize Netlify (If Asked)

If this is your first time connecting:
1. A popup window will open asking for GitHub authorization
2. Click **"Authorize Netlify"**
3. You may need to enter your GitHub password
4. Grant Netlify access to your repositories

### Step 4: Select Your Repository

1. You'll see a list of your GitHub repositories
2. Search for or scroll to: **"npdigitall"**
3. Click on **"prideprosper8-art/npdigitall"**

### Step 5: Configure Build Settings

Netlify should auto-detect these settings (verify they match):

```
Base directory:        (leave empty)
Build command:         npm run build
Publish directory:     dist
Production branch:     main
```

**Important:** Make sure these are correct!

### Step 6: Deploy Site

1. Review the settings
2. Click **"Deploy site"** or **"Save & Deploy"**
3. Netlify will immediately start building and deploying

### Step 7: Verify It Worked

1. Watch the deployment at: https://app.netlify.com/sites/npdigitall/deploys
2. Wait for "Published" status (usually 2-3 minutes)
3. Visit your live site: https://npdigitall.netlify.app
4. Should show your latest code!

## ✅ Testing Automatic Deployments

### Test 1: Make a Small Change

1. Open any file locally (e.g., README.md)
2. Add a comment or change something minor
3. Run these commands:
   ```bash
   git add .
   git commit -m "Test automatic deployment"
   git push
   ```

### Test 2: Watch It Deploy

1. Go to: https://app.netlify.com/sites/npdigitall/deploys
2. You should see a new deploy starting automatically
3. Click on it to see the build log
4. Wait for "Published" status
5. Refresh your website - changes are live!

## 🎉 Success Indicators

You'll know it worked when:
- ✅ Green checkmark on GitHub commit
- ✅ "Published" status in Netlify dashboard
- ✅ Your changes appear on the live site
- ✅ No need to run `netlify deploy` manually anymore!

## 📊 What Happens on Each Push

```
1. You push code to GitHub
   ↓
2. GitHub webhook notifies Netlify
   ↓
3. Netlify pulls latest code
   ↓
4. Netlify runs: npm install
   ↓
5. Netlify runs: npm run build
   ↓
6. Netlify deploys dist/ folder
   ↓
7. 🚀 Your site is LIVE!
```

**Time:** Usually 2-3 minutes from push to live

## 🔍 Monitoring Deployments

**Netlify Dashboard:**
https://app.netlify.com/sites/npdigitall/deploys

You'll see:
- ✅ All deployments (successful and failed)
- ⏱️ Build time for each deploy
- 📝 Build logs (click any deploy to see details)
- 🔄 Deploy status (In Progress, Published, Failed)

**GitHub Integration:**
- Commits will show deploy status
- ✅ Green check = Deploy succeeded
- ❌ Red X = Build failed (check Netlify logs)

## ⚙️ Advanced Features (Once Connected)

### Deploy Previews for Pull Requests
- Create a new branch
- Push changes
- Open a Pull Request
- Netlify creates a **preview URL** automatically
- Test before merging to production

### Branch Deploys
- Deploy from different branches
- Test features before going live
- Each branch gets its own URL

### Rollback
- Go to https://app.netlify.com/sites/npdigitall/deploys
- Click on any previous deploy
- Click **"Publish deploy"**
- Instantly rollback to that version

## 🚨 Troubleshooting

### "No repositories found"
- Make sure you authorized Netlify to access your GitHub
- Go to GitHub → Settings → Applications → Netlify
- Grant access to repositories

### Build fails
- Check build log in Netlify dashboard
- Verify `npm run build` works locally
- Check for typos in build command

### Site doesn't update
- Check deploy status (should be "Published")
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Wait 2-3 minutes for CDN cache

### Wrong branch deploying
- Go to: Site settings → Build & deploy → Continuous deployment
- Change "Production branch" to `main`
- Save changes

## 📝 Current Configuration

Your repository:
- **GitHub:** https://github.com/prideprosper8-art/npdigitall
- **Branch:** main

Your Netlify site:
- **Site:** npdigitall.netlify.app
- **Dashboard:** https://app.netlify.com/sites/npdigitall

Build settings (already in netlify.toml):
- **Command:** `npm run build`
- **Directory:** `dist`
- **Node version:** Auto-detected from package.json

## ✅ After Connection Checklist

- [ ] GitHub repository linked to Netlify
- [ ] First automatic deploy succeeded
- [ ] Test push triggers new deploy
- [ ] Live site shows latest changes
- [ ] Build logs are accessible
- [ ] Email notifications enabled (optional)

---

**Once connected, your workflow becomes:**

```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push

# That's it! Netlify handles the rest.
```

No more manual deployments! 🎉
