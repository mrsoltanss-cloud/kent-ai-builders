"use client";
import { useState } from "react";

export default function Step5Contact({ next, back, data }) {
  const [name, setName] = useState(data.name || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [email, setEmail] = useState(data.email || "");
  const [consent, setConsent] = useState(data.consent || false);

  function handleNext() {
    if (!name || !phone || !consent) {
      alert("Name, phone and consent are required.");
      return;
    }
    next({ name, phone, email, consent });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact & Consent</h2>

      <label className="block mb-2 font-medium">Full Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="block mb-2 font-medium">Mobile phone</label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border rounded p-2 mb-4"
        placeholder="+44..."
      />

      <label className="block mb-2 font-medium">Email (optional)</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        I’m happy to be contacted by Brixel or a vetted builder partner about my project.
      </label>

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
          Submit ✅
        </button>
      </div>
    </div>
  );
}
