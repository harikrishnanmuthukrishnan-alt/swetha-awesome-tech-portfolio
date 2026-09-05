import { useState } from "react";
import { useContent } from "@/lib/content-context";
import { supabase } from "@/lib/supabase";
import { AdminCard, SectionHeader, Notification, AddButton, EmptyState } from "../ui";
import { Trash2, Pencil, Check, X, Plus } from "lucide-react";
import type { ExperienceItem } from "@/lib/types";

const emptyForm = {
  role: "",
  company: "",
  period: "",
  is_current: false,
  responsibilities: [] as string[],
};

export default function ExperienceEditor() {
  const { experience, refresh } = useContent();
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [newResp, setNewResp] = useState("");

  const showNotif = (type: "success" | "error", message: string) => {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 3000);
  };

  const startAdd = () => {
    setEditingId("new");
    setForm(emptyForm);
    setNewResp("");
  };

  const startEdit = (exp: ExperienceItem) => {
    setEditingId(exp.id);
    setForm({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      is_current: exp.is_current,
      responsibilities: [...exp.responsibilities],
    });
    setNewResp("");
  };

  const cancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async () => {
    if (!form.role.trim() || !form.company.trim()) return;
    if (editingId === "new") {
      const { error } = await supabase.from("experience").insert({
        role: form.role,
        company: form.company,
        period: form.period,
        is_current: form.is_current,
        responsibilities: form.responsibilities,
        sort_order: experience.length,
      });
      if (error) return showNotif("error", error.message);
      showNotif("success", "Experience added!");
    } else if (editingId) {
      const { error } = await supabase.from("experience").update({
        role: form.role,
        company: form.company,
        period: form.period,
        is_current: form.is_current,
        responsibilities: form.responsibilities,
      }).eq("id", editingId);
      if (error) return showNotif("error", error.message);
      showNotif("success", "Experience updated!");
    }
    cancel();
    refresh();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this experience entry?")) return;
    await supabase.from("experience").delete().eq("id", id);
    refresh();
    showNotif("success", "Experience deleted!");
  };

  const addResp = () => {
    if (newResp.trim()) {
      setForm({ ...form, responsibilities: [...form.responsibilities, newResp.trim()] });
      setNewResp("");
    }
  };

  const removeResp = (idx: number) => {
    setForm({ ...form, responsibilities: form.responsibilities.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Experience Management" description="Add, edit, and delete your career timeline entries." />
      {notif && <Notification type={notif.type} message={notif.message} />}

      {editingId === null && (
        <AddButton onClick={startAdd} label="Add Experience" />
      )}

      {/* Edit form */}
      {editingId !== null && (
        <AdminCard>
          <h3 className="mb-4 text-sm font-semibold text-gray-300">
            {editingId === "new" ? "New Experience" : "Edit Experience"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Job Title</label>
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Period</label>
              <input type="text" placeholder="e.g. December 2022 — Present" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Current Position?</label>
              <button
                onClick={() => setForm({ ...form, is_current: !form.is_current })}
                className={`relative h-7 w-12 rounded-full transition-colors ${form.is_current ? "bg-green-500" : "bg-gray-600"}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${form.is_current ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Responsibilities</label>
            <div className="space-y-2">
              {form.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg border border-[#2a2a3a] bg-[#0f0f16] px-3 py-2">
                  <span className="flex-1 text-sm text-gray-300">{resp}</span>
                  <button onClick={() => removeResp(idx)} className="text-red-400 hover:bg-red-500/10 rounded p-1">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input type="text" placeholder="Add a responsibility" value={newResp} onChange={(e) => setNewResp(e.target.value)} className="input-field flex-1" />
                <button onClick={addResp} className="rounded-lg bg-purple-500/20 p-2 text-purple-300 hover:bg-purple-500/30">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={save} className="rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/30">Save</button>
            <button onClick={cancel} className="rounded-lg bg-gray-500/20 px-4 py-2 text-sm text-gray-400 hover:bg-gray-500/30">Cancel</button>
          </div>
        </AdminCard>
      )}

      {/* Existing entries */}
      {editingId === null && experience.map((exp) => (
        <AdminCard key={exp.id}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">{exp.role}</h3>
              <p className="text-sm text-purple-400">{exp.company}</p>
              <p className="mt-1 text-xs text-gray-500">{exp.period}</p>
              {exp.is_current && <span className="mt-1 inline-block rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] text-green-400">Current</span>}
              <ul className="mt-3 space-y-1">
                {exp.responsibilities.slice(0, 3).map((r, i) => (
                  <li key={i} className="text-xs text-gray-400">• {r}</li>
                ))}
                {exp.responsibilities.length > 3 && <li className="text-xs text-gray-500">+ {exp.responsibilities.length - 3} more</li>}
              </ul>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(exp)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => remove(exp.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </AdminCard>
      ))}
      {editingId === null && experience.length === 0 && <EmptyState message="No experience entries yet." />}
    </div>
  );
}
