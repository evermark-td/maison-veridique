import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { TextReveal } from '@/components/motion/text-reveal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Size Guide',
  description: 'How Maison Véridique garments are sized — and why a fitting beats a chart.',
  path: '/size-guide',
});

const SIZES = [
  { size: 'XS', chest: '84–88', waist: '68–72', hip: '88–92' },
  { size: 'S', chest: '88–94', waist: '72–78', hip: '92–98' },
  { size: 'M', chest: '94–100', waist: '78–84', hip: '98–104' },
  { size: 'L', chest: '100–108', waist: '84–92', hip: '104–112' },
  { size: 'XL', chest: '108–116', waist: '92–100', hip: '112–120' },
];

export default function SizeGuidePage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="label-micro">Client Care</p>
        <TextReveal
          as="h1"
          immediate
          delay={0.1}
          lines={['Measured in', 'centimetres, not guesses.']}
          className="display mt-5 text-d2"
        />
        <FadeIn immediate delay={0.25}>
          <p className="mt-6 text-lead text-muted-foreground">
            Ready-to-wear follows the measurements below, taken over light clothing. Between
            sizes, the house cuts generously — take the smaller.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-t border-border text-left">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="label-micro py-4 pr-6 font-medium">Size</th>
                  <th scope="col" className="label-micro py-4 pr-6 font-medium">Chest (cm)</th>
                  <th scope="col" className="label-micro py-4 pr-6 font-medium">Waist (cm)</th>
                  <th scope="col" className="label-micro py-4 font-medium">Hip (cm)</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((row) => (
                  <tr key={row.size} className="border-b border-border">
                    <th scope="row" className="display py-4 pr-6 text-d4 font-light">{row.size}</th>
                    <td className="py-4 pr-6 text-body text-foreground/80">{row.chest}</td>
                    <td className="py-4 pr-6 text-body text-foreground/80">{row.waist}</td>
                    <td className="py-4 text-body text-foreground/80">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="mt-10 text-body text-muted-foreground">
            Charts end where tailoring begins. For anything between sizes — or a garment cut to
            you alone —{' '}
            <Link href="/appointments" className="border-b border-foreground/60 text-foreground transition-colors duration-300 hover:border-foreground">
              book a fitting
            </Link>
            .
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
