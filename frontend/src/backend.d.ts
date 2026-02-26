import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AppEntry {
    id: string;
    url: string;
    name: string;
    position: [bigint, bigint];
}
export interface Settings {
    clockFormat: ClockFormat;
    particleIntensity: ParticleIntensity;
    accentColor: AccentColor;
    iconSize: IconSize;
    wallpaperUrl: string;
    uiTransparency: UITransparency;
    gridOverlay: GridOverlay;
    fontSize: FontSize;
    desktopLabel: string;
    scanlineEffect: ScanlineEffect;
    taskbarHeight: TaskbarHeight;
    windowBorderGlow: WindowBorderGlow;
}
export enum AccentColor {
    magenta = "magenta",
    cyan = "cyan",
    green = "green"
}
export enum ClockFormat {
    hour12 = "hour12",
    hour24 = "hour24"
}
export enum FontSize {
    large = "large",
    small = "small",
    medium = "medium"
}
export enum ParticleIntensity {
    low = "low",
    off = "off",
    high = "high",
    medium = "medium"
}
export enum ScanlineEffect {
    on = "on",
    off = "off"
}
export enum TaskbarHeight {
    normal = "normal",
    tall = "tall",
    compact = "compact"
}
export enum UITransparency {
    low = "low",
    high = "high",
    none = "none",
    medium = "medium"
}
export enum WindowBorderGlow {
    intense = "intense",
    none = "none",
    subtle = "subtle"
}
export interface backendInterface {
    addApp(id: string, name: string, url: string): Promise<void>;
    getApp(id: string): Promise<AppEntry>;
    getSettings(): Promise<Settings>;
    saveSettings(newSettings: Settings): Promise<void>;
}
