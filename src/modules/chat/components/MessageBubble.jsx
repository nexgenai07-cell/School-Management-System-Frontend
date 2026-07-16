export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start'}`}>
      <div
        className={`px-3 py-2 rounded-2xl text-sm ${
          isUser
            ? 'bg-[#00c3af] text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {message.content}
      </div>
      <span className="text-[10px] text-gray-400">
        {isUser ? 'You' : 'ScholarAI'} •{' '}
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}