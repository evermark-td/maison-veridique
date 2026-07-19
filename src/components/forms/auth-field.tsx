import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

/**
 * Labelled underline input for the auth surfaces (paper-on-noir). Forwards the
 * ref so it works directly with react-hook-form's `register`.
 */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, error, id, className, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-micro text-paper/50">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'w-full border-b border-paper/25 bg-transparent py-3 text-body text-paper transition-colors duration-300 [transition-timing-function:var(--ease-luxe)] placeholder:text-paper/35 hover:border-paper/50 focus:border-paper focus:outline-none aria-[invalid=true]:border-[#d99a9a]',
          className,
        )}
        {...props}
      />
      <p
        id={`${id}-error`}
        role="alert"
        className={cn(
          'text-caption text-[#d99a9a] transition-opacity duration-300',
          error ? 'opacity-100' : 'h-0 opacity-0',
        )}
      >
        {error ?? ''}
      </p>
    </div>
  );
});
