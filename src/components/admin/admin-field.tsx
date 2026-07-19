import { cn } from '@/lib/utils';

type AdminFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

/** Field wrapper for admin (light) surfaces — label, control, error, hint. */
export function AdminField({
  label,
  htmlFor,
  error,
  required,
  hint,
  className,
  children,
}: AdminFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="label-micro">
        {label}
        {required ? <span aria-hidden className="text-foreground/40"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
      <p
        id={`${htmlFor}-error`}
        role="alert"
        className={cn(
          'text-caption text-destructive transition-opacity duration-300',
          error ? 'opacity-100' : 'h-0 opacity-0',
        )}
      >
        {error ?? ''}
      </p>
    </div>
  );
}

/** Shared input styling for admin (light) forms. */
export const adminInputClass =
  'w-full border-b border-border bg-transparent py-2.5 text-body text-foreground transition-colors duration-300 placeholder:text-muted-foreground/60 hover:border-foreground/40 focus:border-foreground focus:outline-none aria-[invalid=true]:border-destructive';
