"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import FontPicker from "./FontPicker";

type Position3x3 =
  | "top-left" | "top-centre" | "top-right"
  | "middle-left" | "centre" | "middle-right"
  | "bottom-left" | "bottom-centre" | "bottom-right";

type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface BrandKitData {
  logo_url: string | null;
  h1_font: string;
  h1_size: number;
  h1_colour: string;
  h2_font: string;
  h2_size: number;
  h2_colour: string;
  h3_font: string;
  h3_size: number;
  h3_colour: string;
  primary_colour: string;
  secondary_colour: string;
  accent_colour: string;
  overlay_colour: string;
  overlay_opacity: number;
  text_position: Position3x3;
  handle: string;
  logo_position: LogoPosition;
}

const DEFAULTS: BrandKitData = {
  logo_url: null,
  h1_font: "Cormorant Garamond",
  h1_size: 52,
  h1_colour: "#FAF8F5",
  h2_font: "Cormorant Garamond",
  h2_size: 28,
  h2_colour: "#C9A96E",
  h3_font: "Inter",
  h3_size: 18,
  h3_colour: "#FAF8F5",
  primary_colour: "#1A1A1A",
  secondary_colour: "#FAF8F5",
  accent_colour: "#C9A96E",
  overlay_colour: "#1A1A1A",
  overlay_opacity: 50,
  text_position: "bottom-left",
  handle: "",
  logo_position: "top-left",
};

const GRID_POSITIONS: { value: Position3x3; label: string }[] = [
  { value: "top-left", label: "↖" },
  { value: "top-centre", label: "↑" },
  { value: "top-right", label: "↗" },
  { value: "middle-left", label: "←" },
  { value: "centre", label: "·" },
  { value: "middle-right", label: "→" },
  { value: "bottom-left", label: "↙" },
  { value: "bottom-centre", label: "↓" },
  { value: "bottom-right", label: "↘" },
];

const LOGO_POSITIONS: { value: LogoPosition; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
];

interface Props {
  userId: string;
  initial: BrandKitData | null;
}

export default function BrandKitForm({ userId, initial }: Props) {
  const [form, setForm] = useState<BrandKitData>(initial ?? DEFAULTS);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initial?.logo_url ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof BrandKitData>(key: K, value: BrandKitData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    let logo_url = form.logo_url;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `${userId}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, logoFile, { upsert: true });

      if (uploadError) {
        setError(`Logo upload failed: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage.from("logos").getPublicUrl(path);
      logo_url = data.publicUrl;
    }

    const { error: dbError } = await supabase
      .from("brand_kits")
      .upsert({ ...form, logo_url, user_id: userId }, { onConflict: "user_id" });

    if (dbError) {
      setError(`Save failed: ${dbError.message}`);
    } else {
      setForm((prev) => ({ ...prev, logo_url }));
      setSaved(true);
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-12 pb-16">

      {/* Logo */}
      <Section title="Logo">
        <div className="flex items-start gap-6">
          <div
            className="w-24 h-24 rounded-xl border border-bloom-black/10 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-bloom-gold transition-colors flex-shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            {logoPreview ? (
              <Image src={logoPreview} alt="Logo preview" width={96} height={96} className="object-contain p-2" unoptimized />
            ) : (
              <span className="text-xs text-bloom-black/30 text-center px-2">Click to upload</span>
            )}
          </div>
          <div className="space-y-3 flex-1">
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={handleLogoSelect} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm border border-bloom-black/20 rounded-lg px-4 py-2 hover:border-bloom-gold hover:text-bloom-gold transition-colors"
            >
              {logoPreview ? "Replace logo" : "Upload logo"}
            </button>
            <p className="text-xs text-bloom-black/40">PNG with transparency recommended</p>
            <div>
              <label className="block text-xs font-medium text-bloom-black/60 uppercase tracking-wider mb-1">Logo position</label>
              <div className="flex gap-2 flex-wrap">
                {LOGO_POSITIONS.map((pos) => (
                  <button
                    key={pos.value}
                    type="button"
                    onClick={() => set("logo_position", pos.value)}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${form.logo_position === pos.value ? "bg-bloom-black text-bloom-cream border-bloom-black" : "border-bloom-black/20 hover:border-bloom-gold"}`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-8">
          {(["h1", "h2", "h3"] as const).map((level) => {
            const labels = {
              h1: "H1 — Display / Headline",
              h2: "H2 — Subheading (italic/script)",
              h3: "H3 — Body / Carousel text",
            };
            return (
              <div key={level} className="p-5 bg-white rounded-xl border border-bloom-black/8 space-y-4">
                <p className="text-sm font-medium">{labels[level]}</p>
                <FontPicker
                  label="Font"
                  value={form[`${level}_font`]}
                  onChange={(v) => set(`${level}_font`, v)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-bloom-black/60 uppercase tracking-wider mb-1">Size (px)</label>
                    <input
                      type="number"
                      min={10}
                      max={120}
                      value={form[`${level}_size`]}
                      onChange={(e) => set(`${level}_size`, Number(e.target.value))}
                      className="w-full border border-bloom-black/15 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-bloom-gold"
                    />
                  </div>
                  <ColourField
                    label="Colour"
                    value={form[`${level}_colour`]}
                    onChange={(v) => set(`${level}_colour`, v)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Brand Colours */}
      <Section title="Brand Colours">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ColourField label="Primary" value={form.primary_colour} onChange={(v) => set("primary_colour", v)} />
          <ColourField label="Secondary" value={form.secondary_colour} onChange={(v) => set("secondary_colour", v)} />
          <ColourField label="Accent" value={form.accent_colour} onChange={(v) => set("accent_colour", v)} />
        </div>
      </Section>

      {/* Overlay */}
      <Section title="Photo Overlay">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ColourField label="Overlay colour" value={form.overlay_colour} onChange={(v) => set("overlay_colour", v)} />
          <div>
            <label className="block text-xs font-medium text-bloom-black/60 uppercase tracking-wider mb-1">
              Opacity — {form.overlay_opacity}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.overlay_opacity}
              onChange={(e) => set("overlay_opacity", Number(e.target.value))}
              className="w-full accent-bloom-gold"
            />
            <div className="flex justify-between text-xs text-bloom-black/30 mt-1">
              <span>0%</span><span>100%</span>
            </div>
          </div>
        </div>
        <div
          className="mt-4 h-16 rounded-xl border border-bloom-black/10 relative overflow-hidden"
          style={{ backgroundColor: "#888" }}
        >
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              backgroundColor: form.overlay_colour,
              opacity: form.overlay_opacity / 100,
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium drop-shadow">
            Overlay preview
          </span>
        </div>
      </Section>

      {/* Text Position */}
      <Section title="Default Text Position">
        <p className="text-sm text-bloom-black/50 mb-4">Where text blocks appear by default on each slide.</p>
        <div className="grid grid-cols-3 gap-2 w-48">
          {GRID_POSITIONS.map((pos) => (
            <button
              key={pos.value}
              type="button"
              onClick={() => set("text_position", pos.value)}
              className={`h-14 rounded-lg text-xl border transition-colors ${form.text_position === pos.value ? "bg-bloom-black text-bloom-cream border-bloom-black" : "bg-white border-bloom-black/15 hover:border-bloom-gold text-bloom-black/50"}`}
            >
              {pos.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-bloom-black/50">
          Selected: <span className="text-bloom-black font-medium">{form.text_position.replace(/-/g, " ")}</span>
        </p>
      </Section>

      {/* Handle */}
      <Section title="Handle / Watermark">
        <div>
          <label className="block text-xs font-medium text-bloom-black/60 uppercase tracking-wider mb-1">Instagram handle</label>
          <input
            type="text"
            placeholder="@yourbusiness"
            value={form.handle}
            onChange={(e) => set("handle", e.target.value)}
            className="w-full max-w-xs border border-bloom-black/15 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-bloom-gold"
          />
          <p className="text-xs text-bloom-black/40 mt-1">Auto-placed bottom centre on every slide</p>
        </div>
      </Section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-bloom-black text-bloom-cream px-8 py-3 rounded-xl text-sm font-medium hover:bg-bloom-black/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save brand kit"}
        </button>
        {saved && <span className="text-sm text-green-700">Saved successfully</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-6 pb-3 border-b border-bloom-black/8">{title}</h2>
      {children}
    </div>
  );
}

function ColourField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-bloom-black/60 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-bloom-black/15 cursor-pointer bg-white p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          maxLength={7}
          className="flex-1 border border-bloom-black/15 rounded-lg px-3 py-2.5 text-sm font-mono bg-white focus:outline-none focus:ring-1 focus:ring-bloom-gold"
        />
      </div>
    </div>
  );
}
