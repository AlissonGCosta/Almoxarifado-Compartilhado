import {
  ArrowLeftRight,
  Building2,
  LayoutDashboard,
  Package,
  ShoppingCart,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { tabs } from "@/lib/mock-data";
import type { AuthSession, TabId } from "@/lib/types";

const tabIcons: Record<TabId, LucideIcon> = {
  painel: LayoutDashboard,
  pedidos: ShoppingCart,
  transferencias: ArrowLeftRight,
  itens: Package,
  secretarias: Building2,
  usuarios: Users,
  acesso: UserRound,
};

export function AppSidebar({
  activeTab,
  authSession,
  setActiveTab,
}: {
  activeTab: TabId;
  authSession: AuthSession | null;
  setActiveTab: (tab: TabId) => void;
}) {
  const visibleTabs = authSession ? tabs : tabs.filter((tab) => tab.id === "acesso");

  return (
    <aside className="border-b border-[#2e303b] bg-[#171821] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
      <nav
        className="flex gap-2 overflow-x-auto px-4 py-4 lg:grid lg:gap-1.5 lg:overflow-visible lg:px-4 lg:py-6"
        aria-label="Navegação principal"
      >
        {visibleTabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors lg:w-full ${
                isActive
                  ? "bg-[#a9dfd8] text-[#171821]"
                  : "text-[#9a9ba4] hover:bg-[#21222d] hover:text-white"
              }`}
              type="button"
            >
              <Icon aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.8} />
              <span>{tab.id === "acesso" && authSession ? "Minha conta" : tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
