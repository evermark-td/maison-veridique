import { Footer } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/site-header';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1 pt-[7.25rem] lg:pt-[8.25rem]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
