
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { ChatMessage, GroundingSource } from '../types';
import { SUGGESTED_QUESTIONS } from '../constants';
import Button from './Button';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setSources([]);

    try {
      const result = await gemini.sendMessage(text, messages);
      const modelMessage: ChatMessage = {
        role: 'model',
        text: result.text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMessage]);
      setSources(result.sources || []);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'model',
        text: "Desculpe, tive um problema técnico. Pode tentar novamente?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white lg:rounded-3xl lg:shadow-2xl overflow-hidden lg:border lg:border-slate-100">
      {/* Desktop Header (Hidden in Mobile Overlay via parent) */}
      <div className="hidden lg:flex bg-slate-900 text-white p-6 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-xl shadow-lg">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h2 className="font-bold text-lg">Guia Inteligente</h2>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md mb-2">
              <i className="fas fa-map-marked-alt text-2xl text-emerald-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Guia JaraguáJS</h3>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                Tire dúvidas sobre locais, cupons ou peça recomendações.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 active:bg-slate-50 text-left shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-4 ${
              m.role === 'user' 
              ? 'bg-emerald-700 text-white rounded-tr-none shadow-md' 
              : 'bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-100 text-[13px] leading-relaxed'
            }`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
              <div className={`text-[9px] mt-2 opacity-50 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-slate-100 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Consultando...</span>
            </div>
          </div>
        )}
        
        {sources.length > 0 && (
          <div className="p-3 bg-white rounded-xl border border-emerald-50 shadow-sm mt-4">
            <p className="text-[9px] font-black text-emerald-800 uppercase mb-2">Referências:</p>
            <div className="flex flex-col gap-1">
              {sources.map((src, i) => (
                src.uri && (
                  <a 
                    key={i} 
                    href={src.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-700 hover:underline flex items-center gap-2 truncate"
                  >
                    <i className="fas fa-link text-[8px]"></i>
                    {src.title || 'Referência Local'}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area - Adjusted for mobile keyboards */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-50 safe-bottom">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 focus-within:bg-white focus-within:border-emerald-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Pergunte ao Guia..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-3 text-sm"
          />
          <button 
            onClick={() => handleSend(input)} 
            disabled={!input.trim()} 
            className="w-10 h-10 bg-emerald-700 text-white rounded-xl disabled:opacity-30 active:scale-95 transition-transform"
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
