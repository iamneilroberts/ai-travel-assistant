import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type ResponseData = {
  id: string;
  content: string;
  metadata: Record<string, any>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    console.log('Request body:', {
      ...req.body,
      // Log command length instead of full command for brevity
      command: req.body.command ? `(${req.body.command.length} chars)` : undefined
    });

    const { command, prompt } = req.body;
    if (!command) {
      throw new Error('Command is required');
    }

    // Read the selected prompt file
    let systemPrompt = '';
    if (prompt) {
      const promptPath = path.join(process.cwd(), 'prompts', prompt);
      console.log('Reading prompt file:', promptPath);
      try {
        systemPrompt = fs.readFileSync(promptPath, 'utf-8');
        console.log('Prompt file read successfully:', {
          length: systemPrompt.length,
          firstLine: systemPrompt.split('\n')[0]
        });
      } catch (error: unknown) {
        console.error('Error reading prompt file:', error);
        throw new Error(`Failed to read prompt file: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    try {
      // Prepare request body
      const requestBody = {
        model: 'claude-2.1',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: systemPrompt + '\n\n' + command
          }
        ],
        temperature: 0.7
      };
      console.log('API request body:', {
        ...requestBody,
        messages: requestBody.messages.map(m => ({
          role: m.role,
          contentLength: m.content.length
        }))
      });

      // Make the API call
      const apiUrl = process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages';
      console.log('Making API request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
      
      try {
        console.log('API Response text:', responseText);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}: ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('Parsed API response:', {
          id: data.id,
          hasContent: !!data.content,
          contentLength: data.content ? data.content.length : 0
        });

        res.status(200).json({
          id: data.id || 'generated-id',
          content: JSON.stringify(data),
          metadata: {}
        });
      } catch (parseError: unknown) {
        console.error('Error parsing API response:', parseError);
        throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    } catch (apiError: unknown) {
      console.error('API call error:', apiError);
      throw apiError; // Re-throw to be caught by outer try-catch
    }
  } catch (error: unknown) {
    console.error('Error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      id: 'error',
      content: JSON.stringify({ error: errorMessage }),
      metadata: {}
    });
  }
}
