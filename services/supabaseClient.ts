import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkpbzgvsijlafuqheaub.supabase.co';
const supabaseKey = 'sb_publishable_1UguTbnpUc4OdPKyIi-AZA_wHVlV330';

export const supabase = createClient(supabaseUrl, supabaseKey);