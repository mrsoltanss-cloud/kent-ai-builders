"use client";
import { useState } from "react";

export default function Step1Basics({ next, data }) {
  const [service, setService] = useState(data.service || "");
  const [postcode, setPostcode] = useState(data.postcode || "");
  const [start, setStart] = useState(data.start || "");

  function handleNext() {
    if (!service || !postcode || !start) {
      alert("Please complete all fields.");
      return;
    }
    next({ service, postcode, start });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Project Basics</h2>

      <label className="block mb-2 font-medium">What type of work?</label>
      <select
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select...</option>
        <option>Roof repair</option>
        <option>Repointing</option>
        <option>Loft conversion</option>
        <option>Extension</option>
        <option>Kitchen/Bathroom renovation</option>
        <option>General building</option>
        <option>Other</option>
      </select>

      <label className="block mb-2 font-medium">Postcode</label>
      <input
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
        className="w-full border rounded p-2 mb-4"
        placeholder="ME15..."
      />

      <label className="block mb-2 font-medium">When to start?</label>
      <select
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select...</option>
        <option>ASAP (next few weeks)</option>
        <option>1–3 months</option>
        <option>3–6 months</option>
        <option>6+ months / just researching</option>
      </select>

      <div className="flex justify-end">
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
