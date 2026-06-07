// Future Supabase client setup
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabase = {
  auth: {
    signIn: () => console.log("Sign in mock"),
    signOut: () => console.log("Sign out mock")
  }
}
