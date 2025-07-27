# Deployment Guide

## Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- Working Supabase project

### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   \`\`\`

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 3: Add Environment Variables
1. In Vercel project settings, go to "Environment Variables"
2. Add your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   \`\`\`
3. Make sure to add them for all environments (Production, Preview, Development)

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your live application!

### Step 5: Configure Supabase for Production
1. In your Supabase project, go to Authentication → URL Configuration
2. Add your Vercel domain to "Site URL": `https://your-app.vercel.app`
3. Add your domain to "Redirect URLs": `https://your-app.vercel.app/**`

## Deploy to Netlify

### Step 1: Build Settings
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Step 2: Environment Variables
1. Go to Site settings → Environment variables
2. Add your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   \`\`\`

### Step 3: Deploy
1. Click "Deploy site"
2. Configure Supabase URLs as described above

## Custom Domain Setup

### For Vercel:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update Supabase URL configuration

### For Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS
4. Update Supabase settings

## Environment Variables for Production

Make sure these are set in your deployment platform:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] User registration works
- [ ] Email verification works
- [ ] Login/logout functions properly
- [ ] Vendor dashboard accessible
- [ ] Supplier dashboard accessible
- [ ] Products can be added/viewed
- [ ] Orders can be placed
- [ ] Database operations work correctly

## Monitoring and Maintenance

### Supabase Monitoring
- Check Supabase dashboard for usage metrics
- Monitor database performance
- Review authentication logs
- Set up alerts for errors

### Application Monitoring
- Use Vercel Analytics for performance insights
- Monitor error rates and response times
- Set up uptime monitoring
- Review user feedback and bug reports

## Scaling Considerations

### Database
- Monitor Supabase usage limits
- Consider upgrading plan if needed
- Optimize queries for better performance
- Set up database backups

### Application
- Use Vercel's edge functions for better performance
- Implement caching strategies
- Optimize images and assets
- Consider CDN for static assets

## Security Best Practices

### Supabase Security
- Regularly review Row Level Security policies
- Monitor authentication logs
- Keep Supabase updated
- Use strong database passwords

### Application Security
- Keep dependencies updated
- Use HTTPS everywhere
- Implement proper error handling
- Regular security audits

## Backup and Recovery

### Database Backups
- Supabase automatically backs up your database
- Consider additional backup strategies for critical data
- Test restore procedures regularly

### Code Backups
- Use Git for version control
- Keep multiple branches for different environments
- Tag releases for easy rollback
