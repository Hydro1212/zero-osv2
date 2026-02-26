import { useState } from "react";
import { useAddApp } from "../hooks/useQueries";
import { toast } from "sonner";
import { X, Plus, Globe } from "lucide-react";

interface AddAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddAppDialog({ open, onOpenChange }: AddAppDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const { mutate: addApp, isPending } = useAddApp();

  if (!open) return null;

  function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const normalizedUrl = normalizeUrl(url);
    if (!trimmedName || !normalizedUrl) return;

    const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    addApp(
      { id, name: trimmedName, url: normalizedUrl },
      {
        onSuccess: () => {
          toast.success(`${trimmedName} installed successfully`);
          setName("");
          setUrl("");
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Failed to add app";
          toast.error(msg);
        },
      }
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[200]"
      style={{ background: "oklch(0.05 0.02 220 / 0.8)", backdropFilter: "blur(8px)" }}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-xl overflow-hidden"
        style={{
          background: "oklch(0.12 0.03 220)",
          border: "1px solid oklch(0.8 0.2 195 / 0.4)",
          boxShadow: "0 0 40px oklch(0.8 0.2 195 / 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid oklch(0.8 0.2 195 / 0.2)" }}
        >
          <div className="flex items-center gap-2">
            <Plus size={16} className="text-neon-cyan" />
            <span className="font-orbitron text-sm font-bold text-neon-cyan tracking-wider">
              INSTALL APP
            </span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono-tech text-xs text-white/60 uppercase tracking-wider">
              App Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GitHub"
              className="w-full px-3 py-2 rounded-lg font-mono-tech text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-neon-cyan focus:shadow-[0_0_10px_oklch(0.8_0.2_195/0.4)]"
              style={{
                background: "oklch(0.08 0.02 220)",
                border: "1px solid oklch(0.8 0.2 195 / 0.25)",
              }}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono-tech text-xs text-white/60 uppercase tracking-wider">
              URL
            </label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. github.com"
                className="w-full pl-8 pr-3 py-2 rounded-lg font-mono-tech text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-neon-cyan focus:shadow-[0_0_10px_oklch(0.8_0.2_195/0.4)]"
                style={{
                  background: "oklch(0.08 0.02 220)",
                  border: "1px solid oklch(0.8 0.2 195 / 0.25)",
                }}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2 rounded-lg font-mono-tech text-sm text-white/60 border border-white/20 hover:border-white/40 hover:text-white/80 transition-all duration-200"
              style={{ background: "oklch(0.08 0.02 220)" }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 rounded-lg font-orbitron text-sm font-bold text-neon-cyan border border-neon-cyan hover:shadow-[0_0_16px_oklch(0.8_0.2_195/0.6)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "oklch(0.08 0.02 220)" }}
            >
              {isPending ? "INSTALLING..." : "INSTALL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
