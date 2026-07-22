import { ImageResponse } from 'next/og';

// 180×180 Apple touch icon — matches the favicon composition at the larger
// canvas iOS pins to the home screen.
export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 180, height: 180 };

export default function AppleIcon() {
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
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 148,
        lineHeight: 1,
        fontWeight: 400,
        letterSpacing: '-0.04em',
        paddingBottom: 10,
      }}
    >
      V
    </div>,
    size,
  );
}
