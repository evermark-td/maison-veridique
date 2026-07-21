'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { AdminField, adminInputClass } from '@/components/admin/admin-field';
import { addAddress, deleteAddress } from '@/lib/actions/account-addresses';
import { addressSchema, type AddressInput } from '@/lib/validations/address';
import { cn } from '@/lib/utils';

export type SavedAddress = {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
};

export function AddressBook({ addresses }: { addresses: SavedAddress[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(addresses.length === 0);
  const [pendingDelete, startDelete] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      line1: '',
      line2: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
      phone: '',
    },
  });

  async function onSubmit(values: AddressInput) {
    const result = await addAddress(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Address saved.');
    reset();
    setAdding(false);
    router.refresh();
  }

  function remove(id: string) {
    startDelete(async () => {
      const result = await deleteAddress(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      {addresses.length > 0 ? (
        <ul className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2', pendingDelete && 'opacity-50')}>
          {addresses.map((address) => (
            <li key={address.id} className="flex flex-col justify-between border border-border p-6">
              <address className="text-body text-foreground/80 not-italic">
                <span className="text-foreground">{address.fullName}</span>
                <br />
                {address.line1}
                {address.line2 ? (
                  <>
                    <br />
                    {address.line2}
                  </>
                ) : null}
                <br />
                {address.city}
                {address.region ? `, ${address.region}` : ''} {address.postalCode}
                <br />
                {address.country}
                {address.phone ? (
                  <>
                    <br />
                    {address.phone}
                  </>
                ) : null}
              </address>
              <button
                type="button"
                onClick={() => remove(address.id)}
                className="mt-5 self-start text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-destructive"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {adding ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 max-w-xl border-t border-border pt-8">
          <p className="label-micro">New address</p>
          <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            <AdminField label="Full name" htmlFor="a-fullName" error={errors.fullName?.message} required className="sm:col-span-2">
              <input id="a-fullName" className={adminInputClass} aria-invalid={Boolean(errors.fullName)} {...register('fullName')} />
            </AdminField>
            <AdminField label="Address" htmlFor="a-line1" error={errors.line1?.message} required className="sm:col-span-2">
              <input id="a-line1" className={adminInputClass} aria-invalid={Boolean(errors.line1)} {...register('line1')} />
            </AdminField>
            <AdminField label="Apartment, suite (optional)" htmlFor="a-line2" error={errors.line2?.message} className="sm:col-span-2">
              <input id="a-line2" className={adminInputClass} {...register('line2')} />
            </AdminField>
            <AdminField label="City" htmlFor="a-city" error={errors.city?.message} required>
              <input id="a-city" className={adminInputClass} aria-invalid={Boolean(errors.city)} {...register('city')} />
            </AdminField>
            <AdminField label="Region / State (optional)" htmlFor="a-region" error={errors.region?.message}>
              <input id="a-region" className={adminInputClass} {...register('region')} />
            </AdminField>
            <AdminField label="Postal code" htmlFor="a-postalCode" error={errors.postalCode?.message} required>
              <input id="a-postalCode" className={adminInputClass} aria-invalid={Boolean(errors.postalCode)} {...register('postalCode')} />
            </AdminField>
            <AdminField label="Country" htmlFor="a-country" error={errors.country?.message} required>
              <input id="a-country" className={adminInputClass} aria-invalid={Boolean(errors.country)} {...register('country')} />
            </AdminField>
            <AdminField label="Telephone (optional)" htmlFor="a-phone" error={errors.phone?.message} className="sm:col-span-2">
              <input id="a-phone" className={adminInputClass} {...register('phone')} />
            </AdminField>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-foreground px-8 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : 'Save address'}
            </button>
            {addresses.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  reset();
                  setAdding(false);
                }}
                className="text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-8 border border-foreground px-8 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          Add an address
        </button>
      )}
    </div>
  );
}
