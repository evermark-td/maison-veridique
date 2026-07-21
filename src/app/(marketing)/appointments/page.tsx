import { Contact } from '@/components/sections/contact';
import { Pricing } from '@/components/sections/pricing';
import { contactContent } from '@/config/contact';
import { pricingContent } from '@/config/pricing';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Private Appointments',
  description:
    'Three ways to be known by the house — private viewings, bespoke commissions and House Client. Appointments in Paris, Milan and Tokyo.',
  path: '/appointments',
});

export default function AppointmentsPage() {
  return (
    <>
      <h1 className="sr-only">Private Appointments</h1>
      <Pricing content={pricingContent} />
      <Contact content={contactContent} />
    </>
  );
}
