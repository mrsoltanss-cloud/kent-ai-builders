"use client";
import { useState } from "react";

export default function Step2Scope({ next, back, data }) {
  const [description, setDescription] = useState(data.description || "");

  function handleNext() {
    if (!description.trim()) return alert("Please describe the work briefly.");
    next({ description });
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Scope & Description</h2>
      <textarea
        className="w-full border rounded p-3 h-40 mb-6"
        placeholder="Tell us what needs doing…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 rounded border">← Back</button>
        <button onClick={handleNext} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Next →</button>
      </div>
    </div>
  );
}
