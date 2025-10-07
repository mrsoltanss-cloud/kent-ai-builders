"use client";
import { useState } from "react";

export default function Step3Budget({ next, back, data }) {
  const [budget, setBudget] = useState(data.budget || "");
  const [finance, setFinance] = useState(data.finance || "");

  function handleNext() {
    if (!budget) {
      alert("Please select a budget range.");
      return;
    }
    next({ budget, finance });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Budget & Finance</h2>

      <label className="block mb-2 font-medium">Budget range</label>
      <select
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select...</option>
        <option>{"< £5,000"}</option>
        <option>£5,000 – £15,000</option>
        <option>£15,000 – £50,000</option>
        <option>£50,000+</option>
        <option>Not sure</option>
      </select>

      <label className="block mb-2 font-medium">Open to financing?</label>
      <select
        value={finance}
        onChange={(e) => setFinance(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select...</option>
        <option>Yes</option>
        <option>Maybe</option>
        <option>No</option>
      </select>

      <div className="flex justify-between">
        <button
          onClick={back}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
