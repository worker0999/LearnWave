import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ChatInterface() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessions = useQuery(api.chat.getChatSessions);
  const messages = useQuery(
    api.chat.getChatMessages,
    selectedSession ? { sessionId: selectedSession as any } : "skip"
  );

  const createSession = useMutation(api.chat.createChatSession);
  const sendMessage = useMutation(api.chat.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateSession = async () => {
    try {
      const sessionId = await createSession({
        title: `Chat ${new Date().toLocaleDateString()}`,
      });
      setSelectedSession(sessionId);
    } catch (error) {
      toast.error("Failed to create chat session");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsTyping(true);

    try {
      await sendMessage({
        sessionId: selectedSession as any,
        content: messageContent,
      });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      // AI response will be handled by the backend
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Sessions Sidebar */}
      <div className="w-80 bg-slate-900/50 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <button
            onClick={handleCreateSession}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions?.map((session) => (
            <button
              key={session._id}
              onClick={() => setSelectedSession(session._id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedSession === session._id
                  ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                  : "bg-slate-800/50 hover:bg-slate-800 text-slate-300"
              }`}
            >
              <div className="font-medium truncate">{session.title}</div>
              {session.lastMessage && (
                <div className="text-sm text-slate-500 truncate mt-1">
                  {session.lastMessage}
                </div>
              )}
            </button>
          ))}

          {sessions?.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">💬</span>
              </div>
              <p className="text-slate-400 text-sm">No chat sessions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/30">
              <h2 className="text-lg font-semibold text-slate-100">VTU AI Assistant</h2>
              <p className="text-sm text-slate-400">Ask me anything about VTU academics, syllabus, or career guidance</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 ${
                      message.role === "user" ? "text-blue-100" : "text-slate-400"
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/30">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about VTU syllabus, exam patterns, career guidance..."
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isTyping}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-medium text-slate-200 mb-2">VTU AI Assistant</h3>
              <p className="text-slate-400 mb-6">Select a chat session or create a new one to get started</p>
              <button
                onClick={handleCreateSession}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
