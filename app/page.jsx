import MapHome from '@/components/MapHome';
import BottomNav from '@/components/BottomNav';
import JsonLd from '@/components/JsonLd';
import { websiteJsonLd, festivalJsonLd } from '@/lib/jsonld';

export default function Page() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={festivalJsonLd()} />
      <MapHome />
      <BottomNav />
    </>
  );
}
