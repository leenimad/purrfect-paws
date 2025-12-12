'use client';

import { useState } from 'react';

export default function CatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Meow! 🐾 I am the Purrfect Paws assistant. Ask me anything about cat care!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // 2. Call API
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();

      // 3. Add Bot Message
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Hiss! Something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 mb-4 flex flex-col overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-brand-purple p-4 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center gap-2">🤖 Cat Expert AI</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">&times;</button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-brand-purple text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {loading && <div className="text-xs text-gray-400 italic ml-2">Typing...</div>}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cats..." 
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-purple"
            />
            <button disabled={loading} className="bg-brand-purple text-white p-2 rounded-lg hover:bg-brand-purple-dark disabled:opacity-50">
                ➤
            </button>
          </form>
        </div>
      )}

      {/* FLOATING TOGGLE BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-purple text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}