export type Tab = "chats" | "search" | "contacts" | "archive" | "profile" | "settings";
export type IconName = string;

export interface SettingsItem { icon: IconName; label: string; danger?: boolean; }
export interface CallBtn { icon: IconName; color: string; action?: () => void; }

export interface Message {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  type?: "text" | "voice";
  duration?: string;
}

export interface Chat {
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

export const CHATS: Chat[] = [
  { id: 1, name: "Алексей Смирнов", avatar: "АС", lastMsg: "Окей, созвонимся завтра!", time: "14:32", unread: 3, online: true, color: "#a855f7", archived: false },
  { id: 2, name: "Марина Петрова", avatar: "МП", lastMsg: "Посмотри фото, которые я отправила", time: "13:15", online: false, color: "#f472b6", archived: false },
  { id: 3, name: "Команда дизайна", avatar: "КД", lastMsg: "Дима: макеты готовы 🎨", time: "12:40", unread: 12, online: true, color: "#22d3ee", archived: false },
  { id: 4, name: "Дмитрий Козлов", avatar: "ДК", lastMsg: "Голосовое сообщение", time: "11:08", online: true, color: "#fb923c", archived: false },
  { id: 5, name: "Анна Новикова", avatar: "АН", lastMsg: "Спасибо за помощь!", time: "Вчера", online: false, color: "#34d399", archived: false },
  { id: 6, name: "Рабочий чат", avatar: "РЧ", lastMsg: "Встреча перенесена на пятницу", time: "Вчера", unread: 1, online: false, color: "#60a5fa", archived: false },
  { id: 7, name: "Сергей Волков", avatar: "СВ", lastMsg: "До встречи!", time: "Пн", online: false, color: "#e879f9", archived: true },
  { id: 8, name: "Ольга Тихонова", avatar: "ОТ", lastMsg: "Хорошо, договорились", time: "Пн", online: false, color: "#f87171", archived: true },
];

export const MESSAGES: Message[] = [
  { id: 1, text: "Привет! Как дела? Ты уже посмотрел новые материалы?", time: "13:01", isMe: false },
  { id: 2, text: "Привет! Да, только что посмотрел. Очень интересно получилось 🔥", time: "13:03", isMe: true },
  { id: 3, text: "Рад слышать! Как думаешь, стоит добавить ещё один раздел?", time: "13:10", isMe: false },
  { id: 4, type: "voice", text: "", time: "13:12", isMe: true, duration: "0:24" },
  { id: 5, text: "Понял тебя. Давай обсудим детали на созвоне", time: "13:15", isMe: false },
  { id: 6, text: "Окей, созвонимся завтра!", time: "14:32", isMe: true },
];

export const CONTACTS = [
  { id: 1, name: "Алексей Смирнов", status: "В сети", color: "#a855f7", online: true },
  { id: 2, name: "Анна Новикова", status: "Была 2 часа назад", color: "#34d399", online: false },
  { id: 3, name: "Дмитрий Козлов", status: "В сети", color: "#fb923c", online: true },
  { id: 4, name: "Марина Петрова", status: "Была вчера", color: "#f472b6", online: false },
  { id: 5, name: "Ольга Тихонова", status: "Была 3 дня назад", color: "#f87171", online: false },
  { id: 6, name: "Сергей Волков", status: "В сети", color: "#e879f9", online: true },
];
