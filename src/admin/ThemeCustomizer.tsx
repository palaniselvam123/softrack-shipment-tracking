import React, { useState, useEffect } from 'react';
import { Palette, Save, RotateCcw, CheckCircle, Monitor, Sliders } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ThemeSettings } from './types';

const PRESET_THEMES = [
  { name: 'Ocean Blue', primary: '#0284c7', secondary: '#0891b2', accent: '#0ea5e9', sidebar: '#1e293b' },
  { name: 'Forest', primary: '#16a34a', secondary: '#059669', accent: '#10b981', sidebar: '#1a2e1a' },
  { name: 'Slate', primary: '#475569', secondary: '#64748b', accent: '#94a3b8', sidebar: '#0f172a' },
  { name: 'Rose', primary: '#e11d48', secondary: '#be185d', accent: '#f43f5e', sidebar: '#1f1215' },
  { name: 'Amber', primary: '#d97706', secondary: '#b45309', accent: '#f59e0b', sidebar: '#1c1408' },
  { name: 'Teal', primary: '#0d9488', secondary: '#0891b2', accent: '#14b8a6', sidebar: '#0f2020' },
];

const FONT_OPTIONS = ['Inter', 'Roboto', 'Poppins', 'DM Sans', 'Nunito'];
const RADIUS_OPTIONS = [
  { label: 'None', value: 'rounded-none' },
  { label: 'Small', value: 'rounded-md' },
  { label: 'Medium', value: 'rounded-xl' },
  { label: 'Large', value: 'rounded-2xl' },
  { label: 'Full', value: 'rounded-3xl' },
];

const DEFAULT_THEME: Omit<ThemeSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  scope: 'global',
  primary_color: '#0284c7',
  secondary_color: '#0891b2',
  accent_color: '#0ea5e9',
  sidebar_color: '#1e293b',
  logo_url: '',
  company_name: 'LogiTRACK',
  font_family: 'Inter',
  border_radius: 'rounded-xl',
};

export default function ThemeCustomizer() {
  const [theme, setTheme] = useState<Omit<ThemeSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>(DEFAULT_THEME);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('theme_settings')
      .select('*')
      .eq('scope', 'global')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setThemeId(data.id);
          setTheme({
            scope: data.scope,
            primary_color: data.primary_color,
            secondary_color: data.secondary_color,
            accent_color: data.accent_color,
            sidebar_color: data.sidebar_color,
            logo_url: data.logo_url,
            company_name: data.company_name,
            font_family: data.font_family,
            border_radius: data.border_radius,
          });
        }
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const payload = { ...theme, updated_at: new Date().toISOString() };
    if (themeId) {
      await supabase.from('theme_settings').update(payload).eq('id', themeId);
    } else {
      const { data } = await supabase.from('theme_settings').insert({ ...payload, user_id: null }).select().maybeSingle();
      if (data) setThemeId(data.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function applyPreset(preset: typeof PRESET_THEMES[0]) {
    setTheme(t => ({
      ...t,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
      sidebar_color: preset.sidebar,
    }));
  }

  function handleReset() {
    setTheme(DEFAULT_THEME);
  }

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Palette className="w-5 h-5 text-sky-500" />
            Color Scheme
          </h3>

          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Presets</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_THEMES.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all"
                  title={preset.name}
                >
                  <div className="flex gap-0.5">
                    <div className="w-4 h-8 rounded-l-lg" style={{ backgroundColor: preset.primary }} />
                    <div className="w-4 h-8" style={{ backgroundColor: preset.secondary }} />
                    <div className="w-4 h-8 rounded-r-lg" style={{ backgroundColor: preset.sidebar }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <ColorPicker label="Primary Color" value={theme.primary_color} onChange={v => setTheme(t => ({ ...t, primary_color: v }))} />
            <ColorPicker label="Secondary Color" value={theme.secondary_color} onChange={v => setTheme(t => ({ ...t, secondary_color: v }))} />
            <ColorPicker label="Accent Color" value={theme.accent_color} onChange={v => setTheme(t => ({ ...t, accent_color: v }))} />
            <ColorPicker label="Sidebar Color" value={theme.sidebar_color} onChange={v => setTheme(t => ({ ...t, sidebar_color: v }))} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-500" />
            UI Elements
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Company Name</label>
              <input
                value={theme.company_name}
                onChange={e => setTheme(t => ({ ...t, company_name: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                placeholder="LogiTRACK"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Logo URL</label>
              <input
                value={theme.logo_url}
                onChange={e => setTheme(t => ({ ...t, logo_url: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                placeholder="https://your-cdn.com/logo.png"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Font Family</label>
              <div className="grid grid-cols-5 gap-2">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font}
                    onClick={() => setTheme(t => ({ ...t, font_family: font }))}
                    className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      theme.font_family === font
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Border Radius</label>
              <div className="flex gap-2">
                {RADIUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(t => ({ ...t, border_radius: opt.value }))}
                    className={`px-4 py-2 text-sm font-medium transition-all border-2 ${opt.value} ${
                      theme.border_radius === opt.value
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50 ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Theme'}</>}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <Monitor className="w-4 h-4 text-sky-500" />
            Live Preview
          </h4>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="h-8 flex items-center px-3 gap-2" style={{ backgroundColor: theme.sidebar_color }}>
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="flex-1 mx-2 h-3 bg-white/10 rounded" />
            </div>
            <div className="flex h-36">
              <div className="w-14 flex flex-col items-center py-3 gap-2" style={{ backgroundColor: theme.sidebar_color }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-7 h-7 rounded-lg ${i === 0 ? 'opacity-100' : 'opacity-40'}`} style={{ backgroundColor: theme.primary_color }} />
                ))}
              </div>
              <div className="flex-1 bg-gray-50 p-3 space-y-2">
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex-1 h-10 rounded-lg" style={{ backgroundColor: i === 0 ? theme.primary_color : i === 1 ? theme.secondary_color : theme.accent_color, opacity: 0.9 }} />
                  ))}
                </div>
                <div className="h-5 bg-white rounded-lg border border-gray-200" />
                <div className="h-3 bg-white rounded-lg border border-gray-200 w-3/4" />
                <div className="flex justify-end">
                  <div className="h-7 w-16 rounded-lg" style={{ backgroundColor: theme.primary_color }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h4 className="font-bold text-gray-900 mb-4 text-sm">Color Swatches</h4>
          <div className="space-y-2.5">
            {[
              { label: 'Primary', color: theme.primary_color },
              { label: 'Secondary', color: theme.secondary_color },
              { label: 'Accent', color: theme.accent_color },
              { label: 'Sidebar', color: theme.sidebar_color },
            ].map(swatch => (
              <div key={swatch.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg shadow-sm border border-black/10" style={{ backgroundColor: swatch.color }} />
                <div>
                  <p className="text-xs font-semibold text-gray-700">{swatch.label}</p>
                  <p className="text-xs text-gray-400 font-mono uppercase">{swatch.color}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h4 className="font-bold text-gray-900 mb-3 text-sm">Button Samples</h4>
          <div className="space-y-2">
            <button className="w-full py-2 text-sm font-semibold text-white rounded-xl transition-all" style={{ backgroundColor: theme.primary_color }}>
              Primary Button
            </button>
            <button className="w-full py-2 text-sm font-semibold text-white rounded-xl" style={{ backgroundColor: theme.secondary_color }}>
              Secondary Button
            </button>
            <button className="w-full py-2 text-sm font-semibold border-2 rounded-xl" style={{ color: theme.primary_color, borderColor: theme.primary_color }}>
              Outline Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
