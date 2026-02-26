import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { Settings, AccentColor, ClockFormat, FontSize, ParticleIntensity, ScanlineEffect, TaskbarHeight, UITransparency, WindowBorderGlow } from "../backend";

export const DEFAULT_SETTINGS: Settings = {
  accentColor: AccentColor.cyan,
  wallpaperUrl: "",
  desktopLabel: "My DFINITY Desktop",
  fontSize: FontSize.medium,
  uiTransparency: UITransparency.medium,
  clockFormat: ClockFormat.hour24,
  taskbarHeight: TaskbarHeight.normal,
  iconSize: "medium" as Settings["iconSize"],
  particleIntensity: ParticleIntensity.medium,
  scanlineEffect: ScanlineEffect.on,
  gridOverlay: "on" as Settings["gridOverlay"],
  windowBorderGlow: WindowBorderGlow.subtle,
};

// We store apps in local state since the backend only supports getApp(id) and addApp()
// We track added app IDs in localStorage to persist across refreshes
const APPS_STORAGE_KEY = "zero_os_app_ids";

function getStoredAppIds(): string[] {
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeAppId(id: string) {
  const ids = getStoredAppIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(ids));
  }
}

export function useGetAllApps() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["apps"],
    queryFn: async () => {
      if (!actor) return [];
      const ids = getStoredAppIds();
      if (ids.length === 0) return [];
      const results = await Promise.allSettled(ids.map((id) => actor.getApp(id)));
      return results
        .filter(
          (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof actor.getApp>>> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, url }: { id: string; name: string; url: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.addApp(id, name, url);
      storeAppId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
  });
}

export function useGetSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: async () => {
      if (!actor) return DEFAULT_SETTINGS;
      try {
        return await actor.getSettings();
      } catch {
        return DEFAULT_SETTINGS;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSettings: Settings) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.saveSettings(newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
