
import { createClient } from '@supabase/supabase-js';

// Safely retrieve environment variables to prevent runtime errors if import.meta.env is undefined
const getEnvVar = (key: string): string => {
  try {
    // Check Vite's import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        // @ts-ignore
        return import.meta.env[key];
    }
    // Check standard process.env
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        // @ts-ignore
        return process.env[key];
    }
  } catch (e) {
    console.warn(`Error reading env var ${key}`, e);
  }
  return '';
};

// Use placeholders if keys are missing to prevent createClient from throwing "supabaseUrl is required"
// This allows the app to load and hit the try/catch blocks in App.tsx/DataContext.ts which handle the connection failure by using Mock Data.
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://placeholder.supabase.co';
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
