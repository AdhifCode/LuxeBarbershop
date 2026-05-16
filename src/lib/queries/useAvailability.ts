"use client";

import { useQuery } from "@tanstack/react-query";
import type { Slot } from "@/server/availability";

interface Args {
  date: string | null;
  durationMin: number | null;
  barberId?: string | null;
}

export function useAvailability({ date, durationMin, barberId }: Args) {
  return useQuery({
    queryKey: ["availability", date, durationMin, barberId ?? "any"],
    enabled: Boolean(date && durationMin),
    queryFn: async (): Promise<Slot[]> => {
      const params = new URLSearchParams({
        date: date!,
        duration: String(durationMin!),
      });
      if (barberId) params.set("barberId", barberId);
      const res = await fetch(`/api/availability?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch availability");
      const json = (await res.json()) as { slots: Slot[] };
      return json.slots;
    },
  });
}
