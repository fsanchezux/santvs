import ActList from '@/components/ActList';
import BottomNav from '@/components/BottomNav';
import Wordmark from '@/components/Wordmark';
import ShareButton from '@/components/ShareButton';
import JsonLd from '@/components/JsonLd';
import { festivalJsonLd } from '@/lib/jsonld';

export const metadata = {
  title: 'Actes',
  description: 'Tots els actes de Les Santes de Mataró 2026, ordenats i filtrables per dia.',
  alternates: { canonical: '/llista' },
};

export default function LlistaPage() {
  return (
    <>
      <JsonLd data={festivalJsonLd({ withSubEvents: true })} />
      <header className="sticky top-0 z-40 border-b border-neutral-900/5 bg-neutral-50/85 backdrop-blur dark:border-white/5 dark:bg-neutral-950/85">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Wordmark size={20} />
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Tots els actes</span>
            <ShareButton />
          </div>
        </div>
      </header>
      <main>
        <ActList />
      </main>
      <BottomNav />
    </>
  );
}
