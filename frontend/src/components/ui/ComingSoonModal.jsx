import React, { useEffect } from 'react';

export default function ComingSoonModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src="/images/powerlifting_coming_soon.png"
          alt="Powerlifting coming soon"
          className="w-full rounded-t-2xl object-cover"
        />
        <div className="p-6 text-center">
          <h2 className="mb-3 text-xl font-bold text-white">Powerlifting plans are coming</h2>
          <p className="mb-6 text-sm leading-6 text-white/60">
            Squat, bench press, and deadlift programming — built the GYMFIED way. Stay tuned.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
