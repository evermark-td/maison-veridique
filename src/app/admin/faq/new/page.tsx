import { FaqForm } from '@/components/admin/faq-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'New Question — Admin', path: '/admin/faq/new', noIndex: true });

export default function NewFaqPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">FAQ</p>
      <h1 className="display mt-3 text-d3">A new question.</h1>
      <div className="mt-10">
        <FaqForm />
      </div>
    </div>
  );
}
