import { siteConfig } from '@/lib/seo';

import { renderEmail } from './layout';

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

/**
 * Welcome email sent when a new customer account is created. Purely a courtesy
 * — the account is usable immediately, so nothing here gates access.
 */
export function welcomeEmail(name: string): { subject: string; html: string; text: string } {
  const greeting = firstName(name);
  const subject = `Welcome to ${siteConfig.name}`;

  const html = renderEmail({
    preheader: 'Your account is ready — your orders, wishlist and addresses in one place.',
    sections: [
      { type: 'eyebrow', text: 'Welcome' },
      { type: 'heading', text: 'Welcome to the house.' },
      {
        type: 'paragraph',
        text: `Thank you for creating an account, ${greeting}. It keeps your orders, wishlist and saved addresses in one place — and gives our advisors context whenever you visit.`,
      },
      { type: 'button', label: 'Explore the collections', href: `${siteConfig.url}/collections` },
      {
        type: 'paragraph',
        text: 'When you are ready for something considered, a private appointment with an advisor is always available.',
      },
    ],
  });

  const text = [
    'Welcome to the house.',
    '',
    `Thank you for creating an account, ${greeting}. It keeps your orders, wishlist and saved addresses in one place — and gives our advisors context whenever you visit.`,
    '',
    `Explore the collections: ${siteConfig.url}/collections`,
    '',
    'When you are ready for something considered, a private appointment with an advisor is always available.',
    '',
    `${siteConfig.name} · Paris · Milano · Tokyo`,
  ].join('\n');

  return { subject, html, text };
}
