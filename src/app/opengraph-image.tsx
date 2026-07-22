import { ImageResponse } from 'next/og';

import { siteConfig } from '@/lib/seo';

// Served at `/opengraph-image` — the URL every page's metadata resolves to
// via buildMetadata() in @/lib/seo. Regenerated only when this file changes.
export const runtime = 'nodejs';
export const contentType = 'image/png';
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };

// Cormorant Garamond weight 300 — matches the display font used on the site.
// Fetched at build time; ImageResponse cannot resolve `next/font` files.
async function loadDisplayFont() {
  const res = await fetch(
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&display=swap',
    { headers: { 'user-agent': 'Mozilla/5.0' } },
  );
  const css = await res.text();
  const url = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)?.[1];
  if (!url) throw new Error('Could not resolve Cormorant Garamond font URL');
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OpengraphImage() {
  const display = await loadDisplayFont();

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 88px',
        background: '#FAF9F7',
        color: '#0A0A0A',
      }}
    >
      <div
        style={{
          fontSize: 18,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#767068',
        }}
      >
        {siteConfig.shortName}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div
          style={{
            fontFamily: 'Cormorant',
            fontWeight: 300,
            fontSize: 168,
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ height: 1, width: 240, background: '#0A0A0A' }} />
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            color: '#0A0A0A',
            maxWidth: 780,
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: '#767068',
        }}
      >
        <span>Paris</span>
        <span>Ready-to-wear · Bespoke</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: 'Cormorant', data: display, style: 'normal', weight: 300 }],
    },
  );
}
