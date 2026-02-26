import { useState } from "react";
import { Settings, FontSize, AccentColor } from "../backend";

interface AppIconProps {
  id: string;
  name: string;
  url: string;
  isOpen: boolean;
  isMinimized: boolean;
  iconSize?: Settings["iconSize"];
  fontSize?: Settings["fontSize"];
  accentColor?: Settings["accentColor"];
  onClick: () => void;
}

export default function AppIcon({
  id,
  name,
  url,
  isOpen,
  isMinimized,
  iconSize = "medium",
  fontSize = FontSize.medium,
  accentColor = AccentColor.cyan,
  onClick,
}: AppIconProps) {
  const [faviconError, setFaviconError] = useState(false);

  const iconSizePx =
    iconSize === "small" ? 48 : iconSize === "large" ? 80 : 64;

  const fontSizeClass =
    fontSize === FontSize.small
      ? "text-[10px]"
      : fontSize === FontSize.large
      ? "text-sm"
      : "text-xs";

  const accentGlow =
    accentColor === AccentColor.magenta
      ? "hover:shadow-[0_0_20px_oklch(0.7_0.35_320/0.7)] hover:border-neon-magenta"
      : accentColor === AccentColor.green
      ? "hover:shadow-[0_0_20px_oklch(0.8_0.3_145/0.7)] hover:border-neon-green"
      : "hover:shadow-[0_0_20px_oklch(0.8_0.2_195/0.7)] hover:border-neon-cyan";

  const accentDot =
    accentColor === AccentColor.magenta
      ? "bg-neon-magenta shadow-[0_0_6px_oklch(0.7_0.35_320)]"
      : accentColor === AccentColor.green
      ? "bg-neon-green shadow-[0_0_6px_oklch(0.8_0.3_145)]"
      : "bg-neon-cyan shadow-[0_0_6px_oklch(0.8_0.2_195)]";

  let faviconUrl = "";
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    faviconUrl = `${parsed.protocol}//${parsed.host}/favicon.ico`;
  } catch {
    faviconUrl = "";
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group cursor-pointer select-none"
      style={{ width: iconSizePx + 16 }}
    >
      <div
        className={`relative flex items-center justify-center rounded-xl border border-white/20 bg-black/40 transition-all duration-300 ${accentGlow}`}
        style={{ width: iconSizePx, height: iconSizePx }}
      >
        {faviconUrl && !faviconError ? (
          <img
            src={faviconUrl}
            alt={name}
            className="rounded-lg"
            style={{
              width: iconSizePx * 0.55,
              height: iconSizePx * 0.55,
              objectFit: "contain",
            }}
            onError={() => setFaviconError(true)}
          />
        ) : (
          <span
            className="font-orbitron font-bold text-white/70"
            style={{ fontSize: iconSizePx * 0.35 }}
          >
            {name.charAt(0).toUpperCase()}
          </span>
        )}

        {/* Open/minimized indicator */}
        {(isOpen || isMinimized) && (
          <span
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${accentDot} ${
              isMinimized ? "opacity-50" : "opacity-100"
            }`}
          />
        )}
      </div>

      <span
        className={`${fontSizeClass} font-mono-tech text-white/80 text-center leading-tight truncate px-1`}
        style={{ maxWidth: iconSizePx + 16 }}
      >
        {name}
      </span>
    </button>
  );
}
