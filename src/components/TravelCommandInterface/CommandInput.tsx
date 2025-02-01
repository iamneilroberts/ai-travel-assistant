import React, { useState } from 'react';

interface CommandInputProps {
  onSubmit: (command: string, prompt?: string) => void;
  isLoading: boolean;
  availablePrompts: string[];
}

export default function CommandInput({ onSubmit, isLoading, availablePrompts }: CommandInputProps) {
  const [command, setCommand] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedPrompt') || '';
    }
    return '';
  });

  const handlePromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPrompt(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPrompt', value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(command, selectedPrompt);
  };

  const handleClear = () => {
    setCommand('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <select
          value={selectedPrompt}
          onChange={handlePromptChange}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        >
          <option value="">Select a system prompt</option>
          {availablePrompts.map((prompt) => (
            <option key={prompt} value={prompt}>
              {prompt.replace('.md', '')}
            </option>
          ))}
        </select>
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your travel command..."
          disabled={isLoading}
          rows={6}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading || !command.trim()}
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          disabled={isLoading || !command.trim()}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
