"use client";

import { useEffect } from "react";

export const FONTS = [
  "Cormorant Garamond",
  "Playfair Display",
  "DM Serif Display",
  "Bodoni Moda",
  "Fraunces",
  "Italiana",
  "Cinzel",
  "EB Garamond",
  "Crimson Text",
  "Libre Baskerville",
  "Lora",
  "Merriweather",
  "Spectral",
  "Josefin Slab",
  "Tenor Sans",
  "Josefin Sans",
  "Raleway",
  "Montserrat",
  "Inter",
  "Lato",
  "Poppins",
  "Nunito",
  "DM Sans",
  "Work Sans",
  "Outfit",
  "Jost",
  "Urbanist",
  "Mulish",
  "Plus Jakarta Sans",
  "Libre Caslon Text",
  "Gilda Display",
  "Unna",
  "Didact Gothic",
  "Questrial",
  "Cardo",
];

function loadGoogleFont(font: string) {
  const id = `gfont-${font.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:ital,wght@0,400;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}

interface Props {
  label: string;
  value: string;
  onChange: (font: string) => void;
}

export default function FontPicker({ label, value, onChange }: Props) {
  useEffect(() => {
    if (value) loadGoogleFont(value);
  }, [value]);

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-bloom-black/60 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => {
            loadGoogleFont(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full appearance-none border border-bloom-black/15 rounded-lg px-4 py-3 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-bloom-gold pr-8"
          style={{ fontFamily: value ? `"${value}", serif` : undefined }}
        >
          <option value="">Select a font…</option>
          {FONTS.map((font) => (
            <option key={font} value={font} style={{ fontFamily: `"${font}", serif` }}>
              {font}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-bloom-black/40 text-xs">
          ▾
        </span>
      </div>
      {value && (
        <p
          className="text-lg text-bloom-black/70 pt-1 truncate"
          style={{ fontFamily: `"${value}", serif` }}
        >
          The quick brown fox
        </p>
      )}
    </div>
  );
}
