import { ImageResponse } from 'next/og';

// 32×32 favicon — a paper square carrying an ink "V" letterform.
export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 32, height: 32 };

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF9F7',
        color: '#0A0A0A',
        // Georgia is the closest ubiquitous serif to Cormorant; the letter
        // scale is what reads at 32×32, not the family.
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 28,
        lineHeight: 1,
        fontWeight: 400,
        letterSpacing: '-0.04em',
        paddingBottom: 2,
      }}
    >
      V
    </div>,
    size,
  );
}
