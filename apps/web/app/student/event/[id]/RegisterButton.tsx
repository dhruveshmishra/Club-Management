'use client';

import { useState } from 'react';
import { registerForEventAction } from '../../../actions/event';

export function RegisterButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await registerForEventAction(eventId);
      if (result?.error) {
        setMessage({ text: result.error, type: 'error' });
      } else if (result?.success) {
        setMessage({ text: result.message || 'Successfully queued!', type: 'success' });
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'An unexpected error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground rounded-xl font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Register Now'}
      </button>
      {message && (
        <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
