'use client';
import React from 'react';

/**
 * Safe client-only wrapper.
 * If you later add a fancier implementation, keep this file name/exports the same.
 */
export default function TestimonialsHoloStack() {
  return (
    <section className="relative w-full py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          What our customers say
        </h2>
        <p className="mt-2 text-gray-600">
          Real reviews from recent projects. (Interactive card stack loads on the client.)
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-800">“Super quick estimate and tidy work.”</p>
            <div className="mt-3 text-xs text-gray-500">— Hannah · Kitchen refit · ME15</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-800">“Matched us with the right team the same day.”</p>
            <div className="mt-3 text-xs text-gray-500">— Amir · Loft dormer · DA1</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-800">“Price was spot-on vs final invoice.”</p>
            <div className="mt-3 text-xs text-gray-500">— Sarah · Bathroom refit · CT2</div>
          </div>
        </div>
      </div>
    </section>
  );
}
