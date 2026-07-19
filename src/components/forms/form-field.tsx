import { cn } from '@/lib/utils';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Presentational field wrapper — a micro label, the control (registered by the
 * parent via RHF), and an accessible error message. Reused across every form.
 */
export function FormField({ label, htmlFor, error, required, className, children }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="label-micro text-paper/50">
        {label}
        {required ? <span aria-hidden className="text-paper/30"> *</span> : null}
      </label>
      {children}
      <p
        id={`${htmlFor}-error`}
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
}

/** Shared underline-input styling for the house forms (noir surfaces). */
export const fieldInputClass =
  'w-full border-b border-paper/25 bg-transparent py-3 text-body text-paper transition-colors duration-300 [transition-timing-function:var(--ease-luxe)] placeholder:text-paper/35 hover:border-paper/50 focus:border-paper focus:outline-none aria-[invalid=true]:border-[#d99a9a]';
