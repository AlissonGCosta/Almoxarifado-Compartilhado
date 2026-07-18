"use client";

import { AppHeader } from "@/components/AppHeader";
import { NoticeBar } from "@/components/NoticeBar";
import { AcessoTab } from "@/components/tabs/AcessoTab";
import { DashboardTab } from "@/components/tabs/DashboardTab";
import { ItensTab } from "@/components/tabs/ItensTab";
import { PedidosTab } from "@/components/tabs/PedidosTab";
import { PlanejamentoTab } from "@/components/tabs/PlanejamentoTab";
import { SecretariasTab } from "@/components/tabs/SecretariasTab";
import { UsuariosTab } from "@/components/tabs/UsuariosTab";
import { useAlmoxarifado } from "@/lib/use-almoxarifado";

export default function Home() {
  const app = useAlmoxarifado();

  return (
    <main className="flex min-h-screen flex-col bg-[#eef2ef] text-[#17231f]">
      <AppHeader
        activeTab={app.activeTab}
        query={app.query}
        setActiveTab={app.setActiveTab}
        setQuery={app.setQuery}
      />

      <NoticeBar notice={app.notice} secretariasCount={app.secretarias.length} />

      <div className="mx-auto grid w-full max-w-7xl flex-1 content-start gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {app.activeTab === "painel" && <DashboardTab app={app} />}
        {app.activeTab === "pedidos" && <PedidosTab app={app} />}
        {app.activeTab === "itens" && <ItensTab app={app} />}
        {app.activeTab === "secretarias" && <SecretariasTab app={app} />}
        {app.activeTab === "usuarios" && <UsuariosTab app={app} />}
        {app.activeTab === "acesso" && <AcessoTab />}
        {app.activeTab === "planejamento" && <PlanejamentoTab />}
      </div>
    </main>
  );
}
