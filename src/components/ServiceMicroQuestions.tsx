"use client";

import { useMemo } from "react";
import { getMicroQuestions, MicroQuestion } from "@/lib/questionBanks";

type Props = {
  service: string | null;
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
};

/**
 * Renders extra quick-tap micro-questions INSIDE Step 1 card.
 * No layout or design changes: same button style (compact pills),
 * same spacing assumptions as existing options.
 */
export default function ServiceMicroQuestions({ service, values, onChange }: Props) {
  const qs: MicroQuestion[] = useMemo(
    () => (service ? getMicroQuestions(service) : []),
    [service]
  );

  if (!service || qs.length === 0) return null;

  return (
    <div className="mt-4 space-y-4">
      {qs.map((q) => (
        <div key={q.id} className="space-y-2">
          <div className="text-sm font-medium text-gray-700">{q.label}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {q.options.map((opt) => {
              const active = values[q.id] === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => onChange(q.id, opt.value)}
                  className={`h-10 rounded-md border text-sm px-3 text-left transition
                    ${active ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 hover:border-gray-300"}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
