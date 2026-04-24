import Icon from "@/components/ui/icon";
import { Avatar } from "./shared";
import { Tab, Chat, CHATS, CONTACTS, SettingsItem } from "./types";

interface SidePanelProps {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  activeChat: Chat | null;
  setActiveChat: (c: Chat) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
}

export default function SidePanel({ activeTab, setActiveTab, activeChat, setActiveChat, searchQuery, setSearchQuery }: SidePanelProps) {
  const activeChats = CHATS.filter(c => !c.archived);
  const archivedChats = CHATS.filter(c => c.archived);
  const filteredChats = searchQuery
    ? activeChats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : activeChats;

  return (
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
  );
}
