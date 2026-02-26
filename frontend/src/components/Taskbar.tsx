import { useState, useEffect } from "react";
import { Settings, ClockFormat, TaskbarHeight, AccentColor } from "../backend";
import { Settings as SettingsIcon, Plus, Monitor } from "lucide-react";

interface TaskbarWindow {
  id: string;
  name: string;
  minimized: boolean;
}

interface TaskbarProps {
  openWindows: TaskbarWindow[];
  taskbarHeight?: Settings["taskbarHeight"];
  clockFormat?: Settings["clockFormat"];
  accentColor?: Settings["accentColor"];
  onWindowClick: (id: string) => void;
  onSettingsClick: () => void;
  onAddAppClick: () => void;
}

export default function Taskbar({
  openWindows,
  taskbarHeight = TaskbarHeight.normal,
  clockFormat = ClockFormat.hour24,
  accentColor = AccentColor.cyan,
  onWindowClick,
  onSettingsClick,
  onAddAppClick,
}: TaskbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const heightClass =
    taskbarHeight === TaskbarHeight.compact
      ? "h-10"
      : taskbarHeight === TaskbarHeight.tall
      ? "h-16"
      : "h-12";

  const accentBorder =
    accentColor === AccentColor.magenta
      ? "border-t-neon-magenta shadow-[0_-2px_20px_oklch(0.7_0.35_320/0.4)]"
      : accentColor === AccentColor.green
      ? "border-t-neon-green shadow-[0_-2px_20px_oklch(0.8_0.3_145/0.4)]"
      : "border-t-neon-cyan shadow-[0_-2px_20px_oklch(0.8_0.2_195/0.4)]";

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: clockFormat === ClockFormat.hour12,
  });

  const accentTextClass =
    accentColor === AccentColor.magenta
      ? "text-neon-magenta"
      : accentColor === AccentColor.green
      ? "text-neon-green"
      : "text-neon-cyan";

  const accentGlowClass =
    accentColor === AccentColor.magenta
      ? "hover:shadow-[0_0_12px_oklch(0.7_0.35_320/0.8)] hover:border-neon-magenta"
      : accentColor === AccentColor.green
      ? "hover:shadow-[0_0_12px_oklch(0.8_0.3_145/0.8)] hover:border-neon-green"
      : "hover:shadow-[0_0_12px_oklch(0.8_0.2_195/0.8)] hover:border-neon-cyan";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 ${heightClass} flex items-center px-3 gap-2 border-t-2 ${accentBorder} z-50`}
      style={{
        background: "oklch(0.1 0.02 220 / 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Left: Logo / Desktop label */}
      <div className={`flex items-center gap-1.5 ${accentTextClass} font-orbitron text-xs font-bold shrink-0`}>
        <Monitor size={14} />
        <span className="hidden sm:inline">ZERO-OS</span>
      </div>

      <div className="w-px h-6 bg-white/10 mx-1 shrink-0" />

      {/* Center: Open windows */}
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none min-w-0">
        {openWindows.map((win) => (
          <button
            key={win.id}
            onClick={() => onWindowClick(win.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono-tech border transition-all duration-200 shrink-0 max-w-[140px] truncate
              ${win.minimized
                ? `border-white/20 text-white/40 bg-white/5 ${accentGlowClass}`
                : `border-current ${accentTextClass} bg-white/10 ${accentGlowClass}`
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${win.minimized ? "bg-white/30" : "bg-current"}`} />
            <span className="truncate">{win.name}</span>
          </button>
        ))}
      </div>

      {/* Right: Add app + clock + settings */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onAddAppClick}
          className={`flex items-center justify-center w-7 h-7 rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200 ${accentGlowClass}`}
          title="Add App"
        >
          <Plus size={14} />
        </button>

        <div className={`font-mono-tech text-xs ${accentTextClass} tabular-nums px-2 py-1 rounded border border-current/30 bg-black/20`}>
          {formattedTime}
        </div>

        <button
          onClick={onSettingsClick}
          className={`flex items-center justify-center w-7 h-7 rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200 ${accentGlowClass}`}
          title="Settings"
        >
          <SettingsIcon size={14} />
        </button>
      </div>
    </div>
  );
}
