import { siteConfig } from '@/lib/seo';

import { renderEmail } from './layout';

/**
 * Double opt-in confirmation email. `confirmUrl` carries the single-use token
 * that `/api/newsletter/confirm` verifies and then burns.
 */
export function newsletterConfirmationEmail(confirmUrl: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Confirm your subscription to ${siteConfig.name}`;

  const html = renderEmail({
    preheader: 'One click confirms your place on the house list.',
    sections: [
      { type: 'heading', text: 'Confirm your subscription.' },
      {
        type: 'paragraph',
        text: 'You asked to receive word from the house — twice-yearly collections, atelier notes and private appointments. Confirm the address below and you are on the list.',
      },
      { type: 'button', label: 'Confirm subscription', href: confirmUrl },
      {
        type: 'fallbackLink',
        label: 'If the button does not open, copy this link into your browser:',
        href: confirmUrl,
      },
      {
        type: 'paragraph',
        text: 'If you did not request this, no action is needed — the address will not be added.',
      },
    ],
  });

  const text = [
    'Confirm your subscription.',
    '',
    'You asked to receive word from the house — twice-yearly collections, atelier notes and private appointments. Confirm your address to join the list:',
    '',
    confirmUrl,
    '',
    'If you did not request this, no action is needed — the address will not be added.',
    '',
    `${siteConfig.name} · Paris · Milano · Tokyo`,
  ].join('\n');

  return { subject, html, text };
}
