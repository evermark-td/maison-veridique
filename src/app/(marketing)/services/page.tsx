import { Pricing } from '@/components/sections/pricing';
import { Services } from '@/components/sections/services';
import { pricingContent } from '@/config/pricing';
import { servicesContent } from '@/config/services';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'Bespoke commission, personal styling, garment care and lifetime alterations — the services of Maison Véridique.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      {/* Structural page heading — the visual heading lives inside the
          Services section (h2), designed to work when composed into the
          homepage. Screen readers get the page label here. */}
      <h1 className="sr-only">Services</h1>
      <Services content={servicesContent} />
      <Pricing content={pricingContent} />
    </>
  );
}
