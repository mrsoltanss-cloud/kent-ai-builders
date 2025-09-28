"use client";
import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import Step1Basics from "./steps/Step1Basics";
import Step2Scope from "./steps/Step2Scope";
import Step3Budget from "./steps/Step3Budget";
import Step4Decision from "./steps/Step4Decision";
import Step5Contact from "./steps/Step5Contact";
import Step6Complete from "./steps/Step6Complete";

const steps = [
  { id: 1, name: "Project Basics", component: Step1Basics },
  { id: 2, name: "Scope & Description", component: Step2Scope },
  { id: 3, name: "Budget & Finance", component: Step3Budget },
  { id: 4, name: "Decision & Ownership", component: Step4Decision },
  { id: 5, name: "Contact & Consent", component: Step5Contact },
  { id: 6, name: "Complete", component: Step6Complete },
];

export default function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const totalSteps = steps.length;
  const StepComponent = steps[currentStep - 1].component;

  function next(data) {
    setFormData({ ...formData, ...data });
    if (currentStep < totalSteps) {
      if (currentStep === totalSteps - 1) {
        // Last data collection step → submit before complete screen
        handleSubmit({ ...formData, ...data });
      }
      setCurrentStep(currentStep + 1);
    }
  }

  function back() {
    if (currentStep > 1 && currentStep < totalSteps) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleSubmit(data) {
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log("Submitted:", data);
    } catch (err) {
      console.error("Submit error", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        section={steps[currentStep - 1].name}
      />
      <div className="p-6">
        <StepComponent next={next} back={back} data={formData} />
      </div>
    </div>
  );
}
