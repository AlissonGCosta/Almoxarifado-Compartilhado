"use client";

import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { AcessoTab } from "@/components/tabs/AcessoTab";
import { DashboardTab } from "@/components/tabs/DashboardTab";
import { ItensTab } from "@/components/tabs/ItensTab";
import { PedidosTab } from "@/components/tabs/PedidosTab";
import { SecretariasTab } from "@/components/tabs/SecretariasTab";
import { TransferenciasTab } from "@/components/tabs/TransferenciasTab";
import { UsuariosTab } from "@/components/tabs/UsuariosTab";
import { useAlmoxarifado } from "@/lib/use-almoxarifado";

export default function Home() {
  const app = useAlmoxarifado();

  if (!app.authSession) {
    return (
      <main className="min-h-screen bg-[#11121a] text-[#f4f4f6]">
        <AcessoTab app={app} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#11121a] text-[#f4f4f6] lg:flex">
      <AppSidebar activeTab={app.activeTab} authSession={app.authSession} setActiveTab={app.setActiveTab} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppHeader authSession={app.authSession} query={app.query} setQuery={app.setQuery} />

        <div className="grid w-full flex-1 content-start gap-6 px-4 py-6 sm:px-6">
          {app.authSession && app.isLoadingData ? (
            <p className="py-12 text-center text-sm font-semibold text-[#9a9ba4]">
              Carregando dados do almoxarifado...
            </p>
          ) : (
            <>
              {app.activeTab === "painel" && <DashboardTab app={app} />}
              {app.activeTab === "pedidos" && <PedidosTab app={app} />}
              {app.activeTab === "transferencias" && <TransferenciasTab app={app} />}
              {app.activeTab === "itens" && <ItensTab app={app} />}
              {app.activeTab === "secretarias" && <SecretariasTab app={app} />}
              {app.activeTab === "usuarios" && <UsuariosTab app={app} />}
              {app.activeTab === "acesso" && <AcessoTab app={app} />}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
