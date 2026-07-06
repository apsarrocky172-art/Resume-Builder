"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseKey) {
    console.warn('[Database] Missing Supabase URL or Key in environment variables.');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const connectDB = async () => {
    console.log('[Database] Supabase Client Initialized.');
};
exports.connectDB = connectDB;
