import { useState } from "react";
import { Settings, AccentColor } from "../backend";
import { useGetAllApps } from "../hooks/useQueries";
import { useSettings } from "../hooks/useSettings";
import { DEFAULT_SETTINGS } from "../hooks/useQueries";
import Taskbar from "./Taskbar";
import AppIcon from "./AppIcon";
import Window from "./Window";
import SettingsPanel from "./SettingsPanel";
import AddAppDialog from "./AddAppDialog";
import Wallpaper from "./Wallpaper";
import ParticleEffect from "./ParticleEffect";

interface OpenWindow {
  id: string;
  name: string;
  url: string;
  minimized: boolean;
  zIndex: number;
}

export default function Desktop() {
  const { data: apps = [], isLoading: appsLoading } = useGetAllApps();
  const { settings, isLoading: settingsLoading } = useSettings();
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [topZ, setTopZ] = useState(10);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addAppOpen, setAddAppOpen] = useState(false);

  const s: Settings = settings ?? DEFAULT_SETTINGS;

  const accentClass =
    s.accentColor === AccentColor.magenta
      ? "accent-magenta"
      : s.accentColor === AccentColor.green
      ? "accent-green"
      : "accent-cyan";

  const scanlineClass = s.scanlineEffect === "on" ? "scanlines" : "";
  const gridClass = s.gridOverlay === "on" ? "grid-overlay" : "";

  function openApp(id: string, name: string, url: string) {
    const existing = openWindows.find((w) => w.id === id);
    if (existing) {
      setOpenWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, minimized: false, zIndex: topZ + 1 } : w
        )
      );
      setTopZ((z) => z + 1);
      return;
    }
    setTopZ((z) => z + 1);
    setOpenWindows((prev) => [
      ...prev,
      { id, name, url, minimized: false, zIndex: topZ + 1 },
    ]);
  }

  function closeWindow(id: string) {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  }

  function minimizeWindow(id: string) {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
  }

  function focusWindow(id: string) {
    setTopZ((z) => z + 1);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: topZ + 1 } : w))
    );
  }

  function toggleMinimize(id: string) {
    const win = openWindows.find((w) => w.id === id);
    if (!win) return;
    if (win.minimized) {
      setTopZ((z) => z + 1);
      setOpenWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, minimized: false, zIndex: topZ + 1 } : w
        )
      );
    } else {
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
      );
    }
  }

  return (
    <div
      className={`desktop-root ${accentClass} ${scanlineClass} ${gridClass}`}
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
    >
      {/* Wallpaper */}
      <Wallpaper url={s.wallpaperUrl} />

      {/* Particle Effects */}
      <ParticleEffect intensity={s.particleIntensity} accentColor={s.accentColor} />

      {/* App Icons */}
      <div
        className="absolute inset-0 p-6"
        style={{ paddingBottom: "80px", zIndex: 1 }}
      >
        {appsLoading ? (
          <div className="text-neon-cyan font-mono-tech text-sm opacity-60 animate-pulse">
            Loading apps...
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 content-start">
            {apps.map((app) => (
              <AppIcon
                key={app.id}
                id={app.id}
                name={app.name}
                url={app.url}
                isOpen={openWindows.some((w) => w.id === app.id && !w.minimized)}
                isMinimized={openWindows.some((w) => w.id === app.id && w.minimized)}
                iconSize={s.iconSize}
                fontSize={s.fontSize}
                accentColor={s.accentColor}
                onClick={() => openApp(app.id, app.name, app.url)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Windows */}
      {openWindows.map((win) =>
        win.minimized ? null : (
          <Window
            key={win.id}
            id={win.id}
            name={win.name}
            url={win.url}
            zIndex={win.zIndex}
            uiTransparency={s.uiTransparency}
            windowBorderGlow={s.windowBorderGlow}
            accentColor={s.accentColor}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          />
        )
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <SettingsPanel onClose={() => setSettingsOpen(false)} />
      )}

      {/* Add App Dialog */}
      <AddAppDialog open={addAppOpen} onOpenChange={setAddAppOpen} />

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindows.map((w) => ({
          id: w.id,
          name: w.name,
          minimized: w.minimized,
        }))}
        taskbarHeight={s.taskbarHeight}
        clockFormat={s.clockFormat}
        accentColor={s.accentColor}
        onWindowClick={toggleMinimize}
        onSettingsClick={() => setSettingsOpen(true)}
        onAddAppClick={() => setAddAppOpen(true)}
      />
    </div>
  );
}
