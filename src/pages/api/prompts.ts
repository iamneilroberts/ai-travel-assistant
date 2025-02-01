import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const promptsDir = path.join(process.cwd(), 'prompts');
    const prompts = fs.readdirSync(promptsDir)
      .filter(file => file.endsWith('.md'))
      .sort();
    
    res.status(200).json(prompts);
  } catch (error) {
    console.error('Error reading prompts directory:', error);
    res.status(500).json([]);
  }
}
