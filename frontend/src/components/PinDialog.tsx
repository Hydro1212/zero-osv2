import { useState } from "react";
import { Lock, X } from "lucide-react";

interface PinDialogProps {
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  error?: string;
}

export default function PinDialog({ onSubmit, onCancel, error }: PinDialogProps) {
  const [pin, setPin] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim()) onSubmit(pin.trim());
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[300]"
      style={{ background: "oklch(0.05 0.02 220 / 0.85)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-xl overflow-hidden"
        style={{
          background: "oklch(0.12 0.03 220)",
          border: "1px solid oklch(0.7 0.35 320 / 0.5)",
          boxShadow: "0 0 40px oklch(0.7 0.35 320 / 0.25)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid oklch(0.7 0.35 320 / 0.2)" }}
        >
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-neon-magenta" />
            <span className="font-orbitron text-sm font-bold text-neon-magenta tracking-wider">
              AUTHENTICATION REQUIRED
            </span>
          </div>
          <button
            onClick={onCancel}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <p className="font-mono-tech text-xs text-white/50">
            Enter your PIN to change the wallpaper.
          </p>

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            autoFocus
            className="w-full px-3 py-2 rounded-lg font-mono-tech text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-neon-magenta focus:shadow-[0_0_10px_oklch(0.7_0.35_320/0.4)]"
            style={{
              background: "oklch(0.08 0.02 220)",
              border: "1px solid oklch(0.7 0.35 320 / 0.3)",
            }}
          />

          {error && (
            <p className="font-mono-tech text-xs text-red-400">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 rounded-lg font-mono-tech text-sm text-white/60 border border-white/20 hover:border-white/40 hover:text-white/80 transition-all duration-200"
              style={{ background: "oklch(0.08 0.02 220)" }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg font-orbitron text-sm font-bold text-neon-magenta border border-neon-magenta hover:shadow-[0_0_16px_oklch(0.7_0.35_320/0.6)] transition-all duration-200"
              style={{ background: "oklch(0.08 0.02 220)" }}
            >
              CONFIRM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
