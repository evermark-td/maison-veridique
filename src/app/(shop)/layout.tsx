import { Footer } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteMain } from '@/components/layout/site-main';
import { getCartCount } from '@/lib/cart';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const cartCount = await getCartCount();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader cartCount={cartCount} />
      <SiteMain>{children}</SiteMain>
      <Footer />
    </div>
  );
}
