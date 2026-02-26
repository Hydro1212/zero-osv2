import { useState } from "react";
import {
  Settings,
  AccentColor,
  FontSize,
  UITransparency,
  ClockFormat,
  TaskbarHeight,
  ParticleIntensity,
  ScanlineEffect,
  WindowBorderGlow,
} from "../backend";
import { useSettings } from "../hooks/useSettings";
import { useSaveSettings } from "../hooks/useQueries";
import { DEFAULT_SETTINGS } from "../hooks/useQueries";
import PinDialog from "./PinDialog";
import { toast } from "sonner";
import { X, Palette, Type, Sparkles, Clock, Layout, Image, Monitor } from "lucide-react";

interface SettingsPanelProps {
  onClose: () => void;
}

type Section = "appearance" | "typography" | "effects" | "clock" | "taskbar" | "wallpaper" | "system";

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "appearance", label: "Appearance", icon: <Palette size={14} /> },
  { id: "typography", label: "Typography", icon: <Type size={14} /> },
  { id: "effects", label: "Effects", icon: <Sparkles size={14} /> },
  { id: "clock", label: "Clock", icon: <Clock size={14} /> },
  { id: "taskbar", label: "Taskbar", icon: <Layout size={14} /> },
  { id: "wallpaper", label: "Wallpaper", icon: <Image size={14} /> },
  { id: "system", label: "System", icon: <Monitor size={14} /> },
];

const CORRECT_PIN = "1234";

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, isLoading } = useSettings();
  const { mutate: saveSettings, isPending } = useSaveSettings();
  const [activeSection, setActiveSection] = useState<Section>("appearance");
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pendingWallpaper, setPendingWallpaper] = useState("");
  const [wallpaperInput, setWallpaperInput] = useState("");

  const current: Settings = localSettings ?? settings ?? DEFAULT_SETTINGS;

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setLocalSettings({ ...current, [key]: value });
  }

  function handleSave() {
    saveSettings(current, {
      onSuccess: () => {
        toast.success("Settings saved");
        setLocalSettings(null);
      },
      onError: () => toast.error("Failed to save settings"),
    });
  }

  function handleWallpaperChange() {
    setPendingWallpaper(wallpaperInput);
    setShowPinDialog(true);
    setPinError("");
  }

  function handlePinSubmit(pin: string) {
    if (pin === CORRECT_PIN) {
      update("wallpaperUrl", pendingWallpaper);
      setShowPinDialog(false);
      setPinError("");
      toast.success("Wallpaper updated");
    } else {
      setPinError("Incorrect PIN. Try again.");
    }
  }

  const accentTextClass =
    current.accentColor === AccentColor.magenta
      ? "text-neon-magenta"
      : current.accentColor === AccentColor.green
      ? "text-neon-green"
      : "text-neon-cyan";

  const accentBorderClass =
    current.accentColor === AccentColor.magenta
      ? "border-neon-magenta"
      : current.accentColor === AccentColor.green
      ? "border-neon-green"
      : "border-neon-cyan";

  function OptionButton<T extends string>({
    value,
    current: cur,
    label,
    onChange,
  }: {
    value: T;
    current: T;
    label: string;
    onChange: (v: T) => void;
  }) {
    const isActive = value === cur;
    return (
      <button
        onClick={() => onChange(value)}
        className={`px-3 py-1.5 rounded font-mono-tech text-xs border transition-all duration-200 ${
          isActive
            ? `${accentTextClass} ${accentBorderClass} bg-white/10`
            : "text-white/50 border-white/20 hover:border-white/40 hover:text-white/70"
        }`}
      >
        {label}
      </button>
    );
  }

  function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
      <p className="font-mono-tech text-xs text-white/40 uppercase tracking-widest mb-2">
        {children}
      </p>
    );
  }

  function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="flex flex-col gap-2 py-3 border-b border-white/5">
        <SectionLabel>{label}</SectionLabel>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[100]"
        style={{ background: "oklch(0.05 0.02 220 / 0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-[101] flex flex-col"
        style={{
          width: "min(480px, 100vw)",
          background: "oklch(0.1 0.025 220)",
          borderLeft: "1px solid oklch(0.8 0.2 195 / 0.3)",
          boxShadow: "-8px 0 40px oklch(0.8 0.2 195 / 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid oklch(0.8 0.2 195 / 0.2)" }}
        >
          <span className={`font-orbitron text-sm font-bold ${accentTextClass} tracking-wider`}>
            SYSTEM SETTINGS
          </span>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className="flex flex-col gap-0.5 p-2 shrink-0 overflow-y-auto"
            style={{
              width: 140,
              borderRight: "1px solid oklch(0.8 0.2 195 / 0.15)",
              background: "oklch(0.08 0.02 220)",
            }}
          >
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono-tech transition-all duration-200 text-left ${
                  activeSection === sec.id
                    ? `${accentTextClass} bg-white/10`
                    : "text-white/50 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                {sec.icon}
                {sec.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {isLoading ? (
              <div className={`font-mono-tech text-xs ${accentTextClass} animate-pulse`}>
                Loading settings...
              </div>
            ) : (
              <>
                {activeSection === "appearance" && (
                  <div>
                    <SettingRow label="Accent Color">
                      <OptionButton value={AccentColor.cyan} current={current.accentColor} label="Cyan" onChange={(v) => update("accentColor", v)} />
                      <OptionButton value={AccentColor.magenta} current={current.accentColor} label="Magenta" onChange={(v) => update("accentColor", v)} />
                      <OptionButton value={AccentColor.green} current={current.accentColor} label="Green" onChange={(v) => update("accentColor", v)} />
                    </SettingRow>
                    <SettingRow label="UI Transparency">
                      <OptionButton value={UITransparency.none} current={current.uiTransparency} label="None" onChange={(v) => update("uiTransparency", v)} />
                      <OptionButton value={UITransparency.low} current={current.uiTransparency} label="Low" onChange={(v) => update("uiTransparency", v)} />
                      <OptionButton value={UITransparency.medium} current={current.uiTransparency} label="Medium" onChange={(v) => update("uiTransparency", v)} />
                      <OptionButton value={UITransparency.high} current={current.uiTransparency} label="High" onChange={(v) => update("uiTransparency", v)} />
                    </SettingRow>
                    <SettingRow label="Window Border Glow">
                      <OptionButton value={WindowBorderGlow.none} current={current.windowBorderGlow} label="None" onChange={(v) => update("windowBorderGlow", v)} />
                      <OptionButton value={WindowBorderGlow.subtle} current={current.windowBorderGlow} label="Subtle" onChange={(v) => update("windowBorderGlow", v)} />
                      <OptionButton value={WindowBorderGlow.intense} current={current.windowBorderGlow} label="Intense" onChange={(v) => update("windowBorderGlow", v)} />
                    </SettingRow>
                    <SettingRow label="Desktop Label">
                      <input
                        type="text"
                        value={current.desktopLabel}
                        onChange={(e) => update("desktopLabel", e.target.value)}
                        className="w-full px-3 py-1.5 rounded font-mono-tech text-xs text-white outline-none transition-all"
                        style={{
                          background: "oklch(0.08 0.02 220)",
                          border: "1px solid oklch(0.8 0.2 195 / 0.25)",
                        }}
                      />
                    </SettingRow>
                  </div>
                )}

                {activeSection === "typography" && (
                  <div>
                    <SettingRow label="Font Size">
                      <OptionButton value={FontSize.small} current={current.fontSize} label="Small" onChange={(v) => update("fontSize", v)} />
                      <OptionButton value={FontSize.medium} current={current.fontSize} label="Medium" onChange={(v) => update("fontSize", v)} />
                      <OptionButton value={FontSize.large} current={current.fontSize} label="Large" onChange={(v) => update("fontSize", v)} />
                    </SettingRow>
                    <SettingRow label="Icon Size">
                      <OptionButton
                        value={"small" as Settings["iconSize"]}
                        current={current.iconSize}
                        label="Small"
                        onChange={(v) => update("iconSize", v as Settings["iconSize"])}
                      />
                      <OptionButton
                        value={"medium" as Settings["iconSize"]}
                        current={current.iconSize}
                        label="Medium"
                        onChange={(v) => update("iconSize", v as Settings["iconSize"])}
                      />
                      <OptionButton
                        value={"large" as Settings["iconSize"]}
                        current={current.iconSize}
                        label="Large"
                        onChange={(v) => update("iconSize", v as Settings["iconSize"])}
                      />
                    </SettingRow>
                  </div>
                )}

                {activeSection === "effects" && (
                  <div>
                    <SettingRow label="Particle Intensity">
                      <OptionButton value={ParticleIntensity.off} current={current.particleIntensity} label="Off" onChange={(v) => update("particleIntensity", v)} />
                      <OptionButton value={ParticleIntensity.low} current={current.particleIntensity} label="Low" onChange={(v) => update("particleIntensity", v)} />
                      <OptionButton value={ParticleIntensity.medium} current={current.particleIntensity} label="Medium" onChange={(v) => update("particleIntensity", v)} />
                      <OptionButton value={ParticleIntensity.high} current={current.particleIntensity} label="High" onChange={(v) => update("particleIntensity", v)} />
                    </SettingRow>
                    <SettingRow label="Scanline Effect">
                      <OptionButton
                        value={"on" as Settings["scanlineEffect"]}
                        current={current.scanlineEffect}
                        label="On"
                        onChange={(v) => update("scanlineEffect", v as Settings["scanlineEffect"])}
                      />
                      <OptionButton
                        value={"off" as Settings["scanlineEffect"]}
                        current={current.scanlineEffect}
                        label="Off"
                        onChange={(v) => update("scanlineEffect", v as Settings["scanlineEffect"])}
                      />
                    </SettingRow>
                    <SettingRow label="Grid Overlay">
                      <OptionButton
                        value={"on" as Settings["gridOverlay"]}
                        current={current.gridOverlay}
                        label="On"
                        onChange={(v) => update("gridOverlay", v as Settings["gridOverlay"])}
                      />
                      <OptionButton
                        value={"off" as Settings["gridOverlay"]}
                        current={current.gridOverlay}
                        label="Off"
                        onChange={(v) => update("gridOverlay", v as Settings["gridOverlay"])}
                      />
                    </SettingRow>
                  </div>
                )}

                {activeSection === "clock" && (
                  <div>
                    <SettingRow label="Clock Format">
                      <OptionButton value={ClockFormat.hour24} current={current.clockFormat} label="24-Hour" onChange={(v) => update("clockFormat", v)} />
                      <OptionButton value={ClockFormat.hour12} current={current.clockFormat} label="12-Hour" onChange={(v) => update("clockFormat", v)} />
                    </SettingRow>
                  </div>
                )}

                {activeSection === "taskbar" && (
                  <div>
                    <SettingRow label="Taskbar Height">
                      <OptionButton value={TaskbarHeight.compact} current={current.taskbarHeight} label="Compact" onChange={(v) => update("taskbarHeight", v)} />
                      <OptionButton value={TaskbarHeight.normal} current={current.taskbarHeight} label="Normal" onChange={(v) => update("taskbarHeight", v)} />
                      <OptionButton value={TaskbarHeight.tall} current={current.taskbarHeight} label="Tall" onChange={(v) => update("taskbarHeight", v)} />
                    </SettingRow>
                  </div>
                )}

                {activeSection === "wallpaper" && (
                  <div>
                    <div className="flex flex-col gap-3 py-3">
                      <SectionLabel>Wallpaper URL</SectionLabel>
                      <p className="font-mono-tech text-xs text-white/40">
                        Enter an image or .mp4 video URL. PIN required to apply.
                      </p>
                      <input
                        type="text"
                        value={wallpaperInput}
                        onChange={(e) => setWallpaperInput(e.target.value)}
                        placeholder="https://example.com/wallpaper.jpg"
                        className="w-full px-3 py-2 rounded font-mono-tech text-xs text-white placeholder-white/30 outline-none transition-all"
                        style={{
                          background: "oklch(0.08 0.02 220)",
                          border: "1px solid oklch(0.8 0.2 195 / 0.25)",
                        }}
                      />
                      <button
                        onClick={handleWallpaperChange}
                        className={`px-4 py-2 rounded font-orbitron text-xs font-bold ${accentTextClass} border ${accentBorderClass} hover:bg-white/10 transition-all duration-200`}
                      >
                        APPLY WALLPAPER
                      </button>
                      {current.wallpaperUrl && (
                        <div className="flex flex-col gap-1">
                          <SectionLabel>Current Wallpaper</SectionLabel>
                          <p className="font-mono-tech text-xs text-white/50 break-all">
                            {current.wallpaperUrl}
                          </p>
                          <button
                            onClick={() => {
                              setPendingWallpaper("");
                              setShowPinDialog(true);
                              setPinError("");
                            }}
                            className="mt-1 px-3 py-1.5 rounded font-mono-tech text-xs text-red-400 border border-red-400/30 hover:border-red-400/60 transition-all duration-200 self-start"
                          >
                            REMOVE WALLPAPER
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeSection === "system" && (
                  <div>
                    <div className="py-3 flex flex-col gap-3">
                      <SectionLabel>About</SectionLabel>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <img
                            src="/assets/generated/zero-os-logo.dim_128x128.png"
                            alt="Zero OS Logo"
                            className="w-12 h-12 rounded-lg"
                          />
                          <div>
                            <p className={`font-orbitron text-sm font-bold ${accentTextClass}`}>
                              ZERO-OS
                            </p>
                            <p className="font-mono-tech text-xs text-white/40">
                              v1.0.0 — Built on ICP
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="mt-2 p-3 rounded-lg font-mono-tech text-xs text-white/40 space-y-1"
                        style={{
                          background: "oklch(0.08 0.02 220)",
                          border: "1px solid oklch(0.8 0.2 195 / 0.1)",
                        }}
                      >
                        <p>Platform: Internet Computer</p>
                        <p>Runtime: Motoko Canister</p>
                        <p>Frontend: React + TypeScript</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer: Save button */}
        <div
          className="px-5 py-4 shrink-0 flex justify-end gap-3"
          style={{ borderTop: "1px solid oklch(0.8 0.2 195 / 0.2)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded font-mono-tech text-xs text-white/50 border border-white/20 hover:border-white/40 hover:text-white/70 transition-all duration-200"
          >
            CLOSE
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className={`px-4 py-2 rounded font-orbitron text-xs font-bold ${accentTextClass} border ${accentBorderClass} hover:bg-white/10 transition-all duration-200 disabled:opacity-50`}
          >
            {isPending ? "SAVING..." : "SAVE SETTINGS"}
          </button>
        </div>
      </div>

      {showPinDialog && (
        <PinDialog
          onSubmit={handlePinSubmit}
          onCancel={() => {
            setShowPinDialog(false);
            setPinError("");
          }}
          error={pinError}
        />
      )}
    </>
  );
}
