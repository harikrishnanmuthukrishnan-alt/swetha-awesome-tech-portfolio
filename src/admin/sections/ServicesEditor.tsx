import { useState } from "react";
import { useContent } from "@/lib/content-context";
import { supabase } from "@/lib/supabase";
import { AdminCard, SectionHeader, Notification, AddButton, EmptyState } from "../ui";
import { Trash2, ChevronUp, ChevronDown, Pencil, Check, X } from "lucide-react";
import type { Service } from "@/lib/types";

export default function ServicesEditor() {
  const { services, refresh } = useContent();
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Service | null>(null);
  const [newService, setNewService] = useState({ icon: "Globe", title: "", description: "" });

  const showNotif = (type: "success" | "error", message: string) => {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 3000);
  };

  const addService = async () => {
    if (!newService.title.trim()) return;
    const { error } = await supabase.from("services").insert({
      icon: newService.icon,
      title: newService.title.trim(),
      description: newService.description.trim(),
      sort_order: services.length,
    });
    if (error) return showNotif("error", error.message);
    setNewService({ icon: "Globe", title: "", description: "" });
    refresh();
    showNotif("success", "Service added!");
  };

  const updateService = async () => {
    if (!editForm) return;
    const { error } = await supabase.from("services").update({
      icon: editForm.icon,
      title: editForm.title,
      description: editForm.description,
    }).eq("id", editForm.id);
    if (error) return showNotif("error", error.message);
    setEditingId(null);
    setEditForm(null);
    refresh();
    showNotif("success", "Service updated!");
  };

  const deleteService = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    refresh();
    showNotif("success", "Service deleted!");
  };

  const moveService = async (service: Service, dir: "up" | "down") => {
    const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === service.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];
    await Promise.all([
      supabase.from("services").update({ sort_order: other.sort_order }).eq("id", service.id),
      supabase.from("services").update({ sort_order: service.sort_order }).eq("id", other.id),
    ]);
    refresh();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Services Management" description="Add, edit, and reorder your service offerings." />
      {notif && <Notification type={notif.type} message={notif.message} />}

      {/* Add new */}
      <AdminCard>
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Add New Service</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input type="text" placeholder="Icon name (e.g. Globe)" value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} className="input-field" />
          <input type="text" placeholder="Service title" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} className="input-field sm:col-span-2" />
          <textarea placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="input-field resize-none sm:col-span-3" rows={2} />
        </div>
        <div className="mt-3">
          <AddButton onClick={addService} label="Add Service" />
        </div>
      </AdminCard>

      {/* Existing services */}
      {services.sort((a, b) => a.sort_order - b.sort_order).map((service, idx) => (
        <AdminCard key={service.id}>
          {editingId === service.id && editForm ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input type="text" value={editForm.icon} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} className="input-field" />
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="input-field sm:col-span-2" />
              </div>
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="input-field resize-none" rows={2} />
              <div className="flex gap-2">
                <button onClick={updateService} className="rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/30">Save</button>
                <button onClick={() => { setEditingId(null); setEditForm(null); }} className="rounded-lg bg-gray-500/20 px-4 py-2 text-sm text-gray-400 hover:bg-gray-500/30">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="flex flex-col">
                <button onClick={() => moveService(service, "up")} disabled={idx === 0} className="text-gray-500 disabled:opacity-30 hover:text-white">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => moveService(service, "down")} disabled={idx === services.length - 1} className="text-gray-500 disabled:opacity-30 hover:text-white">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 font-mono text-xs text-purple-300">{service.icon}</span>
                  <h3 className="text-sm font-semibold text-white">{service.title}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-400">{service.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingId(service.id); setEditForm({ ...service }); }}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { if (window.confirm("Delete this service?")) deleteService(service.id); }}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </AdminCard>
      ))}
      {services.length === 0 && <EmptyState message="No services yet. Add one above." />}
    </div>
  );
}
