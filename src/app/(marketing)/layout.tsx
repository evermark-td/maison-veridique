import { Footer } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteMain } from '@/components/layout/site-main';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <SiteMain>{children}</SiteMain>
      <Footer />
    </div>
  );
}
