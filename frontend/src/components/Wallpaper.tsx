interface WallpaperProps {
  url?: string;
}

export default function Wallpaper({ url }: WallpaperProps) {
  const isVideo = url && url.toLowerCase().includes(".mp4");
  const defaultWallpaper = "/assets/generated/wallpaper.dim_1920x1080.png";
  const src = url && url.trim() !== "" ? url : defaultWallpaper;

  if (isVideo) {
    return (
      <video
        key={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt="Desktop Wallpaper"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
