import { useSearchParams } from "next/navigation";

export function useSearchParam() {
  const searchParams = useSearchParams();
  return searchParams.get("search") ?? "";
}
