import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "search" | "contacts" | "archive" | "profile" | "settings";
type IconName = string;

interface SettingsItem { icon: IconName; label: string; danger?: boolean; }
interface CallBtn { icon: IconName; color: string; action?: () => void; }

interface Message {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  type?: "text" | "voice";
  duration?: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread?: number;
  online?: boolean;
  archived?: boolean;
  color: string;
}

const CHATS: Chat[] = [
  { id: 1, name: "Алексей Смирнов", avatar: "АС", lastMsg: "Окей, созвонимся завтра!", time: "14:32", unread: 3, online: true, color: "#a855f7", archived: false },
  { id: 2, name: "Марина Петрова", avatar: "МП", lastMsg: "Посмотри фото, которые я отправила", time: "13:15", online: false, color: "#f472b6", archived: false },
  { id: 3, name: "Команда дизайна", avatar: "КД", lastMsg: "Дима: макеты готовы 🎨", time: "12:40", unread: 12, online: true, color: "#22d3ee", archived: false },
  { id: 4, name: "Дмитрий Козлов", avatar: "ДК", lastMsg: "Голосовое сообщение", time: "11:08", online: true, color: "#fb923c", archived: false },
  { id: 5, name: "Анна Новикова", avatar: "АН", lastMsg: "Спасибо за помощь!", time: "Вчера", online: false, color: "#34d399", archived: false },
  { id: 6, name: "Рабочий чат", avatar: "РЧ", lastMsg: "Встреча перенесена на пятницу", time: "Вчера", unread: 1, online: false, color: "#60a5fa", archived: false },
  { id: 7, name: "Сергей Волков", avatar: "СВ", lastMsg: "До встречи!", time: "Пн", online: false, color: "#e879f9", archived: true },
  { id: 8, name: "Ольга Тихонова", avatar: "ОТ", lastMsg: "Хорошо, договорились", time: "Пн", online: false, color: "#f87171", archived: true },
];

const MESSAGES: Message[] = [
  { id: 1, text: "Привет! Как дела? Ты уже посмотрел новые материалы?", time: "13:01", isMe: false },
  { id: 2, text: "Привет! Да, только что посмотрел. Очень интересно получилось 🔥", time: "13:03", isMe: true },
  { id: 3, text: "Рад слышать! Как думаешь, стоит добавить ещё один раздел?", time: "13:10", isMe: false },
  { id: 4, type: "voice", text: "", time: "13:12", isMe: true, duration: "0:24" },
  { id: 5, text: "Понял тебя. Давай обсудим детали на созвоне", time: "13:15", isMe: false },
  { id: 6, text: "Окей, созвонимся завтра!", time: "14:32", isMe: true },
];

const CONTACTS = [
  { id: 1, name: "Алексей Смирнов", status: "В сети", color: "#a855f7", online: true },
  { id: 2, name: "Анна Новикова", status: "Была 2 часа назад", color: "#34d399", online: false },
  { id: 3, name: "Дмитрий Козлов", status: "В сети", color: "#fb923c", online: true },
  { id: 4, name: "Марина Петрова", status: "Была вчера", color: "#f472b6", online: false },
  { id: 5, name: "Ольга Тихонова", status: "Была 3 дня назад", color: "#f87171", online: false },
  { id: 6, name: "Сергей Волков", status: "В сети", color: "#e879f9", online: true },
];

function Avatar({ name, color, size = 44, online }: { name: string; color: string; size?: number; online?: boolean }) {
  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className="flex items-center justify-center rounded-full font-bold text-white select-none"
        style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}cc, ${color}66)`, border: `2px solid ${color}44`, fontSize: size * 0.3 }}
      >
        {name}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0d0d1a]" />
      )}
    </div>
  );
}

function VoiceBubble({ isMe, duration }: { isMe: boolean; duration?: string }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 ${isMe ? "msg-bubble-me" : "msg-bubble-other"} max-w-[200px]`}>
      <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <Icon name="Play" size={14} className="text-white ml-0.5" />
      </button>
      <div className="flex items-end gap-0.5 h-5">
        {[3, 5, 8, 12, 7, 10, 6, 4, 9, 5, 7, 3].map((h, i) => (
          <div key={i} className="w-1 rounded-full bg-white/60 voice-wave" style={{ height: h, animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      <span className="text-white/60 text-xs ml-1">{duration}</span>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(CHATS[0]);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: inputText,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };
    setMessages([...messages, newMsg]);
    setInputText("");
  };

  const sendVoice = () => {
    setIsRecording(false);
    const newMsg: Message = {
      id: messages.length + 1,
      type: "voice",
      text: "",
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      duration: "0:05",
    };
    setMessages([...messages, newMsg]);
  };

  const activeChats = CHATS.filter(c => !c.archived);
  const archivedChats = CHATS.filter(c => c.archived);

  const filteredChats = searchQuery
    ? activeChats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : activeChats;

  const tabs = [
    { id: "chats" as Tab, icon: "MessageCircle", label: "Чаты" },
    { id: "search" as Tab, icon: "Search", label: "Поиск" },
    { id: "contacts" as Tab, icon: "Users", label: "Контакты" },
    { id: "archive" as Tab, icon: "Archive", label: "Архив" },
    { id: "profile" as Tab, icon: "User", label: "Профиль" },
    { id: "settings" as Tab, icon: "Settings", label: "Настройки" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--chat-bg)" }}>

      {/* Sidebar */}
      <div className="flex flex-col w-[72px] flex-shrink-0 py-4 items-center gap-1" style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--glass-border)" }}>
        {/* Logo */}
        <div className="mb-4 w-10 h-10 rounded-2xl flex items-center justify-center neon-glow" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
          <Icon name="Zap" size={20} className="text-white" />
        </div>

        {/* Nav tabs */}
        <div className="flex flex-col gap-1 flex-1 w-full px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 group ${activeTab === tab.id ? "tab-active" : "hover:bg-white/5 text-white/40 hover:text-white/70"}`}
              title={tab.label}
            >
              <Icon name={tab.icon} size={20} />
              <span className="text-[9px] font-medium leading-none">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* User avatar */}
        <div className="mt-2 cursor-pointer" onClick={() => setActiveTab("profile")}>
          <Avatar name="Я" color="#a855f7" size={40} online />
        </div>
      </div>

      {/* Panel */}
      <div className="flex flex-col w-[300px] flex-shrink-0" style={{ background: "#0f0f1c", borderRight: "1px solid var(--glass-border)" }}>

        {/* Panel header */}
        <div className="p-4 pb-3" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <h2 className="text-lg font-bold text-white mb-3">
            {activeTab === "chats" && "Сообщения"}
            {activeTab === "search" && "Поиск"}
            {activeTab === "contacts" && "Контакты"}
            {activeTab === "archive" && "Архив"}
            {activeTab === "profile" && "Мой профиль"}
            {activeTab === "settings" && "Настройки"}
          </h2>
          {(activeTab === "chats" || activeTab === "search") && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              <Icon name="Search" size={14} className="text-white/40" />
              <input
                className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1 w-full"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto">

          {/* CHATS TAB */}
          {activeTab === "chats" && (
            <div className="py-1">
              {filteredChats.map((chat, i) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left ${activeChat?.id === chat.id ? "bg-white/5 border-r-2" : "hover:bg-white/[0.03]"}`}
                  style={{ borderRightColor: activeChat?.id === chat.id ? chat.color : "transparent", animationDelay: `${i * 0.05}s` }}
                >
                  <Avatar name={chat.avatar} color={chat.color} size={44} online={chat.online} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-white truncate">{chat.name}</span>
                      <span className="text-[11px] text-white/40 flex-shrink-0 ml-1">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40 truncate">{chat.lastMsg}</span>
                      {chat.unread && (
                        <span className="ml-1 flex-shrink-0 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: chat.color }}>
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* SEARCH TAB */}
          {activeTab === "search" && (
            <div className="px-4 py-3">
              {searchQuery ? (
                <>
                  <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Результаты</p>
                  {CHATS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(chat => (
                    <button key={chat.id} onClick={() => { setActiveChat(chat); setActiveTab("chats"); }}
                      className="w-full flex items-center gap-3 py-2.5 hover:bg-white/5 rounded-xl px-2 transition-all">
                      <Avatar name={chat.avatar} color={chat.color} size={40} online={chat.online} />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{chat.name}</p>
                        <p className="text-xs text-white/40">{chat.lastMsg}</p>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                    <Icon name="Search" size={24} className="text-purple-400" />
                  </div>
                  <p className="text-white/40 text-sm text-center">Введите имя или текст<br />для поиска по чатам</p>
                </div>
              )}
            </div>
          )}

          {/* CONTACTS TAB */}
          {activeTab === "contacts" && (
            <div className="py-2">
              <div className="px-4 py-2">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">В сети — {CONTACTS.filter(c => c.online).length}</p>
                {CONTACTS.filter(c => c.online).map(contact => (
                  <div key={contact.id} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
                    <Avatar name={contact.name.split(" ").map(w => w[0]).join("").slice(0, 2)} color={contact.color} size={40} online={contact.online} />
                    <div>
                      <p className="text-sm font-medium text-white">{contact.name}</p>
                      <p className="text-xs text-green-400">{contact.status}</p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-white/40 uppercase tracking-wider mt-4 mb-2">Недавние</p>
                {CONTACTS.filter(c => !c.online).map(contact => (
                  <div key={contact.id} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
                    <Avatar name={contact.name.split(" ").map(w => w[0]).join("").slice(0, 2)} color={contact.color} size={40} />
                    <div>
                      <p className="text-sm font-medium text-white">{contact.name}</p>
                      <p className="text-xs text-white/40">{contact.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARCHIVE TAB */}
          {activeTab === "archive" && (
            <div className="py-1">
              {archivedChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Icon name="Archive" size={32} className="text-white/20" />
                  <p className="text-white/40 text-sm">Архив пуст</p>
                </div>
              ) : (
                archivedChats.map(chat => (
                  <button key={chat.id} onClick={() => setActiveChat(chat)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left">
                    <Avatar name={chat.avatar} color={chat.color} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-white/70 truncate">{chat.name}</span>
                        <span className="text-[11px] text-white/30">{chat.time}</span>
                      </div>
                      <span className="text-xs text-white/30 truncate block">{chat.lastMsg}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="px-4 py-4 animate-fade-in">
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white neon-glow" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
                    ЮА
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Icon name="Camera" size={12} className="text-white" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-base">Юрий Андреев</p>
                  <p className="text-sm text-white/40">@yurandreev</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs text-green-400 font-medium" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  В сети
                </div>
              </div>
              {[
                { icon: "Phone", label: "+7 999 123-45-67" },
                { icon: "Mail", label: "yur@example.com" },
                { icon: "Info", label: "Всем привет! На связи 🚀" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 py-3 rounded-xl px-3 mb-1 hover:bg-white/5 cursor-pointer transition-all" style={{ border: "1px solid var(--glass-border)" }}>
                  <Icon name={item.icon} size={16} className="text-purple-400" />
                  <span className="text-sm text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="px-4 py-4 animate-fade-in">
              {[
                { group: "Приватность", items: [
                  { icon: "Lock", label: "Конфиденциальность" },
                  { icon: "Bell", label: "Уведомления" },
                  { icon: "Shield", label: "Безопасность" },
                ]},
                { group: "Интерфейс", items: [
                  { icon: "Palette", label: "Оформление" },
                  { icon: "Globe", label: "Язык" },
                  { icon: "Smartphone", label: "Устройства" },
                ]},
                { group: "Другое", items: [
                  { icon: "HelpCircle", label: "Помощь" },
                  { icon: "LogOut", label: "Выйти", danger: true },
                ]},
              ].map(group => (
                <div key={group.group} className="mb-5">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2 px-1">{group.group}</p>
                  <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--glass-border)" }}>
                    {group.items.map((item: SettingsItem, i) => (
                      <button key={item.label} className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all ${i < group.items.length - 1 ? "border-b border-white/5" : ""}`}>
                        <div className="flex items-center gap-3">
                          <Icon name={item.icon} size={16} className={item.danger ? "text-red-400" : "text-purple-400"} />
                          <span className={`text-sm ${item.danger ? "text-red-400" : "text-white/80"}`}>{item.label}</span>
                        </div>
                        {!item.danger && <Icon name="ChevronRight" size={14} className="text-white/20" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
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
    </div>
  );
}