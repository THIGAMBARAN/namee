import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Check if environment variables are available
export const hasSupabaseConfig = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Create Supabase client only if config is available
export const createSupabaseClient = () => {
  if (!hasSupabaseConfig()) {
    // Return a mock client that throws helpful errors
    return {
      auth: {
        signUp: () => Promise.reject(new Error("Supabase not configured")),
        signInWithPassword: () => Promise.reject(new Error("Supabase not configured")),
        signOut: () => Promise.reject(new Error("Supabase not configured")),
        getUser: () => Promise.reject(new Error("Supabase not configured")),
        getSession: () => Promise.reject(new Error("Supabase not configured")),
      },
      from: () => ({
        select: () => Promise.reject(new Error("Supabase not configured")),
        insert: () => Promise.reject(new Error("Supabase not configured")),
        update: () => Promise.reject(new Error("Supabase not configured")),
        delete: () => Promise.reject(new Error("Supabase not configured")),
      }),
    } as any
  }

  return createClientComponentClient()
}
