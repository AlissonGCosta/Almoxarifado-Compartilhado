export function NoticeBar({
  notice,
  secretariasCount,
  showBase,
}: {
  notice: string;
  secretariasCount: number;
  showBase: boolean;
}) {
  return (
    <section className="border-b border-[#cbd8d0] bg-[#f8faf8]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm text-[#315245] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>{notice}</span>
        {showBase && <span className="font-semibold">Base: {secretariasCount} secretarias cadastradas</span>}
      </div>
    </section>
  );
}
