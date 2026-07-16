import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../../store/chat/chatThunks';
import promptSuggestions from '../data/promptSuggestions.json'; // or inline

// Import Lucide icons for each category
import {
  TrendingUp, Handshake, BarChart3, BookOpen, GraduationCap,
  Wrench, DollarSign, Image, ClipboardList, Trophy,
  FileText, Users, Package, Calendar, Radio,ArrowUpRight
} from 'lucide-react';

// Map bot type to icon
const iconMap = {
  fee: DollarSign,
  attendance: ClipboardList,
  assignment: BookOpen,
  exam: Trophy,
  certificate: FileText,
  scholarship: GraduationCap,
  inventory: Package,
  event: Calendar,
  maintenance: Wrench,
  media: Image,
  general: BarChart3,
};

export default function PromptCards() {
  const dispatch = useDispatch();
  const role = useSelector((s) => s.auth.user?.role_name) || 'Admin';
  // Current bot_type: for admin, maybe get from session or default to 'general'
  const currentBot = useSelector((s) => s.chat.currentSession?.bot_type) || 'general';
  const suggestions = promptSuggestions[role]?.[currentBot] || promptSuggestions[role]?.general || [];

  const handleClick = (text) => {
    dispatch(sendMessage({ content: text }));
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="text-center mb-12 mt-20">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">How can I assist you today?</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-10">
        Try one of these questions
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
        {suggestions.slice(0, 8).map((text, idx) => {
          const Icon = iconMap[currentBot] || BarChart3;
          return (
            <button
              key={idx}
              onClick={() => handleClick(text)}
              className="group p-6 bg-white border border-gray-200 rounded-2xl text-left hover:border-[#0d9488] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-48"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Icon className="text-[#0d9488]" size={24} />
                  <ArrowUpRight className="text-gray-300 group-hover:text-[#0d9488] transition-colors" size={18} />
                </div>
                <p className="text-sm text-gray-600 line-clamp-4">{text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}