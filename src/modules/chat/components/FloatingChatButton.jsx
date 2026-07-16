import { MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCompact } from '../../../store/chat/chatSlice';
import { useLocation } from 'react-router-dom';

export default function FloatingChatButton() {
  const dispatch = useDispatch();
  const location = useLocation();
  if (location.pathname === '/ai-workspace') return null;

  return (
    <button
      onClick={() => dispatch(toggleCompact())}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0d9488] hover:bg-teal-400 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
      aria-label="Open AI chat"
    >
      <MessageCircle size={24} />
    </button>
  );
}