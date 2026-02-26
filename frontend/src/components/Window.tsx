import { useState, useRef, useCallback, useEffect } from "react";
import { Settings, UITransparency, WindowBorderGlow, AccentColor } from "../backend";
import { X, Minus, Maximize2 } from "lucide-react";

interface WindowProps {
  id: string;
  name: string;
  url: string;
  zIndex: number;
  uiTransparency?: Settings["uiTransparency"];
  windowBorderGlow?: Settings["windowBorderGlow"];
  accentColor?: Settings["accentColor"];
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

export default function Window({
  id,
  name,
  url,
  zIndex,
  uiTransparency = UITransparency.medium,
  windowBorderGlow = WindowBorderGlow.subtle,
  accentColor = AccentColor.cyan,
  onClose,
  onMinimize,
  onFocus,
}: WindowProps) {
  const [pos, setPos] = useState({ x: 80 + Math.random() * 120, y: 60 + Math.random() * 80 });
  const [size, setSize] = useState({ w: 900, h: 600 });
  const [maximized, setMaximized] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const bgOpacity =
    uiTransparency === UITransparency.none
      ? "0.97"
      : uiTransparency === UITransparency.low
      ? "0.88"
      : uiTransparency === UITransparency.high
      ? "0.55"
      : "0.75";

  const blurAmount =
    uiTransparency === UITransparency.none
      ? "0px"
      : uiTransparency === UITransparency.low
      ? "8px"
      : uiTransparency === UITransparency.high
      ? "24px"
      : "16px";

  const glowStyle =
    windowBorderGlow === WindowBorderGlow.none
      ? "none"
      : windowBorderGlow === WindowBorderGlow.intense
      ? accentColor === AccentColor.magenta
        ? "0 0 30px oklch(0.7 0.35 320 / 0.7), 0 0 60px oklch(0.7 0.35 320 / 0.3)"
        : accentColor === AccentColor.green
        ? "0 0 30px oklch(0.8 0.3 145 / 0.7), 0 0 60px oklch(0.8 0.3 145 / 0.3)"
        : "0 0 30px oklch(0.8 0.2 195 / 0.7), 0 0 60px oklch(0.8 0.2 195 / 0.3)"
      : accentColor === AccentColor.magenta
      ? "0 0 12px oklch(0.7 0.35 320 / 0.4)"
      : accentColor === AccentColor.green
      ? "0 0 12px oklch(0.8 0.3 145 / 0.4)"
      : "0 0 12px oklch(0.8 0.2 195 / 0.4)";

  const borderColor =
    accentColor === AccentColor.magenta
      ? "oklch(0.7 0.35 320 / 0.5)"
      : accentColor === AccentColor.green
      ? "oklch(0.8 0.3 145 / 0.5)"
      : "oklch(0.8 0.2 195 / 0.5)";

  const accentTextClass =
    accentColor === AccentColor.magenta
      ? "text-neon-magenta"
      : accentColor === AccentColor.green
      ? "text-neon-green"
      : "text-neon-cyan";

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (maximized) return;
      e.preventDefault();
      onFocus();
      setDragging(true);
      dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    },
    [maximized, pos, onFocus]
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setPos({
        x: Math.max(0, e.clientX - dragOffset.current.x),
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      style={{
        position: "fixed",
        left: maximized ? 0 : pos.x,
        top: maximized ? 0 : pos.y,
        width: maximized ? "100vw" : size.w,
        height: maximized ? "calc(100vh - 48px)" : size.h,
        zIndex,
        background: `oklch(0.12 0.02 220 / ${bgOpacity})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        border: `1px solid ${borderColor}`,
        boxShadow: glowStyle,
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minWidth: 320,
        minHeight: 200,
        resize: maximized ? "none" : "both",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0 select-none"
        style={{
          background: "oklch(0.08 0.02 220 / 0.9)",
          borderBottom: `1px solid ${borderColor}`,
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Traffic lights */}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors shrink-0"
          title="Close"
        />
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors shrink-0"
          title="Minimize"
        />
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setMaximized((m) => !m)}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors shrink-0"
          title="Maximize"
        />

        <span className={`flex-1 text-center font-mono-tech text-xs ${accentTextClass} truncate`}>
          {name}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMinimize}
            className="p-1 text-white/40 hover:text-white/80 transition-colors"
          >
            <Minus size={12} />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setMaximized((m) => !m)}
            className="p-1 text-white/40 hover:text-white/80 transition-colors"
          >
            <Maximize2 size={12} />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <iframe
        src={normalizedUrl}
        title={name}
        className="flex-1 w-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
