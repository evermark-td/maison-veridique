import { JournalForm } from '@/components/admin/journal-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'New Entry — Admin', path: '/admin/journal/new', noIndex: true });

export default function NewJournalPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Journal</p>
      <h1 className="display mt-3 text-d3">A new entry.</h1>
      <div className="mt-10">
        <JournalForm />
      </div>
    </div>
  );
}
