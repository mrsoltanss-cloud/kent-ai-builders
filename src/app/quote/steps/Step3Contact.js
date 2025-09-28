"use client";

import { useState } from "react";

export default function Step3Contact({ next, back, data }) {
  const [name, setName]       = useState(data.name || "");
  const [phone, setPhone]     = useState(data.phone || "");
  const [email, setEmail]     = useState(data.email || "");
  const [budget, setBudget]   = useState(data.budget || "");
  const [timeline, setTimeline]= useState(data.timeline || "");

  function handleNext() {
    if (!name.trim())  return alert("Please enter your name");
    if (!phone.trim()) return alert("Please enter your phone number");

    next({ name, phone, email, budget, timeline });
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Contact & Budget</h2>

      <label className="block font-medium mb-1">Name</label>
      <input
        className="w-full border rounded p-2 mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your full name"
      />

      <label className="block font-medium mb-1">Phone</label>
      <input
        className="w-full border rounded p-2 mb-4"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+44…"
      />

      <label className="block font-medium mb-1">Email (optional)</label>
      <input
        className="w-full border rounded p-2 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
      />

      <label className="block font-medium mb-1">Budget</label>
      <select
        className="w-full border rounded p-2 mb-4"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      >
        <option value="">Select…</option>
        <option value="£0–£2,000">£0–£2,000</option>
        <option value="£2,000–£5,000">£2,000–£5,000</option>
        <option value="£5,000–£10,000">£5,000–£10,000</option>
        <option value="£10,000–£25,000">£10,000–£25,000</option>
        <option value="£25,000–£50,000">£25,000–£50,000</option>
        <option value="£50,000+">£50,000+</option>
      </select>

      <label className="block font-medium mb-1">When would you like to start?</label>
      <select
        className="w-full border rounded p-2 mb-6"
        value={timeline}
        onChange={(e) => setTimeline(e.target.value)}
      >
        <option value="">Select…</option>
        <option value="ASAP (next few weeks)">ASAP (next few weeks)</option>
        <option value="1–3 months">1–3 months</option>
        <option value="3–6 months">3–6 months</option>
        <option value="6+ months / just researching">6+ months / just researching</option>
      </select>

      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 rounded border">
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
