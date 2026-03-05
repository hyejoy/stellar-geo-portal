'use client';

import { ChangeEvent } from 'react';

type Option = {
  label: string;
  value: string;
};

type SelectBoxProps = {
  value: string;
  options: Option[];
  onChange: (e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => void;
  placeholder?: string;
};

export default function SelectBox({
  value,
  options,
  onChange,
  placeholder = '선택하세요',
}: SelectBoxProps) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e)}
        className="w-full appearance-none rounded-xl border border-white/10 bg-gradient-to-b from-[#1b2230] to-[#121721] px-4 py-3 pr-10 text-sm text-gray-200 shadow-md transition outline-none hover:border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f141d]">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <svg
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
