import { createClient } from '@supabase/supabase-js';

// Diqqat: O'zingizning haqiqiy URL va Key'ingizni qo'shtirnoq ichiga yozing!
const supabaseUrl = 'https://ycidujndvedciastpyyn.supabase.co'; 
const supabaseKey = 'sb_publishable_UU3MdFex0tssBrmnxmrIMA_MOfxyLk0'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
