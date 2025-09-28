"use client";
import { useState } from "react";

export default function Step2Scope({ next, back, data }) {
  const [property, setProperty] = useState(data.property || "");
  const [size, setSize] = useState(data.size || "");
  const [description, setDescription] = useState(data.description || "");
  const [files, setFiles] = useState([]);

  function handleNext() {
    if (!property || !description || description.length < 30) {
      alert("Please provide property type and at least 30 characters description.");
      return;
    }
    next({ property, size, description, files });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Scope & Description</h2>

      <label className="block mb-2 font-medium">Property type</label>
      <select
        value={property}
        onChange={(e) => setProperty(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select...</option>
        <option>Detached</option>
        <option>Semi-detached</option>
        <option>Terrace</option>
        <option>Flat/Apartment</option>
        <option>Commercial</option>
      </select>

      <label className="block mb-2 font-medium">Approx size (optional)</label>
      <input
        type="text"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="w-full border rounded p-2 mb-4"
        placeholder="e.g. 25m², 2 rooms"
      />

      <label className="block mb-2 font-medium">Describe your project</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded p-2 mb-4"
        rows={4}
        placeholder="e.g. 2-storey rear extension, knock through kitchen, add bi-fold doors..."
      />

      <label className="block mb-2 font-medium">Upload photos/plans (optional)</label>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
        className="mb-4"
      />

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
