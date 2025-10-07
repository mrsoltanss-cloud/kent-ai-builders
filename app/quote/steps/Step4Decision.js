"use client";
import { useState } from "react";

export default function Step4Decision({ next, back, data }) {
  const [owner, setOwner] = useState(data.owner || "");
  const [factors, setFactors] = useState(data.factors || []);

  function toggleFactor(f) {
    setFactors((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function handleNext() {
    if (!owner) {
      alert("Please select ownership.");
      return;
    }
    next({ owner, factors });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Decision & Ownership</h2>

      <label className="block mb-2 font-medium">Are you the homeowner?</label>
      <select
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select...</option>
        <option>Yes</option>
        <option>Landlord</option>
        <option>Tenant / Agent</option>
      </select>

      <label className="block mb-2 font-medium">What matters most to you?</label>
      <div className="flex flex-col gap-2 mb-4">
        {["Reviews & reputation", "Price", "Availability", "Specialist expertise"].map(
          (f) => (
            <label key={f} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={factors.includes(f)}
                onChange={() => toggleFactor(f)}
              />
              {f}
            </label>
          )
        )}
      </div>

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
