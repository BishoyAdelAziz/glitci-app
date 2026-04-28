"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X } from "lucide-react";

const SEARCH_PLACEHOLDERS: Record<string, string> = {
  "/overview": "Search overview...",
  "/projects": "Search projects...",
  "/clients": "Search clients...",
  "/employees": "Search employees...",
  "/tasks/analytics": "Search analytics...",
  "/tasks": "Search tasks...",
  "/assets": "Search assets...",
  "/services/departments": "Search departments...",
  "/services/positions": "Search positions...",
  "/services/skills": "Search skills...",
  "/services": "Search services...",
  "/transactions": "Search transactions...",
};

function usePlaceholder() {
  const pathname = usePathname();
  const match = Object.keys(SEARCH_PLACEHOLDERS)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));
  return match ? SEARCH_PLACEHOLDERS[match] : "Search...";
}

function useSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const placeholder = usePlaceholder();

  const [inputValue, setInputValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    setInputValue(searchParams.get("search") ?? "");
  }, [pathname, searchParams]);

  const pushSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }, 400);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      pushSearch(e.target.value);
    },
    [pushSearch],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    pushSearch("");
  }, [pushSearch]);

  return { inputValue, handleChange, handleClear, placeholder };
}

export default function DesktopSearch() {
  const { inputValue, handleChange, handleClear, placeholder } = useSearchInput();
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const openSearch = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const tryCollapse = useCallback(() => {
    if (!inputValue) setExpanded(false);
  }, [inputValue]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        tryCollapse();
      }
    }
    if (expanded) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [expanded, tryCollapse]);

  return (
    <div ref={wrapperRef} className="flex items-center gap-1">
      <div
        className={`
          flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out
          rounded-2xl bg-gray-100 dark:bg-gray-800
          ${expanded ? "w-48 px-3 py-1.5" : "w-0 px-0 opacity-0"}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={tryCollapse}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 min-w-0"
        />
        {inputValue && (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <button
        onClick={expanded ? undefined : openSearch}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors
          hover:bg-gray-100 dark:hover:bg-gray-800
          ${expanded ? "text-red-500" : "text-gray-500"}`}
      >
        <Search size={20} />
      </button>
    </div>
  );
}
