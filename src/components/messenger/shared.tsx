import Icon from "@/components/ui/icon";

export function Avatar({ name, color, size = 44, online }: { name: string; color: string; size?: number; online?: boolean }) {
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

export function VoiceBubble({ isMe, duration }: { isMe: boolean; duration?: string }) {
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
