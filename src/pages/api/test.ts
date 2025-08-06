import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabaseAdmin
    .from('email_templates')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ templates: data });
}
