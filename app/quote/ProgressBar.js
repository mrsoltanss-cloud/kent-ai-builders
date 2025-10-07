"use client";
import React from "react";

export default function ProgressBar({ currentStep, totalSteps, section }) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="h-2 bg-slate-200">
        <div
          className="h-2 bg-teal-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Quote progress"
        />
      </div>
      <div className="px-4 py-2 text-sm text-slate-600 font-medium text-center">
        Step {currentStep} of {totalSteps} — {section} ({percent}%)
      </div>
    </div>
  );
}
