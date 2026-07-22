import { siteConfig } from '@/lib/seo';

// House palette, mirrored from the design tokens in globals.css. Email clients
// require inline styles and hex values — CSS variables and utility classes do
// not survive, so the brand is expressed literally here.
const INK = '#0a0a0a';
const PAPER = '#faf9f7';
const MUTED = '#6b655d';
const BORDER = '#efebe5';

export type EmailLineItem = { name: string; meta: string; amount: string };
export type EmailTotalRow = { label: string; value: string; strong?: boolean };

export type EmailSection =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'button'; label: string; href: string }
  | { type: 'fallbackLink'; label: string; href: string }
  | { type: 'eyebrow'; text: string }
  | { type: 'divider' }
  | { type: 'lineItems'; items: EmailLineItem[] }
  | { type: 'totals'; rows: EmailTotalRow[] }
  | { type: 'addressBlock'; label: string; lines: string[] }
  | { type: 'details'; rows: { label: string; value: string }[] }
  | { type: 'messageBlock'; text: string };

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
    case 'eyebrow':
      return `<p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};">${escapeHtml(
        section.text,
      )}</p>`;
    case 'divider':
      return `<hr style="margin:24px 0;border:none;border-top:1px solid ${BORDER};" />`;
    case 'lineItems': {
      const rows = section.items
        .map(
          (item) =>
            `<tr><td style="padding:14px 0;border-bottom:1px solid ${BORDER};vertical-align:top;"><span style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${INK};">${escapeHtml(
              item.name,
            )}</span><br /><span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.08em;color:${MUTED};">${escapeHtml(
              item.meta,
            )}</span></td><td style="padding:14px 0;border-bottom:1px solid ${BORDER};vertical-align:top;text-align:right;white-space:nowrap;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${INK};">${escapeHtml(
              item.amount,
            )}</td></tr>`,
        )
        .join('');
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">${rows}</table>`;
    }
    case 'totals': {
      const rows = section.rows
        .map((row) => {
          const label = `<td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${
            row.strong ? INK : MUTED
          };">${escapeHtml(row.label)}</td>`;
          const value = `<td style="padding:6px 0;text-align:right;white-space:nowrap;font-family:Georgia,'Times New Roman',serif;font-size:${
            row.strong ? '20px' : '15px'
          };color:${INK};">${escapeHtml(row.value)}</td>`;
          const top = row.strong ? `border-top:1px solid ${BORDER};` : '';
          return `<tr style="${top}">${label}${value}</tr>`;
        })
        .join('');
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${rows}</table>`;
    }
    case 'addressBlock': {
      const lines = section.lines.filter(Boolean).map(escapeHtml).join('<br />');
      return `<p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};">${escapeHtml(
        section.label,
      )}</p><p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;color:${INK};">${lines}</p>`;
    }
    case 'details': {
      const rows = section.rows
        .map(
          (row) =>
            `<tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};vertical-align:top;width:132px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">${escapeHtml(
              row.label,
            )}</td><td style="padding:8px 0;border-bottom:1px solid ${BORDER};vertical-align:top;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${INK};">${escapeHtml(
              row.value,
            )}</td></tr>`,
        )
        .join('');
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">${rows}</table>`;
    }
    case 'messageBlock': {
      // Preserve the sender's own line breaks after escaping.
      const body = escapeHtml(section.text).replace(/\r?\n/g, '<br />');
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td style="padding:16px 20px;background:#f5f3ef;border-left:2px solid ${INK};font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.65;color:${INK};">${body}</td></tr></table>`;
    }
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
