import { tabs } from "@/lib/mock-data";
import type { AuthSession, TabId } from "@/lib/types";

export function AppHeader({
  activeTab,
  authSession,
  query,
  setActiveTab,
  setQuery,
}: {
  activeTab: TabId;
  authSession: AuthSession | null;
  query: string;
  setActiveTab: (tab: TabId) => void;
  setQuery: (query: string) => void;
}) {
  const visibleTabs = authSession ? tabs : tabs.filter((tab) => tab.id === "acesso");

  return (
    <header className="border-b border-[#cbd8d0] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2d6f58]">
              Almoxarifado compartilhado
            </p>
            <h1 className="text-2xl font-bold text-[#10241e] sm:text-3xl">Gestão municipal de bens e materiais</h1>
          </div>

          {authSession && (
            <label className="flex w-full max-w-xl items-center gap-3 rounded border border-[#b9c8be] bg-[#f8faf8] px-3 py-2">
              <span className="text-sm font-semibold text-[#315245]">Busca</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#73827b]"
                placeholder="Produto, pedido, secretaria ou usuário"
                type="search"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex gap-2 overflow-x-auto" aria-label="Navegação principal">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 shrink-0 rounded border px-4 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-[#173f35] bg-[#173f35] text-white"
                    : "border-[#cbd8d0] bg-white text-[#27443a] hover:border-[#2d6f58]"
                }`}
                type="button"
              >
                {tab.id === "acesso" && authSession ? "Minha conta" : tab.label}
              </button>
            ))}
          </nav>
          {authSession && <span className="shrink-0 text-sm font-semibold text-[#315245]">{authSession.name}</span>}
        </div>
      </div>
    </header>
  );
}
