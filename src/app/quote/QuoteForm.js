"use client";

import { useMemo, useState } from "react";
import Step1Basics from "./steps/Step1Basics";
import Step2Scope from "./steps/Step2Scope";
import Step3Contact from "./steps/Step3Contact";
import StepFinal from "./steps/StepFinal";

const STEPS = [
  { id: 1, name: "Project Basics", component: Step1Basics },
  { id: 2, name: "Scope & Description", component: Step2Scope },
  { id: 3, name: "Contact & Budget", component: Step3Contact },
  { id: 4, name: "Estimate", component: StepFinal },
];

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const CurrentStep = useMemo(
    () => STEPS.find((s) => s.id === step)?.component,
    [step]
  );

  const progress = Math.round((step / STEPS.length) * 100);

  function next(values) {
    setData((prev) => ({ ...prev, ...values }));
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Get Your Quote</h1>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-teal-600 transition-all"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Step {step} of {STEPS.length} — {STEPS[step - 1].name}
        </p>
      </div>

      {/* Step content */}
      <div className="mt-4">
        {CurrentStep && <CurrentStep next={next} back={back} data={data} />}
      </div>
    </div>
  );
}
