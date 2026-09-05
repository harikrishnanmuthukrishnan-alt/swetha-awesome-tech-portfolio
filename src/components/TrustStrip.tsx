import { Code2, ShoppingCart, Layers, Cloud } from "lucide-react";
import { trustHighlights } from "@/data/site";

const iconMap: Record<string, React.ElementType> = {
  Code2,
  ShoppingCart,
  Layers,
  Cloud,
};

export default function TrustStrip() {
  return (
    <section className="border-y border-[#1a1a25] bg-[#0d0d14] py-8">
      <div className="container-max grid grid-cols-2 gap-4 px-5 md:grid-cols-4 md:px-10 lg:px-20">
        {trustHighlights.map((item) => {
          const Icon = iconMap[item.icon] ?? Code2;
          return (
            <div
              key={item.label}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all duration-300 hover:border-[#2a2a3a] hover:bg-[#12121a]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/5 transition-colors group-hover:border-purple-500/40">
                <Icon className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-300">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
