import { TestimonialForm } from '@/components/admin/testimonial-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'New Testimonial — Admin', path: '/admin/testimonials/new', noIndex: true });

export default function NewTestimonialPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Testimonials</p>
      <h1 className="display mt-3 text-d3">A new testimonial.</h1>
      <div className="mt-10">
        <TestimonialForm />
      </div>
    </div>
  );
}
