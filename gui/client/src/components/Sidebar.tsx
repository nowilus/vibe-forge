import { NavLink } from "react-router-dom";
import { Home, FileText, Activity, Zap, Shield, LucideIcon } from "lucide-react";
import { useLang } from "@/i18n/context";

interface NavItem {
  to: string;
  icon: LucideIcon;
  navKey: "home" | "docs" | "health" | "prompts" | "hooks";
  disabled?: boolean;
}

const NAV: NavItem[] = [
  { to: "/", icon: Home, navKey: "home" },
  { to: "/docs", icon: FileText, navKey: "docs" },
  { to: "/health", icon: Activity, navKey: "health" },
  { to: "/prompts", icon: Zap, navKey: "prompts" },
  { to: "/hooks", icon: Shield, navKey: "hooks" },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { t, lang, setLang } = useLang();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-vf-ink/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          ${mobileOpen ? "fixed inset-y-0 left-0 z-50" : "hidden"}
          md:relative md:flex
          w-56 shrink-0 border-r border-vf-border bg-vf-surface flex-col overflow-hidden
        `}
      >
        <img
          src="/documentation_discipline.png"
          alt=""
          className="absolute bottom-0 left-0 w-full opacity-[0.07] pointer-events-none select-none"
        />

        <div className="px-4 py-5 border-b border-vf-border relative">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <img src="/main.png" alt="" className="w-10 h-10 rounded" />
              <div>
                <p className="text-base font-bold tracking-tight text-vf-ink whitespace-nowrap">
                  <span className="text-vf-accent">vibe</span>-forge
                </p>
                <p className="text-[10px] text-vf-muted font-medium uppercase tracking-widest">
                  {t.nav.dashboard}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {(["en", "pl"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-[10px] font-mono px-2.5 py-1.5 rounded transition-colors uppercase min-h-[28px] ${
                    lang === l
                      ? "bg-vf-accent/15 text-vf-accent"
                      : "text-vf-muted/50 hover:text-vf-muted"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 relative">
          {NAV.map(({ to, icon: Icon, navKey, disabled }) => (
            <NavLink
              key={to}
              to={disabled ? "#" : to}
              onClick={disabled ? (e) => e.preventDefault() : onClose}
              aria-disabled={disabled ? "true" : undefined}
              tabIndex={disabled ? -1 : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  disabled
                    ? "text-vf-muted/40 cursor-not-allowed"
                    : isActive
                      ? "bg-vf-accent/10 text-vf-accent"
                      : "text-vf-muted hover:text-vf-text hover:bg-vf-bg"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.5} />
              <span>{t.nav[navKey]}</span>
              {disabled && (
                <span className="ml-auto text-[10px] uppercase tracking-wider opacity-40 font-mono">
                  {t.common.soon}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-vf-border relative">
          <p className="text-[10px] text-vf-muted font-mono">v1.1</p>
        </div>
      </aside>
    </>
  );
}
