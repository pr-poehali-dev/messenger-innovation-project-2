import Icon from "@/components/ui/icon";
import { Avatar } from "./shared";
import { Tab } from "./types";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
}

const tabs = [
  { id: "chats" as Tab, icon: "MessageCircle", label: "Чаты" },
  { id: "search" as Tab, icon: "Search", label: "Поиск" },
  { id: "contacts" as Tab, icon: "Users", label: "Контакты" },
  { id: "archive" as Tab, icon: "Archive", label: "Архив" },
  { id: "profile" as Tab, icon: "User", label: "Профиль" },
  { id: "settings" as Tab, icon: "Settings", label: "Настройки" },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
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
  );
}
