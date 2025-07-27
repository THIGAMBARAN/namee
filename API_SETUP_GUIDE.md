# Supabase API Setup Guide

## Quick Start (5 minutes)

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project name (e.g., "SupplyConnect")
5. Enter a secure database password
6. Select a region close to your users
7. Click "Create new project"

### Step 2: Get Your API Keys
1. Wait for your project to finish setting up (1-2 minutes)
2. Go to **Settings** → **API** in the left sidebar
3. You'll see two important values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIs...` (long string)

### Step 3: Configure Your Environment
1. In your project root, create a file called `.env.local`
2. Add these lines (replace with your actual values):

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...your-actual-key
\`\`\`

### Step 4: Set Up Database
1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `scripts/database-setup.sql`
3. Click "Run" to create your tables
4. Optionally run `scripts/sample-data.sql` for test data

### Step 5: Restart Your Server
\`\`\`bash
npm run dev
\`\`\`

## Security Notes
- ✅ **anon/public key** is safe to use in frontend code
- ❌ **service_role key** should NEVER be used in frontend code
- The `.env.local` file is automatically ignored by Git

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the full anon key (it's very long)
- Make sure there are no extra spaces or line breaks
- Verify the project URL is correct

### "Project not found" error
- Confirm your project URL matches exactly
- Make sure your project is fully deployed (check dashboard)

### Environment variables not loading
- Restart your development server after creating `.env.local`
- Make sure the file is in your project root (same level as `package.json`)
- Check that variable names start with `NEXT_PUBLIC_`

## Need Help?
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
