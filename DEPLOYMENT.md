# GitHub Pages Deployment Guide

## Setup Instructions

### 1. Create GitHub Repository

Go to GitHub and create a new repository named `happiness-vibe`:
- https://github.com/new
- Repository name: `happiness-vibe`
- Set to Public (required for GitHub Pages on free tier)
- Do NOT initialize with README, .gitignore, or license (we already have these)

### 2. Add Remote and Push

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/happiness-vibe.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. Save the settings

### 4. Trigger Deployment

The workflow will automatically run when you push to main. To manually trigger:

1. Go to **Actions** tab in your repository
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button

### 5. Access Your Site

After deployment completes (usually 1-2 minutes), your site will be available at:

```
https://YOUR_USERNAME.github.io/happiness-vibe/
```

## Local Testing

To test the production build locally:

```bash
# Build the static export
npm run build

# Serve the out directory
npx serve out
```

Then visit http://localhost:3000/happiness-vibe/

## Updating the Site

Simply push to the main branch:

```bash
git add .
git commit -m "Your changes"
git push
```

The GitHub Action will automatically rebuild and deploy.

## Configuration

The deployment is configured in:
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `next.config.js` - Next.js export and basePath settings
- `.nojekyll` - Prevents GitHub's Jekyll processing

## Troubleshooting

### Build Fails
Check the Actions tab to see build logs. Common issues:
- Missing dependencies
- TypeScript errors
- Build configuration issues

### Site Shows 404
- Ensure GitHub Pages is set to use GitHub Actions as source
- Check that the workflow completed successfully
- Verify the basePath in next.config.js matches your repo name

### Styles Not Loading
- Check browser console for 404 errors on CSS files
- Verify the basePath is correct
- Ensure .nojekyll file exists in the repository

## Alternative: Different Repository Name

If you want to use a different repository name, update `next.config.js`:

```javascript
basePath: '/your-repo-name',
```

Then rebuild and push.
