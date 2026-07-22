'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Fires when the root layout itself throws. Must render its own <html> and
// <body> because it replaces the layout entirely — and it must not rely on the
// global CSS import chain (which may not have loaded), so styles are inline.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#faf9f7',
          color: '#0a0a0a',
          fontFamily: 'Georgia, "Times New Roman", serif',
          padding: '2rem',
        }}
      >
        <main style={{ maxWidth: '42rem', margin: '0 auto', width: '100%' }}>
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#6b655d',
              margin: 0,
            }}
          >
            Maison Véridique · Error
          </p>
          <h1
            style={{
              fontWeight: 300,
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.02em',
              margin: '1.5rem 0 0',
            }}
          >
            The house is
            <br />
            momentarily unavailable.
          </h1>
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 18,
              lineHeight: 1.6,
              color: '#6b655d',
              margin: '2rem 0 0',
              maxWidth: '32rem',
            }}
          >
            An unexpected error has interrupted your visit. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2.5rem',
              height: '2.75rem',
              padding: '0 1.75rem',
              background: '#0a0a0a',
              color: '#faf9f7',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#6b655d',
                margin: '3rem 0 0',
              }}
            >
              Reference · {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
