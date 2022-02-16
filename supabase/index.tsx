import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export const supabase = createClient(
  'https://edtiyjubhafpeefmhqed.supabase.co/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzczODQxMCwiZXhwIjoxOTQ5MzE0NDEwfQ.qGU2b4U-wLWPAft_pKcka7AkZPp0OnMuiSTHEhYi3ig',
  {
    localStorage: AsyncStorage as any,
    detectSessionInUrl: false,
    // autoRefreshToken: true,
    // persistSession: true
    // url: string,
    // headers?: { [key: string]: string },
  });