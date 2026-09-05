import { type ReactNode } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-base p-6 ${className}`}>{children}</div>
  );
}

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
    </div>
  );
}

export function SaveButton({
  onSave,
  loading,
  children = "Save Changes",
}: {
  onSave: () => void;
  loading: boolean;
  children?: string;
}) {
  return (
    <button onClick={onSave} disabled={loading} className="btn-primary">
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function CancelButton({ onCancel }: { onCancel: () => void }) {
  return (
    <button onClick={onCancel} className="btn-secondary">
      Cancel
    </button>
  );
}

export function DeleteButton({
  onDelete,
  loading,
  confirmMessage = "Are you sure you want to delete this item?",
}: {
  onDelete: () => void;
  loading?: boolean;
  confirmMessage?: string;
}) {
  return (
    <button
      onClick={() => {
        if (window.confirm(confirmMessage)) onDelete();
      }}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
    >
      Delete
    </button>
  );
}

export function Notification({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${
        type === "success"
          ? "border-green-500/20 bg-green-500/5"
          : "border-red-500/20 bg-red-500/5"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
      )}
      <p className={`text-sm ${type === "success" ? "text-green-300" : "text-red-300"}`}>
        {message}
      </p>
    </div>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/5 px-4 py-2.5 text-sm font-medium text-purple-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/10"
    >
      + {label}
    </button>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#2a2a3a] p-12 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
