# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Configuration Required" Error

**Problem**: You see the Supabase setup screen instead of the application.

**Solution**:
1. Make sure you have a `.env.local` file in your project root
2. Verify it contains both required variables:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`
3. Restart your development server: `npm run dev`
4. Refresh your browser

### 2. "Invalid API Key" Error

**Problem**: Authentication fails with invalid API key error.

**Solution**:
1. Double-check your Supabase anon key in `.env.local`
2. Make sure you copied the **anon/public** key, not the service role key
3. Ensure there are no extra spaces or characters
4. Restart your development server

### 3. Database Connection Issues

**Problem**: "relation does not exist" or similar database errors.

**Solution**:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the `scripts/database-setup.sql` file
4. Make sure all tables are created successfully
5. Check that Row Level Security policies are enabled

### 4. Email Verification Not Working

**Problem**: Not receiving verification emails after registration.

**Solution**:
1. Check your spam/junk folder
2. In Supabase dashboard, go to Authentication → Settings
3. Make sure email confirmation is enabled
4. Check if your email provider is blocking emails from Supabase
5. Try with a different email address

### 5. "User not found" After Registration

**Problem**: Can't login after successful registration.

**Solution**:
1. Check if you verified your email address
2. Make sure the `profiles` table was created properly
3. Try registering again with a different email
4. Check Supabase Auth logs for errors

### 6. Dashboard Not Loading

**Problem**: Blank page or loading spinner on dashboard.

**Solution**:
1. Check browser console for JavaScript errors
2. Verify your user role in the `profiles` table
3. Make sure you're accessing the correct dashboard (/vendor or /supplier)
4. Clear browser cache and cookies

### 7. Products Not Showing

**Problem**: Empty product list on vendor dashboard.

**Solution**:
1. Run the `scripts/sample-data.sql` to add test products
2. Check if suppliers have added products
3. Verify the products table has data
4. Check browser console for API errors

### 8. Orders Not Working

**Problem**: Can't place orders or orders not showing.

**Solution**:
1. Make sure you're logged in as a vendor
2. Check if there are products in your cart
3. Verify the orders and order_items tables exist
4. Check Supabase logs for database errors

## Getting Help

### Check Supabase Status
1. Go to [status.supabase.com](https://status.supabase.com)
2. Check if there are any ongoing issues

### Verify Your Setup
1. **Environment Variables**: Make sure `.env.local` exists and has correct values
2. **Database**: Check that all tables exist in Supabase dashboard
3. **Authentication**: Verify auth is enabled in Supabase settings
4. **Network**: Check if you can access your Supabase project URL

### Debug Steps
1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Look for failed API requests
3. **Check Supabase Logs**: Go to Logs section in Supabase dashboard
4. **Verify Database**: Check if data is being inserted correctly

### Still Need Help?

If you're still experiencing issues:

1. **Check the setup steps again** - make sure you didn't miss anything
2. **Try with a fresh Supabase project** - sometimes starting over helps
3. **Check the GitHub repository** for any updates or known issues
4. **Contact support** with specific error messages and steps to reproduce

## Environment Variables Reference

Your `.env.local` should look like this:

\`\`\`env
# Required - Get these from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional - for development
NODE_ENV=development
\`\`\`

**Important Notes**:
- Never commit your `.env.local` file to version control
- The anon key is safe to use in the browser (it's public)
- Make sure there are no spaces around the `=` sign
- Restart your dev server after changing environment variables
