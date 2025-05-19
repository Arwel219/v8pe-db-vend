// Inserisci le tue credenziali
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://cynshbqlpgghjgwltukp.supabase.co'; // trova nella dashboard
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bnNoYnFscGdnaGpnd2x0dWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTY4MjIsImV4cCI6MjA2MzIzMjgyMn0.uJ0VMtAoqawydknYNwdwQxGsvdSPW49Y36Seo9WNCQ8'; // key pubblica
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
