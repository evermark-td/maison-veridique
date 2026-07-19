import type { EnquiryType } from '@/lib/validations/enquiry';

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
};

export type ContactBoutique = {
  city: string;
  address: string;
  phone: string;
};

export type ContactContent = {
  eyebrow: string;
  headingLines: string[];
  intro: string;
  enquiryTypes: { value: EnquiryType; label: string }[];
  channels: ContactChannel[];
  boutiques: ContactBoutique[];
  hours: string;
};

/**
 * Contact content and house directory. Sourced from SiteSetting / Boutique in
 * Phase 4; typed defaults keep the section data-driven from the start.
 */
export const contactContent: ContactContent = {
  eyebrow: 'Contact',
  headingLines: ['Begin a', 'conversation.'],
  intro:
    'Whether you are planning a first appointment or continuing a relationship of years, a client advisor will reply within one business day.',
  enquiryTypes: [
    { value: 'APPOINTMENT', label: 'Private appointment' },
    { value: 'BESPOKE', label: 'Bespoke commission' },
    { value: 'PRESS', label: 'Press & media' },
    { value: 'GENERAL', label: 'General enquiry' },
  ],
  channels: [
    { label: 'Client Services', value: 'clients@maisonveridique.com', href: 'mailto:clients@maisonveridique.com' },
    { label: 'Press', value: 'press@maisonveridique.com', href: 'mailto:press@maisonveridique.com' },
    { label: 'Telephone', value: '+33 1 42 60 00 00', href: 'tel:+33142600000' },
  ],
  boutiques: [
    { city: 'Paris', address: '212 Rue Saint-Honoré', phone: '+33 1 42 60 00 00' },
    { city: 'Milan', address: 'Via Monte Napoleone 8', phone: '+39 02 7600 0000' },
    { city: 'Tokyo', address: '5-2-1 Minami-Aoyama, Minato-ku', phone: '+81 3 6427 0000' },
  ],
  hours: 'Monday to Saturday, 10.00 – 19.00 local time',
};
