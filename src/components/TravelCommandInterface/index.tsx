import React, { useState, useEffect } from 'react';
import { TravelCommand, TravelResponse } from '../../types/travel';
import CommandInput from './CommandInput';
import ResponseDisplay from './ResponseDisplay';

export default function TravelCommandInterface() {
  const [command, setCommand] = useState<TravelCommand | null>(null);
  const [response, setResponse] = useState<TravelResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availablePrompts, setAvailablePrompts] = useState<string[]>([]);

  useEffect(() => {
    // Fetch available prompts from API
    const fetchPrompts = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const response = await fetch(`${apiBase}/prompts`);
        if (response.ok) {
          const prompts = await response.json();
          setAvailablePrompts(prompts);
        } else {
          console.error('Failed to fetch prompts');
          setAvailablePrompts([]);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setAvailablePrompts([]);
      }
    };
    
    fetchPrompts();
  }, []);

  const handleSubmit = async (commandText: string, prompt?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const newCommand: TravelCommand = {
        command: commandText,
        prompt,
        timestamp: new Date(),
        status: 'pending'
      };
      setCommand(newCommand);

      // TODO: Implement API call
      const apiResponse = await processCommand(commandText, prompt);
      
      setResponse(apiResponse);
      newCommand.status = 'success';
      setCommand(newCommand);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      if (command) {
        command.status = 'error';
        setCommand(command);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <CommandInput 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        availablePrompts={availablePrompts}
      />
      {error && <div className="text-red-500">{error}</div>}
      <ResponseDisplay response={response} />
    </div>
  );
}

async function processCommand(command: string, prompt?: string): Promise<TravelResponse> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const response = await fetch(`${apiBase}/travel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command,
        prompt
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      content: JSON.stringify(data),
      created_at: new Date(),
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Error processing command:', error);
    throw error;
  }
}
