import { Contact } from '@/components/sections/contact';
import { contactContent } from '@/config/contact';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Begin a conversation with Maison Véridique — appointments, bespoke commissions, press and client care.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <h1 className="sr-only">Contact</h1>
      <Contact content={contactContent} />
    </>
  );
}
