"use client";
import { useState, useEffect } from "react";

const SERVICE_OPTIONS = [
  "Roof repair / full roof",
  "Flat roof (EPDM / GRP / felt)",
  "Chimney / lead flashing",
  "Gutters, fascias & soffits",
  "Bricklaying / brick repointing",
  "Rendering / external wall insulation",
  "Plastering / drylining",
  "Loft conversion",
  "House extension (rear / side / wrap)",
  "Garage conversion",
  "Kitchen renovation / fitting",
  "Bathroom / wet room renovation",
  "Plumbing (repairs / installs)",
  "Electrical work / rewiring",
  "Heating / boiler / radiators",
  "Underfloor heating",
  "Windows & doors (uPVC / aluminium / timber)",
  "Conservatory / orangery / garden room",
  "Carpentry / joinery",
  "Tiling (walls / floors)",
  "Flooring (laminate / wood / LVT)",
  "Painting & decorating",
  "Driveways & patios (block / resin / slabs)",
  "Landscaping / turfing",
  "Fencing & gates",
  "Decking / pergolas",
  "Damp proofing / basement",
  "Drainage (blocked / repair)",
  "Insulation (loft / cavity / solid wall)",
  "Solar PV / battery storage",
  "EV charger install",
  "Security / CCTV / alarms",
  "Glazing / double glazing",
  "Locksmith",
  "Handyman / odd jobs",
  "Other (describe)"
];

export default function Step1Basics({ next, data }) {
  const [service, setService] = useState(data.service || "");
  const [serviceOther, setServiceOther] = useState(data.service_other || "");
  const [postcode, setPostcode] = useState(data.postcode || "");
  const [start, setStart] = useState(data.start || "");

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Step1Basics LOADED v4 — options:", SERVICE_OPTIONS.length);
    }
  }, []);

  function handleNext() {
    if (!service) return alert("Please choose a job type.");
    if (!postcode) return alert("Please add your project postcode.");
    if (!start) return alert("Please choose when you’d like to start.");

    const payload = {
      service,
      service_other: service === "Other (describe)" ? serviceOther.trim() : "",
      postcode,
      start
    };

    if (service === "Other (describe)" && payload.service_other.length < 5) {
      alert("Please describe the type of work (at least 5 characters).");
      return;
    }
    next(payload);
  }

  return (
    <div>
      {/* visible marker so we can confirm live version */}
      <div className="text-[11px] text-gray-500 mb-2">services: v4</div>

      <h2 className="text-xl font-semibold mb-4">Project Basics</h2>

      <label className="block mb-2 font-medium">What type of work?</label>
      <select
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Select job type…</option>
        {SERVICE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {service === "Other (describe)" && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Tell us the job type</label>
          <input
            type="text"
            value={serviceOther}
            onChange={(e) => setServiceOther(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g. steel beam installation, chimney rebuild, etc."
          />
        </div>
      )}

      <label className="block mb-2 font-medium">Postcode</label>
      <input
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
        className="w-full border rounded p-2 mb-4"
        placeholder="ME15…"
      />

      <label className="block mb-2 font-medium">When would you like the work to start?</label>
      <select
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="w-full border rounded p-2 mb-6"
      >
        <option value="">Select…</option>
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
