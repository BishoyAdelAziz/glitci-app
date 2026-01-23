"use client";

export default function useMounted() {
  return typeof window !== "undefined";
}
