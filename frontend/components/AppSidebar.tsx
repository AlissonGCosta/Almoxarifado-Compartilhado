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
import { tabs } from "@/lib/constants";
import type { AuthSession, TabId } from "@/lib/types";
import { motion } from "motion/react";

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
    <aside className="border-b-2 border-black bg-white text-black lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r-2 lg:border-b-0">
      <div className="hidden h-[82px] shrink-0 items-center border-b-2 border-black px-6 lg:flex">
        <h1 className="text-2xl font-black tracking-tight uppercase">Almoxarifado</h1>
      </div>
      <nav
        className="flex w-full gap-4 overflow-x-auto px-4 py-4 lg:flex lg:flex-col lg:gap-3 lg:overflow-visible lg:px-6 lg:py-6"
        aria-label="Navegação principal"
      >
        {visibleTabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              whileHover={{ y: isActive ? 0 : -2, x: isActive ? 0 : -2, boxShadow: isActive ? "none" : "4px 4px 0 0 #000" }}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full h-12 shrink-0 items-center justify-start gap-3 border-2 px-4 text-left text-sm font-bold transition-colors ${
                isActive
                  ? "border-black bg-black text-white shadow-none"
                  : "border-transparent bg-white text-black hover:border-black"
              }`}
              type="button"
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
              <span className="uppercase tracking-wider">{tab.id === "acesso" && authSession ? "Conta" : tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}
