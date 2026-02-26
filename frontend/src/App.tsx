import { Toaster } from "@/components/ui/sonner";
import Desktop from "./components/Desktop";

export default function App() {
  return (
    <>
      <Desktop />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.15 0.02 220)",
            border: "1px solid oklch(0.7 0.25 195)",
            color: "oklch(0.95 0.05 195)",
            fontFamily: "Share Tech Mono, monospace",
          },
        }}
      />
    </>
  );
}
