'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AdminField, adminInputClass } from '@/components/admin/admin-field';
import { placeOrder } from '@/lib/actions/checkout';
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/checkout';

export function CheckoutForm({
  defaultEmail = '',
  defaultName = '',
}: {
  defaultEmail?: string;
  defaultName?: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: defaultEmail,
      fullName: defaultName,
      line1: '',
      line2: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
      phone: '',
    },
  });

  async function onSubmit(values: CheckoutInput) {
    const result = await placeOrder(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    router.push('/checkout/confirmation');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="label-micro">Delivery</p>

      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        <AdminField label="Email" htmlFor="email" error={errors.email?.message} required className="sm:col-span-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={adminInputClass}
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </AdminField>

        <AdminField label="Full name" htmlFor="fullName" error={errors.fullName?.message} required className="sm:col-span-2">
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className={adminInputClass}
            aria-invalid={Boolean(errors.fullName)}
            {...register('fullName')}
          />
        </AdminField>

        <AdminField label="Address" htmlFor="line1" error={errors.line1?.message} required className="sm:col-span-2">
          <input
            id="line1"
            type="text"
            autoComplete="address-line1"
            className={adminInputClass}
            aria-invalid={Boolean(errors.line1)}
            {...register('line1')}
          />
        </AdminField>

        <AdminField label="Apartment, suite (optional)" htmlFor="line2" error={errors.line2?.message} className="sm:col-span-2">
          <input
            id="line2"
            type="text"
            autoComplete="address-line2"
            className={adminInputClass}
            {...register('line2')}
          />
        </AdminField>

        <AdminField label="City" htmlFor="city" error={errors.city?.message} required>
          <input
            id="city"
            type="text"
            autoComplete="address-level2"
            className={adminInputClass}
            aria-invalid={Boolean(errors.city)}
            {...register('city')}
          />
        </AdminField>

        <AdminField label="Region / State (optional)" htmlFor="region" error={errors.region?.message}>
          <input
            id="region"
            type="text"
            autoComplete="address-level1"
            className={adminInputClass}
            {...register('region')}
          />
        </AdminField>

        <AdminField label="Postal code" htmlFor="postalCode" error={errors.postalCode?.message} required>
          <input
            id="postalCode"
            type="text"
            autoComplete="postal-code"
            className={adminInputClass}
            aria-invalid={Boolean(errors.postalCode)}
            {...register('postalCode')}
          />
        </AdminField>

        <AdminField label="Country" htmlFor="country" error={errors.country?.message} required>
          <input
            id="country"
            type="text"
            autoComplete="country-name"
            className={adminInputClass}
            aria-invalid={Boolean(errors.country)}
            {...register('country')}
          />
        </AdminField>

        <AdminField label="Telephone (optional)" htmlFor="phone" error={errors.phone?.message} className="sm:col-span-2">
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={adminInputClass}
            {...register('phone')}
          />
        </AdminField>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 flex w-full items-center justify-center gap-3 bg-foreground px-10 py-4 text-micro font-medium tracking-[0.16em] uppercase text-background transition-colors duration-500 [transition-timing-function:var(--ease-luxe)] hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? 'Placing your order…' : 'Place order'}
      </button>

      <p className="mt-4 text-caption text-muted-foreground">
        No payment is taken online. A client advisor confirms payment and delivery within one
        business day of your order.
      </p>
    </form>
  );
}
