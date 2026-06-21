import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  error,
  value,
  onChange,
  options = [],
  disabled = false,
  name,
  style = {},
  ...props
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (nextValue) => {
    onChange?.({ target: { value: nextValue, name } });
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-1.5" style={style}>
      {label && (
        <label className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-[14px] border px-3.5 py-3 text-left text-[15px] text-[var(--text-dark)] outline-none transition ${
          error ? 'border-red-500' : open ? 'border-[var(--primary)] shadow-[0_0_0_3px_rgba(255,31,61,0.18)]' : 'border-[var(--glass-border)]'
        } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} bg-surface-alt`}
        {...props}
      >
        <span>{selectedOption?.label || 'Select an option'}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && !disabled && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/10 bg-surface shadow-xl"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center px-3.5 py-2.5 text-left text-sm text-[var(--text-dark)] transition hover:bg-surface-alt ${
                option.value === value ? 'bg-surface-alt' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
