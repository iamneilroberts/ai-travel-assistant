import React from 'react';
import TravelCommandInterface from '../components/TravelCommandInterface';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Travel Assistant</h1>
      <TravelCommandInterface />
    </div>
  );
}
