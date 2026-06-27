const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_KEY;
const supabaseKey = serviceRoleKey || anonKey;

let db = null;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url') {
    db = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    if (serviceRoleKey) {
        console.log('Supabase: using service role key (bypasses RLS for backend).');
    } else {
        console.warn(
            'Supabase: using anon key. Set SUPABASE_SERVICE_ROLE_KEY in backend/.env ' +
            'or add read policies in question_bank_rls.sql to avoid empty question bank queries.'
        );
    }
} else {
    console.warn('Supabase credentials missing or default. DB calls will fail unless configured.');
}

module.exports = db;
