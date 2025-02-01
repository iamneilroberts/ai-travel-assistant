import fs from 'fs';
import path from 'path';

export function getAvailablePrompts(): string[] {
  const promptsDir = path.join(process.cwd(), 'prompts');
  try {
    return fs.readdirSync(promptsDir)
      .filter(file => file.endsWith('.md'))
      .sort();
  } catch (error) {
    console.error('Error reading prompts directory:', error);
    return [];
  }
}
