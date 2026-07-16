import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Home, Search, MessageSquare, Settings,
  CircleHelp, GraduationCap, Trash2
} from 'lucide-react';
import { clearCurrentChat, setCurrentSession } from '../../../../store/chat/chatSlice';
import { removeSession, loadHistory, disconnectChat } from '../../../../store/chat/chatThunks';

// Role → Dashboard mapping
const dashboardPaths = {
  Admin: '/admin/dashboard',
  Teacher: '/teacher/dashboard',
  Student: '/student/dashboard',
  Parent: '/parent/dashboard',
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessions, currentSession } = useSelector((s) => s.chat);
  const role = useSelector((s) => s.auth.user?.role_name) || '';   // empty string if missing

  // Determine dashboard path, fallback to empty string if role unknown
  const dashboardPath = dashboardPaths[role] || '';

  useEffect(() => {
    dispatch(loadHistory());
  }, [dispatch]);

  const handleNewChat = () => {
    dispatch(disconnectChat());
    dispatch(clearCurrentChat());
  };

  const handleSelectSession = (session) => {
    dispatch(setCurrentSession(session));
  };

  const handleDelete = (e, sessionId) => {
    e.stopPropagation();
    dispatch(removeSession(sessionId));
  };

  // Navigate to dashboard only if valid path exists
  const goToDashboard = () => {
    if (dashboardPath) navigate(dashboardPath);
  };

  return (
    <aside className="w-64 bg-[#0b1326] text-[#dae2fd] flex flex-col border-r border-white/10 h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#0d9488] to-[#c0c1ff] rounded-lg flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#c0c1ff]">ScholarAI</h1>
          <p className="text-xs text-[#c7c4d7]">Academic Workspace</p>
        </div>
      </div>

      {/* New Chat */}
      <div className="px-3 mb-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-[#0d9488] font-semibold hover:bg-white/10 transition"
        >
          <Plus size={20} />
          <span className="text-sm">New Chat</span>
        </button>
      </div>

      {/* Static Nav */}
      <nav className="px-3 space-y-1">
        {/* Dashboard button – disabled if role missing */}
        <button
          onClick={goToDashboard}
          disabled={!dashboardPath}
          title={dashboardPath ? 'Go to dashboard' : 'Role not available'}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition
            ${!currentSession ? 'bg-[#131b2e] text-[#0d9488]' : 'hover:bg-white/5 text-[#c7c4d7]'}
            ${!dashboardPath ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Home size={20} />
          <span className="text-sm">Dashboard</span>
        </button>

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-[#c7c4d7] cursor-pointer">
          <Search size={20} />
          <span className="text-sm">Search</span>
        </div>
      </nav>

      {/* History */}
      <div className="mt-6 px-3 flex-1 overflow-y-auto">
        <p className="px-4 text-[10px] uppercase tracking-widest text-[#c7c4d7] mb-2">History</p>
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => handleSelectSession(session)}
            className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer group ${
              currentSession?.id === session.id ? 'bg-[#131b2e] text-white' : 'hover:bg-white/5 text-[#c7c4d7]'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <MessageSquare size={16} />
              <span className="text-sm truncate">{session.title || 'Untitled'}</span>
            </div>
            <button
              onClick={(e) => handleDelete(e, session.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 text-[#c7c4d7] cursor-pointer">
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 text-[#c7c4d7] cursor-pointer">
          <CircleHelp size={18} />
          <span className="text-sm">Support</span>
        </div>
      </div>
    </aside>
  );
}