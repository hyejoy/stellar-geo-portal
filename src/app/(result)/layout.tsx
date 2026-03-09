import ROIPanel from '@/src/app/(result)/result/[orderId]/ROIPanel';

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-[calc(100dvh-64px)] overflow-hidden">
      <div className="flex w-full">
        <div className="w-[320px]">
          <ROIPanel />
        </div>

        {/* <div className="flex flex-1 flex-col">
          <div className="bg-panel relative h-full w-full">{children}</div>
        </div> */}

        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </main>
  );
}
