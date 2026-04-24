import { useState } from "react";
import Sidebar from "@/components/messenger/Sidebar";
import SidePanel from "@/components/messenger/SidePanel";
import ChatArea from "@/components/messenger/ChatArea";
import { Tab, Chat, Message, CHATS, MESSAGES } from "@/components/messenger/types";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(CHATS[0]);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

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

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--chat-bg)" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidePanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ChatArea
        activeChat={activeChat}
        messages={messages}
        inputText={inputText}
        setInputText={setInputText}
        sendMessage={sendMessage}
        sendVoice={sendVoice}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        isVideoCall={isVideoCall}
        setIsVideoCall={setIsVideoCall}
      />
    </div>
  );
}
