import ActList from '@/components/ActList';
import BottomNav from '@/components/BottomNav';
import Wordmark from '@/components/Wordmark';

export const metadata = { title: 'Actes · SANTVS' };

export default function LlistaPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-900/5 bg-neutral-50/85 backdrop-blur dark:border-white/5 dark:bg-neutral-950/85">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Wordmark size="md" />
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">Tots els actes</span>
        </div>
      </header>
      <main>
        <ActList />
      </main>
      <BottomNav />
    </>
  );
}
