import BottomNav from '@/components/BottomNav';
import BrandingVideo from '@/components/BrandingVideo';
import Wordmark from '@/components/Wordmark';
import ShareButton from '@/components/ShareButton';

export const metadata = { title: 'Branding · SANTVS' };

export default function BrandingPage() {
  return (
    <>
      <div className="fixed inset-0 flex flex-col bg-black pb-[calc(env(safe-area-inset-bottom)+64px)]">
        <header className="flex items-center justify-between px-4 py-3">
          <Wordmark size="md" className="[filter:invert(1)]" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">Branding</span>
            <ShareButton className="text-neutral-300 hover:bg-white/10 hover:text-white" />
          </div>
        </header>
        <BrandingVideo />
      </div>
      <BottomNav />
    </>
  );
}
