import { useState } from 'react';
import { X, Maximize2, Send, Bot } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { closeCompact } from '../../../store/chat/chatSlice';        
import { sendMessage } from '../../../store/chat/chatThunks'; 
import { useNavigate } from 'react-router-dom';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatCompact() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, loading, isCompactOpen } = useSelector((s) => s.chat);
  const [input, setInput] = useState('');

  if (!isCompactOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    dispatch(sendMessage({ content: input.trim() }));
    setInput('');
  };

  const handleExpand = () => {
    dispatch(closeCompact());
    navigate('/ai-workspace');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#0d9488] text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-semibold text-sm">Scholar AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleExpand} className="p-1 hover:bg-white/10 rounded">
            <Maximize2 size={16} />
          </button>
          <button onClick={() => dispatch(closeCompact())} className="p-1 hover:bg-white/10 rounded">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 space-y-3 max-h-80 overflow-y-auto bg-gray-50">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        {messages.length === 0 && !loading && (
          <p className="text-center text-gray-400 text-sm mt-8">Ask me anything...</p>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask ScholarAI..."
            className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2 text-[#0d9488] hover:bg-[#0d9488]/10 rounded-full disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}