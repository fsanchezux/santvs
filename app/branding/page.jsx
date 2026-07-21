import BottomNav from '@/components/BottomNav';
import BrandingVideo from '@/components/BrandingVideo';
import Wordmark from '@/components/Wordmark';
import ShareButton from '@/components/ShareButton';

export const metadata = {
  title: 'Branding',
  description: 'El branding de Les Santes 2026 inspirat en el llenguatge visual de Strava.',
  alternates: { canonical: '/branding' },
};

export default function BrandingPage() {
  return (
    <>
      <div className="fixed inset-0 flex flex-col bg-black pb-[calc(env(safe-area-inset-bottom)+64px)]">
        <header className="flex items-center justify-between px-4 py-3">
          <Wordmark size={20} className="[filter:invert(1)]" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">Branding</span>
            <a
              href="https://www.instagram.com/fsanchez.co"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram · @fsanchez.co"
              title="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 hover:bg-white/10 hover:text-white"
            >
              <i className="fa-brands fa-instagram text-lg" aria-hidden="true" />
            </a>
            <ShareButton className="text-neutral-300 hover:bg-white/10 hover:text-white" />
          </div>
        </header>
        <BrandingVideo />
      </div>
      <BottomNav />
    </>
  );
}
