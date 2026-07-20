"use client";

import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { NoticeBar } from "@/components/NoticeBar";
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

  return (
    <main className="flex min-h-screen flex-col bg-[#eef2ef] text-[#17231f]">
      <AppHeader
        activeTab={app.activeTab}
        authSession={app.authSession}
        query={app.query}
        setActiveTab={app.setActiveTab}
        setQuery={app.setQuery}
      />

      <NoticeBar
        notice={app.notice}
        secretariasCount={app.secretarias.length}
        showBase={Boolean(app.authSession)}
      />

      <div className="mx-auto grid w-full max-w-7xl flex-1 content-start gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {app.authSession && app.isLoadingData ? (
          <p className="py-12 text-center text-sm font-semibold text-[#53645c]">Carregando dados do almoxarifado...</p>
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

      <AppFooter />
    </main>
  );
}
