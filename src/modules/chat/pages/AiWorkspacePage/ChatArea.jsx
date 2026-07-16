import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Paperclip, Mic } from 'lucide-react';
import { sendMessage } from '../../../../store/chat/chatThunks';
import MessageBubble from '../../components/MessageBubble';
import TypingIndicator from '../../components/TypingIndicator';
import PromptCards from '../../components/PromptCards';
// import ChildSelector from '../../components/ChildSelector'; // removed

export default function ChatArea() {
  const dispatch = useDispatch();
  const { messages, loading, currentSession } = useSelector((s) => s.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    dispatch(sendMessage({ content: input.trim() }));
    setInput('');
  };

  return (
    <main className="flex-1 flex flex-col bg-white">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-[900px] mx-auto w-full px-6 pb-24">
        {messages.length === 0 && !loading ? (
          <PromptCards />
        ) : (
          <div className="w-full space-y-4 mt-8">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar (unchanged) */}
      <div className="fixed bottom-8 left-[calc(256px+48px)] right-[48px] max-w-[900px] mx-auto z-40">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-full shadow-2xl p-2 pl-6 flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-[#0d9488]">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your prompt here"
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-gray-800 placeholder:text-gray-400"
          />
          <div className="flex items-center gap-2 pr-1">
            <button className="p-3 text-gray-400 hover:text-[#0d9488]">
              <Mic size={20} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-3 bg-[#0d9488] text-white rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <p className="text-center mt-3 text-[10px] text-gray-400 uppercase tracking-widest">
          ScholarAI can make mistakes. Verify your research.
        </p>
      </div>
    </main>
  );
}