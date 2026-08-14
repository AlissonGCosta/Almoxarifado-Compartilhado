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
    <header className="flex h-[82px] shrink-0 items-center border-b-2 border-black bg-white px-6 text-black">
      <div className="flex w-full items-center justify-between gap-4">
        {authSession ? (
          <label className="flex h-12 w-full max-w-2xl items-center gap-3 border-2 border-black bg-white px-4 text-black shadow-[4px_4px_0_0_#000] focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-[6px_6px_0_0_#000] transition-all">
            <Search aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
            <span className="sr-only">Busca</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-black outline-none placeholder:text-neutral-500"
              placeholder="BUSCAR PRODUTO, PEDIDO, SECRETARIA..."
              type="search"
            />
          </label>
        ) : (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Portal administrativo</p>
            <p className="text-xl font-black uppercase text-black">Acesso de servidores</p>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden text-right sm:block">
            <span className="block text-sm font-black uppercase text-black">{authSession?.name ?? "Acesso municipal"}</span>
            <span className="block text-xs font-bold text-neutral-500">{authSession?.email ?? "Identificação necessária"}</span>
          </span>
          <span className="grid size-12 place-items-center border-2 border-black bg-black text-white shadow-[4px_4px_0_0_#000]">
            {authSession ? (
              <span className="text-lg font-black">{authSession.name.charAt(0).toUpperCase()}</span>
            ) : (
              <UserRound aria-hidden="true" className="size-6" strokeWidth={2.5} />
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
