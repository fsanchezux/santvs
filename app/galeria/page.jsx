import Gallery from '@/components/Gallery';
import BottomNav from '@/components/BottomNav';
import Wordmark from '@/components/Wordmark';
import ShareButton from '@/components/ShareButton';

export const metadata = {
  title: 'Galeria',
  description: 'Galeria de fotos compartida de Les Santes de Mataró 2026.',
  alternates: { canonical: '/galeria' },
};

export default function GaleriaPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-900/5 bg-neutral-50/85 backdrop-blur dark:border-white/5 dark:bg-neutral-950/85">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Wordmark size={20} />
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Galeria</span>
            <ShareButton />
          </div>
        </div>
      </header>
      <main>
        <Gallery />
      </main>
      <BottomNav />
    </>
  );
}
