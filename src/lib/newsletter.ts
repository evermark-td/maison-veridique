import { siteConfig } from '@/lib/seo';

/**
 * One-click unsubscribe link for a subscriber. The subscriber `id` is an opaque
 * cuid — not personal data and not enumerable — so it is safe to carry in the
 * URL (unlike the email address). Campaign and transactional emails that go to
 * subscribers should include this link; `/api/newsletter/unsubscribe` consumes it.
 */
export function unsubscribeUrl(subscriberId: string): string {
  return `${siteConfig.url}/api/newsletter/unsubscribe?id=${encodeURIComponent(subscriberId)}`;
}
