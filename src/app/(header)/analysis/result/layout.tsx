export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="no-scrollbar flex-1 overflow-y-auto">
      <div className="w-full bg-red-400 p-6">{children}</div>
    </main>
  );
}
