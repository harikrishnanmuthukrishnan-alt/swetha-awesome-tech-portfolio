import { useState } from "react";
import { useContent } from "@/lib/content-context";
import { supabase } from "@/lib/supabase";
import { AdminCard, SectionHeader, Notification, AddButton, EmptyState } from "../ui";
import { Trash2, Star, ChevronUp, ChevronDown, Pencil, Check, X } from "lucide-react";
import type { SkillCategory, Skill } from "@/lib/types";

export default function SkillsEditor() {
  const { skillCategories, skills, refresh } = useContent();
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatIcon, setEditCatIcon] = useState("");
  const [newCat, setNewCat] = useState({ title: "", icon: "Layout" });
  const [newSkill, setNewSkill] = useState<{ categoryId: string; name: string; featured: boolean }>({
    categoryId: "",
    name: "",
    featured: false,
  });

  const showNotif = (type: "success" | "error", message: string) => {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 3000);
  };

  const addCategory = async () => {
    if (!newCat.title.trim()) return;
    const { error } = await supabase.from("skill_categories").insert({
      title: newCat.title.trim(),
      icon: newCat.icon,
      sort_order: skillCategories.length,
    });
    if (error) return showNotif("error", error.message);
    setNewCat({ title: "", icon: "Layout" });
    refresh();
    showNotif("success", "Category added!");
  };

  const updateCategory = async (id: string) => {
    const { error } = await supabase.from("skill_categories")
      .update({ title: editCatName, icon: editCatIcon }).eq("id", id);
    if (error) return showNotif("error", error.message);
    setEditingCat(null);
    refresh();
    showNotif("success", "Category updated!");
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Delete this category and all its skills?")) return;
    await supabase.from("skill_categories").delete().eq("id", id);
    refresh();
    showNotif("success", "Category deleted!");
  };

  const addSkill = async () => {
    if (!newSkill.name.trim() || !newSkill.categoryId) return;
    const catSkills = skills.filter((s) => s.category_id === newSkill.categoryId);
    const { error } = await supabase.from("skills").insert({
      category_id: newSkill.categoryId,
      name: newSkill.name.trim(),
      featured: newSkill.featured,
      sort_order: catSkills.length,
    });
    if (error) return showNotif("error", error.message);
    setNewSkill({ categoryId: "", name: "", featured: false });
    refresh();
    showNotif("success", "Skill added!");
  };

  const toggleFeatured = async (skill: Skill) => {
    await supabase.from("skills").update({ featured: !skill.featured }).eq("id", skill.id);
    refresh();
  };

  const deleteSkill = async (id: string) => {
    await supabase.from("skills").delete().eq("id", id);
    refresh();
  };

  const moveSkill = async (skill: Skill, dir: "up" | "down") => {
    const catSkills = skills.filter((s) => s.category_id === skill.category_id).sort((a, b) => a.sort_order - b.sort_order);
    const idx = catSkills.findIndex((s) => s.id === skill.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= catSkills.length) return;
    const other = catSkills[swapIdx];
    await Promise.all([
      supabase.from("skills").update({ sort_order: other.sort_order }).eq("id", skill.id),
      supabase.from("skills").update({ sort_order: skill.sort_order }).eq("id", other.id),
    ]);
    refresh();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Skills Management" description="Add, edit, and organize your technical skills by category." />
      {notif && <Notification type={notif.type} message={notif.message} />}

      {/* Add new category */}
      <AdminCard>
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Add Category</h3>
        <div className="flex gap-3">
          <input type="text" placeholder="Category name" value={newCat.title} onChange={(e) => setNewCat({ ...newCat, title: e.target.value })} className="input-field flex-1" />
          <input type="text" placeholder="Icon name" value={newCat.icon} onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} className="input-field w-32" />
          <AddButton onClick={addCategory} label="Add Category" />
        </div>
      </AdminCard>

      {/* Categories with skills */}
      {skillCategories.map((cat) => {
        const catSkills = skills.filter((s) => s.category_id === cat.id).sort((a, b) => a.sort_order - b.sort_order);
        return (
          <AdminCard key={cat.id}>
            <div className="mb-4 flex items-center justify-between">
              {editingCat === cat.id ? (
                <div className="flex flex-1 gap-2">
                  <input type="text" value={editCatName} onChange={(e) => setEditCatName(e.target.value)} className="input-field flex-1" />
                  <input type="text" value={editCatIcon} onChange={(e) => setEditCatIcon(e.target.value)} className="input-field w-32" />
                  <button onClick={() => updateCategory(cat.id)} className="rounded-lg bg-purple-500/20 p-2 text-purple-300 hover:bg-purple-500/30">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingCat(null)} className="rounded-lg bg-gray-500/20 p-2 text-gray-400 hover:bg-gray-500/30">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-gray-200">{cat.title} <span className="text-xs text-gray-500">({cat.icon})</span></h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingCat(cat.id); setEditCatName(cat.title); setEditCatIcon(cat.icon); }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              {catSkills.map((skill, idx) => (
                <div key={skill.id} className="flex items-center gap-3 rounded-lg border border-[#2a2a3a] bg-[#0f0f16] px-4 py-2.5">
                  <div className="flex flex-col">
                    <button onClick={() => moveSkill(skill, "up")} disabled={idx === 0} className="text-gray-500 disabled:opacity-30 hover:text-white">
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button onClick={() => moveSkill(skill, "down")} disabled={idx === catSkills.length - 1} className="text-gray-500 disabled:opacity-30 hover:text-white">
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="flex-1 text-sm text-gray-200">{skill.name}</span>
                  <button onClick={() => toggleFeatured(skill)} className={`rounded-md p-1.5 ${skill.featured ? "text-purple-400" : "text-gray-600"}`}>
                    <Star className={`h-4 w-4 ${skill.featured ? "fill-purple-400" : ""}`} />
                  </button>
                  <button onClick={() => { if (window.confirm("Delete this skill?")) deleteSkill(skill.id); }} className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {catSkills.length === 0 && <p className="text-xs text-gray-500">No skills in this category yet.</p>}
            </div>

            {/* Add skill */}
            <div className="mt-3 flex gap-2 border-t border-[#2a2a3a] pt-3">
              <input
                type="text"
                placeholder="New skill name"
                value={newSkill.categoryId === cat.id ? newSkill.name : ""}
                onChange={(e) => setNewSkill({ ...newSkill, categoryId: cat.id, name: e.target.value })}
                className="input-field flex-1"
              />
              <button
                onClick={() => setNewSkill({ ...newSkill, categoryId: cat.id, featured: !newSkill.featured })}
                className={`rounded-lg border px-3 py-2 text-sm ${newSkill.categoryId === cat.id && newSkill.featured ? "border-purple-500/30 bg-purple-500/10 text-purple-300" : "border-[#2a2a3a] text-gray-500"}`}
              >
                Featured
              </button>
              <AddButton onClick={addSkill} label="Add" />
            </div>
          </AdminCard>
        );
      })}
      {skillCategories.length === 0 && <EmptyState message="No skill categories yet. Add one above." />}
    </div>
  );
}
