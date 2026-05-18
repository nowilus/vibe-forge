import { lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Home } from "@/pages/Home";
import { Docs } from "@/pages/Docs";
import { Prompts } from "@/pages/Prompts";
import { Hooks } from "@/pages/Hooks";

const Health = lazy(() => import("@/pages/Health").then((m) => ({ default: m.Health })));
const Setup = lazy(() => import("@/pages/Setup").then((m) => ({ default: m.Setup })));

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden shrink-0 h-12 bg-vf-surface border-b border-vf-border flex items-center gap-3 px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-vf-accent/10 text-vf-muted hover:text-vf-accent transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
          <span className="text-sm font-bold text-vf-ink">
            <span className="text-vf-accent">vibe</span>-forge
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/health" element={<Health />} />
              <Route path="/prompts" element={<Prompts />} />
              <Route path="/hooks" element={<Hooks />} />
              <Route path="/setup" element={<Setup />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
