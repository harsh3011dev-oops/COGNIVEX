const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let db = null;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url') {
    db = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn("Supabase credentials missing or default. DB calls will fail unless configured.");
}

module.exports = db;
