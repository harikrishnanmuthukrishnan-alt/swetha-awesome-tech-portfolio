import { useState, useEffect } from "react";
import { useContent } from "@/lib/content-context";
import { supabase } from "@/lib/supabase";
import { AdminCard, SectionHeader, SaveButton, Notification } from "../ui";
import { Upload, Loader2 } from "lucide-react";

export default function ProfileEditor() {
  const { siteContent, refresh } = useContent();
  const [form, setForm] = useState(siteContent);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(siteContent);
  }, [siteContent]);

  if (!form) return null;

  const handleSave = async () => {
    setSaving(true);
    setNotif(null);
    const { error } = await supabase.from("site_content").update({
      name: form.name,
      title: form.title,
      brand: form.brand,
      brand_tagline: form.brand_tagline,
      brand_short_tagline: form.brand_short_tagline,
      hero_intro: form.hero_intro,
      hero_heading: form.hero_heading,
      hero_subtext: form.hero_subtext,
      hero_cta_primary: form.hero_cta_primary,
      hero_cta_secondary: form.hero_cta_secondary,
      profile_photo_url: form.profile_photo_url,
      location: form.location,
      availability: form.availability,
      is_available: form.is_available,
      hero_tech_labels: form.hero_tech_labels,
    }).eq("id", 1);
    setSaving(false);
    if (error) {
      setNotif({ type: "error", message: error.message });
    } else {
      setNotif({ type: "success", message: "Profile updated successfully!" });
      refresh();
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `profile-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("admin-uploads")
      .upload(fileName, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage
        .from("admin-uploads")
        .getPublicUrl(fileName);
      setForm({ ...form, profile_photo_url: urlData.publicUrl });
    }
    setUploading(false);
  };

  const update = (field: string, value: string | boolean | string[]) =>
    setForm({ ...form, [field]: value });

  return (
    <div className="space-y-6">
      <SectionHeader title="Profile Management" description="Update your personal information, hero section, and profile photo." />

      {notif && <Notification type={notif.type} message={notif.message} />}

      {/* Profile photo */}
      <AdminCard>
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="h-32 w-32 overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#0f0f16]">
            {form.profile_photo_url ? (
              <img src={form.profile_photo_url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-600">
                <Upload className="h-8 w-8" />
              </div>
            )}
          </div>
          <div>
            <label className="btn-secondary cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload New Photo
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
            </label>
            <p className="mt-2 text-xs text-gray-500">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </AdminCard>

      {/* Personal info */}
      <AdminCard>
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={form.name} onChange={(v) => update("name", v)} />
          <Field label="Professional Title" value={form.title} onChange={(v) => update("title", v)} />
          <Field label="Brand" value={form.brand} onChange={(v) => update("brand", v)} />
          <Field label="Brand Tagline" value={form.brand_tagline} onChange={(v) => update("brand_tagline", v)} />
          <Field label="Short Tagline" value={form.brand_short_tagline} onChange={(v) => update("brand_short_tagline", v)} />
          <Field label="Location" value={form.location} onChange={(v) => update("location", v)} />
          <Field label="Availability Status" value={form.availability} onChange={(v) => update("availability", v)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Available?</label>
            <button
              onClick={() => update("is_available", !form.is_available)}
              className={`relative h-7 w-12 rounded-full transition-colors ${form.is_available ? "bg-green-500" : "bg-gray-600"}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${form.is_available ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </AdminCard>

      {/* Hero section */}
      <AdminCard>
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Hero Section</h3>
        <div className="space-y-4">
          <Field label="Hero Heading" value={form.hero_heading} onChange={(v) => update("hero_heading", v)} />
          <AreaField label="Hero Intro" value={form.hero_intro} onChange={(v) => update("hero_intro", v)} />
          <AreaField label="Hero Subtext" value={form.hero_subtext} onChange={(v) => update("hero_subtext", v)} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Primary CTA" value={form.hero_cta_primary} onChange={(v) => update("hero_cta_primary", v)} />
            <Field label="Secondary CTA" value={form.hero_cta_secondary} onChange={(v) => update("hero_cta_secondary", v)} />
          </div>
          <Field
            label="Hero Tech Labels (comma-separated)"
            value={form.hero_tech_labels.join(", ")}
            onChange={(v) => update("hero_tech_labels", v.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </div>
      </AdminCard>

      <div className="flex gap-3">
        <SaveButton onSave={handleSave} loading={saving} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </div>
  );
}

function AreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="input-field resize-none" />
    </div>
  );
}
