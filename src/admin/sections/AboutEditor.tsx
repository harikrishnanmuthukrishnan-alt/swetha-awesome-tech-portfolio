import { useState, useEffect } from "react";
import { useContent } from "@/lib/content-context";
import { supabase } from "@/lib/supabase";
import { AdminCard, SectionHeader, SaveButton, Notification, AddButton, DeleteButton, EmptyState } from "../ui";
import { Trash2 } from "lucide-react";

export default function AboutEditor() {
  const { siteContent, highlights, refresh } = useContent();
  const [form, setForm] = useState(siteContent);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [newHighlight, setNewHighlight] = useState({ label: "", icon: "Code2" });

  useEffect(() => {
    setForm(siteContent);
  }, [siteContent]);

  if (!form) return null;

  const handleSave = async () => {
    setSaving(true);
    setNotif(null);
    const { error } = await supabase.from("site_content").update({
      about_description: form.about_description,
      about_professional_summary: form.about_professional_summary,
      about_brand_description: form.about_brand_description,
      about_brand_note: form.about_brand_note,
    }).eq("id", 1);
    setSaving(false);
    if (error) {
      setNotif({ type: "error", message: error.message });
    } else {
      setNotif({ type: "success", message: "About section updated!" });
      refresh();
    }
  };

  const addHighlight = async () => {
    if (!newHighlight.label.trim()) return;
    const { error } = await supabase.from("about_highlights").insert({
      label: newHighlight.label.trim(),
      icon: newHighlight.icon,
      sort_order: highlights.length,
    });
    if (!error) {
      setNewHighlight({ label: "", icon: "Code2" });
      refresh();
    }
  };

  const deleteHighlight = async (id: string) => {
    await supabase.from("about_highlights").delete().eq("id", id);
    refresh();
  };

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <div className="space-y-6">
      <SectionHeader title="About Management" description="Update your about section content and trust highlights." />
      {notif && <Notification type={notif.type} message={notif.message} />}

      <AdminCard>
        <h3 className="mb-4 text-sm font-semibold text-gray-300">About Descriptions</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">About Description</label>
            <textarea rows={4} value={form.about_description} onChange={(e) => update("about_description", e.target.value)} className="input-field resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Professional Summary</label>
            <textarea rows={3} value={form.about_professional_summary} onChange={(e) => update("about_professional_summary", e.target.value)} className="input-field resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Brand Description</label>
            <textarea rows={3} value={form.about_brand_description} onChange={(e) => update("about_brand_description", e.target.value)} className="input-field resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Brand Note</label>
            <textarea rows={2} value={form.about_brand_note} onChange={(e) => update("about_brand_note", e.target.value)} className="input-field resize-none" />
          </div>
        </div>
      </AdminCard>

      {/* Highlights */}
      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300">Trust Highlights</h3>
        </div>
        <div className="space-y-2">
          {highlights.map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-lg border border-[#2a2a3a] bg-[#0f0f16] px-4 py-3">
              <div>
                <p className="text-sm text-gray-200">{h.label}</p>
                <p className="text-xs text-gray-500">Icon: {h.icon}</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Delete this highlight?")) deleteHighlight(h.id);
                }}
                className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {highlights.length === 0 && <EmptyState message="No highlights yet." />}
        </div>

        {/* Add new */}
        <div className="mt-4 flex gap-3 border-t border-[#2a2a3a] pt-4">
          <input
            type="text"
            placeholder="Highlight label"
            value={newHighlight.label}
            onChange={(e) => setNewHighlight({ ...newHighlight, label: e.target.value })}
            className="input-field flex-1"
          />
          <input
            type="text"
            placeholder="Icon name"
            value={newHighlight.icon}
            onChange={(e) => setNewHighlight({ ...newHighlight, icon: e.target.value })}
            className="input-field w-32"
          />
          <AddButton onClick={addHighlight} label="Add" />
        </div>
      </AdminCard>

      <SaveButton onSave={handleSave} loading={saving} />
    </div>
  );
}
