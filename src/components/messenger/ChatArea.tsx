import { useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Avatar, VoiceBubble } from "./shared";
import { Chat, Message, CallBtn } from "./types";

interface ChatAreaProps {
  activeChat: Chat | null;
  messages: Message[];
  inputText: string;
  setInputText: (s: string) => void;
  sendMessage: () => void;
  sendVoice: () => void;
  isRecording: boolean;
  setIsRecording: (b: boolean) => void;
  isVideoCall: boolean;
  setIsVideoCall: (b: boolean) => void;
}

export default function ChatArea({ activeChat, messages, inputText, setInputText, sendMessage, sendVoice, isRecording, setIsRecording, isVideoCall, setIsVideoCall }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  return (
    <>
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: "rgba(13,13,26,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--glass-border)" }}>
              <div className="flex items-center gap-3">
                <Avatar name={activeChat.avatar} color={activeChat.color} size={42} online={activeChat.online} />
                <div>
                  <p className="font-semibold text-white leading-tight">{activeChat.name}</p>
                  <p className={`text-xs ${activeChat.online ? "text-green-400" : "text-white/40"}`}>
                    {activeChat.online ? "В сети" : "Был(а) недавно"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVideoCall(true)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 text-white/60 hover:text-white"
                >
                  <Icon name="Video" size={18} />
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 text-white/60 hover:text-white">
                  <Icon name="Phone" size={18} />
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 text-white/60 hover:text-white">
                  <Icon name="MoreVertical" size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2" style={{ background: "var(--chat-bg)" }}>
              <div className="flex justify-center mb-4">
                <span className="text-xs text-white/30 px-3 py-1 rounded-full glass">Сегодня</span>
              </div>
              {messages.map((msg, i) => (
                <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"} animate-fade-in`} style={{ animationDelay: `${i * 0.03}s` }}>
                  {!msg.isMe && (
                    <div className="mr-2 mt-auto">
                      <Avatar name={activeChat.avatar} color={activeChat.color} size={28} />
                    </div>
                  )}
                  <div className="max-w-[65%]">
                    {msg.type === "voice" ? (
                      <VoiceBubble isMe={msg.isMe} duration={msg.duration} />
                    ) : (
                      <div className={`px-4 py-2.5 ${msg.isMe ? "msg-bubble-me" : "msg-bubble-other"}`}>
                        <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                    <p className={`text-[10px] text-white/30 mt-1 ${msg.isMe ? "text-right" : "text-left"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="px-6 py-4" style={{ background: "rgba(13,13,26,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--glass-border)" }}>
              <div className="flex items-end gap-3">
                <button className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-white/40 hover:text-white/70 transition-all hover:bg-white/10">
                  <Icon name="Paperclip" size={18} />
                </button>
                <div className="flex-1 flex items-end gap-2 px-4 py-2.5 rounded-2xl" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                  <textarea
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none resize-none leading-relaxed max-h-32"
                    placeholder="Написать сообщение..."
                    rows={1}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    style={{ scrollbarWidth: "none" }}
                  />
                  <button className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
                    <Icon name="Smile" size={18} />
                  </button>
                </div>
                {inputText.trim() ? (
                  <button
                    onClick={sendMessage}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-2xl text-white transition-all neon-glow hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
                  >
                    <Icon name="Send" size={16} />
                  </button>
                ) : (
                  <button
                    onMouseDown={() => setIsRecording(true)}
                    onMouseUp={sendVoice}
                    onMouseLeave={() => setIsRecording(false)}
                    className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-2xl text-white transition-all ${isRecording ? "neon-glow scale-110" : "hover:scale-105"}`}
                    style={{ background: isRecording ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #a855f7, #7c3aed)" }}
                  >
                    <Icon name="Mic" size={16} />
                  </button>
                )}
              </div>
              {isRecording && (
                <div className="flex items-center gap-2 mt-2 px-4 animate-fade-in">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-dot" />
                  <span className="text-xs text-red-400">Идёт запись... отпустите для отправки</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center neon-glow" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
              <Icon name="MessageCircle" size={36} className="text-white" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold gradient-text mb-2">Выберите чат</p>
              <p className="text-white/40 text-sm">Начните общение — выберите контакт слева</p>
            </div>
          </div>
        )}
      </div>

      {/* Video call overlay */}
      {isVideoCall && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)" }}>
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Avatar name={activeChat?.avatar || ""} color={activeChat?.color || "#a855f7"} size={120} />
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: activeChat?.color }} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-1">{activeChat?.name}</p>
              <p className="text-white/50 text-sm">Видеозвонок...</p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              {[
                { icon: "MicOff", color: "rgba(255,255,255,0.1)" },
                { icon: "VideoOff", color: "rgba(255,255,255,0.1)" },
                { icon: "PhoneOff", color: "#ef4444", action: () => setIsVideoCall(false) },
              ].map((btn: CallBtn) => (
                <button
                  key={btn.icon}
                  onClick={btn.action}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                  style={{ background: btn.color }}
                >
                  <Icon name={btn.icon} size={22} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
