import { Search, UserRound } from "lucide-react";
import type { AuthSession } from "@/lib/types";

export function AppHeader({
  authSession,
  query,
  setQuery,
}: {
  authSession: AuthSession | null;
  query: string;
  setQuery: (query: string) => void;
}) {
  return (
    <header className="border-b border-[#2e303b] bg-[#171821] px-4 py-4 sm:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        {authSession ? (
          <label className="flex h-11 w-full max-w-2xl items-center gap-3 rounded-lg border border-transparent bg-[#21222d] px-4 text-[#87888c] transition-colors focus-within:border-[#a9dfd8]">
            <Search aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.8} />
            <span className="sr-only">Busca</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#777984]"
              placeholder="Buscar produto, pedido, secretaria ou usuário"
              type="search"
            />
          </label>
        ) : (
          <div>
            <p className="text-xs font-semibold text-[#87888c]">Portal administrativo</p>
            <p className="mt-0.5 text-sm font-bold text-white">Acesso de servidores</p>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-right sm:block">
            <span className="block text-sm font-semibold text-white">{authSession?.name ?? "Acesso municipal"}</span>
            <span className="block text-xs text-[#87888c]">{authSession?.email ?? "Identificação necessária"}</span>
          </span>
          <span className="grid size-10 place-items-center rounded-full border border-[#353743] bg-[#21222d] text-[#a9dfd8]">
            {authSession ? (
              <span className="text-sm font-black">{authSession.name.charAt(0).toUpperCase()}</span>
            ) : (
              <UserRound aria-hidden="true" className="size-5" strokeWidth={1.8} />
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
