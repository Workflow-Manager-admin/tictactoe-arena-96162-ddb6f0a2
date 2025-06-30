# Supabase Integration for React Frontend

## Supabase Project Info
- **Project name**: tic_tac_toe_app
- **Supabase URL**: `https://sifshblvwjgyketwesog.supabase.co`
- **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZnNoYmx2d2pneWtldHdlc29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMDE4NzksImV4cCI6MjA2Njg3Nzg3OX0.ZDxL8P5gYekwUnzWEsB2TZugTAwncNK_UJmL6cieUMw`

## How to Connect
- Install the official supabase-js client:
  ```
  npm install @supabase/supabase-js
  ```
- Add the following to your codebase (e.g., in a `supabaseClient.js` file):
  ```js
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```
- Import the supabase client wherever you need database/auth/storage access.

## Authentication Integration
- Use Supabase auth for sign-up/sign-in and session management.
- Example (sign up):
  ```js
  const { user, error } = await supabase.auth.signUp({ email, password });
  ```

## Storage Integration
- Use Supabase Storage for file uploads (e.g., avatars or game data).
- Example:
  ```js
  const { data, error } = await supabase.storage.from('avatars').upload('user1/avatar.png', file);
  ```

## Additional Notes
- This `.env` method ensures your API keys are not bundled into client code except as needed (Anon key is safe for frontend).
- Document further integration steps and Supabase schema changes here.
