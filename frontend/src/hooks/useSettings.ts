import { useGetSettings } from "./useQueries";
import { Settings } from "../backend";

export function useSettings(): { settings: Settings | undefined; isLoading: boolean } {
  const { data, isLoading } = useGetSettings();
  return { settings: data as Settings | undefined, isLoading };
}
