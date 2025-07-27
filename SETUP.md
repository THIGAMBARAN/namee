# Setup Instructions

## Quick Setup Guide

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 2. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to Settings > API
3. Copy your Project URL and anon/public key
4. Paste them into your `.env.local` file

### 3. Set Up Database

1. In your Supabase dashboard, go to the SQL Editor
2. Run the contents of `scripts/database-setup.sql`
3. Optionally, run `scripts/sample-data.sql` for test data

### 4. Run the Application

\`\`\`bash
npm install
npm run dev
\`\`\`

### 5. Test the Application

- Visit `http://localhost:3000`
- Register as a vendor or supplier
- Test the functionality

## Troubleshooting

### Environment Variables Error
If you see "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables are required", make sure:

1. You have created a `.env.local` file in the root directory
2. The file contains both required environment variables
3. You have restarted your development server after adding the variables

### Database Errors
If you encounter database errors:

1. Make sure you've run the database setup script
2. Check that your Supabase project is active
3. Verify your database connection in the Supabase dashboard

### Authentication Issues
If authentication isn't working:

1. Check that your Supabase project has authentication enabled
2. Verify your environment variables are correct
3. Make sure you're using the correct project URL and anon key

## Need Help?

1. Check the Supabase documentation: https://supabase.com/docs
2. Verify your project settings in the Supabase dashboard
3. Make sure all environment variables are properly set
