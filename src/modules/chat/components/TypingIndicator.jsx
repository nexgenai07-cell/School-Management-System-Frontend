export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded-2xl w-fit">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}