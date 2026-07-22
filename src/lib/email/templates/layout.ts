import { siteConfig } from '@/lib/seo';

// House palette, mirrored from the design tokens in globals.css. Email clients
// require inline styles and hex values — CSS variables and utility classes do
// not survive, so the brand is expressed literally here.
const INK = '#0a0a0a';
const PAPER = '#faf9f7';
const MUTED = '#6b655d';
const BORDER = '#efebe5';

export type EmailSection =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'button'; label: string; href: string }
  | { type: 'fallbackLink'; label: string; href: string };

/** Escapes text interpolated into email HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSection(section: EmailSection): string {
  switch (section.type) {
    case 'heading':
      return `<h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-weight:300;font-size:30px;line-height:1.15;letter-spacing:-0.02em;color:${INK};">${escapeHtml(
        section.text,
      )}</h1>`;
    case 'paragraph':
      return `<p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;color:${INK};">${escapeHtml(
        section.text,
      )}</p>`;
    case 'button':
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 28px;"><tr><td style="background:${INK};"><a href="${escapeHtml(
        section.href,
      )}" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${PAPER};text-decoration:none;">${escapeHtml(
        section.label,
      )}</a></td></tr></table>`;
    case 'fallbackLink':
      return `<p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};">${escapeHtml(
        section.label,
      )}<br /><a href="${escapeHtml(section.href)}" style="color:${MUTED};word-break:break-all;">${escapeHtml(
        section.href,
      )}</a></p>`;
  }
}

/**
 * Wraps section content in the house email shell — a paper card, a wordmark
 * masthead and a quiet footer. Returns a complete HTML document.
 */
export function renderEmail({
  preheader,
  sections,
}: {
  preheader: string;
  sections: EmailSection[];
}): string {
  const body = sections.map(renderSection).join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <title>${escapeHtml(siteConfig.name)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BORDER};">
    <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(
      preheader,
    )}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BORDER};">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${PAPER};">
            <tr>
              <td style="padding:40px 44px 0;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.28em;text-transform:uppercase;color:${MUTED};">${escapeHtml(
                  siteConfig.shortName,
                )}</p>
                <hr style="margin:20px 0 32px;border:none;border-top:1px solid ${BORDER};" />
              </td>
            </tr>
            <tr>
              <td style="padding:0 44px 8px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 44px 40px;">
                <hr style="margin:0 0 20px;border:none;border-top:1px solid ${BORDER};" />
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};">${escapeHtml(
                  siteConfig.name,
                )} · Paris · Milano · Tokyo</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
