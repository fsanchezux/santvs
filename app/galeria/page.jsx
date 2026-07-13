import Gallery from '@/components/Gallery';
import BottomNav from '@/components/BottomNav';
import Wordmark from '@/components/Wordmark';

export const metadata = { title: 'Galeria · SANTVS' };

export default function GaleriaPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Wordmark size="md" />
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">Galeria</span>
        </div>
      </header>
      <main>
        <Gallery />
      </main>
      <BottomNav />
    </>
  );
}
