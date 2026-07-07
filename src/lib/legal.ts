import type { Locale } from '../config';

export interface LegalSection {
  h: string;
  body: string[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export const legalNotice: Record<Locale, LegalDoc> = {
  fr: {
    title: 'Mentions légales',
    updated: 'Dernière mise à jour : 7 juillet 2026',
    sections: [
      {
        h: 'Éditeur du site',
        body: [
          'Ce site est édité par Guillaume Ojardias, développeur indépendant.',
          'Statut : auto-entrepreneur. SIREN : 993 870 955. Contact : contact@ojardias.me.',
        ],
      },
      { h: 'Directeur de la publication', body: ['Guillaume Ojardias.'] },
      {
        h: 'Hébergement',
        body: [
          'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com.',
          'Pour toute question relative à la protection des données côté hébergeur : privacy@vercel.com.',
        ],
      },
      {
        h: 'Propriété intellectuelle',
        body: [
          'Sauf mention contraire, le contenu éditorial de ce site (textes, images) est la propriété de Guillaume Ojardias.',
          'Le code source de ce site est open source et disponible sur GitHub.',
        ],
      },
    ],
  },
  en: {
    title: 'Legal notice',
    updated: 'Last updated: July 7, 2026',
    sections: [
      {
        h: 'Site publisher',
        body: [
          'This site is published by Guillaume Ojardias, independent developer.',
          'Status: auto-entrepreneur (French sole trader). Business ID (SIREN): 993 870 955. Contact: contact@ojardias.me.',
        ],
      },
      { h: 'Publication director', body: ['Guillaume Ojardias.'] },
      {
        h: 'Hosting',
        body: [
          'The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA — vercel.com.',
          'For any data-protection question on the hosting side: privacy@vercel.com.',
        ],
      },
      {
        h: 'Intellectual property',
        body: [
          'Unless stated otherwise, the editorial content of this site (text, images) is the property of Guillaume Ojardias.',
          'The source code of this site is open source and available on GitHub.',
        ],
      },
    ],
  },
};

export const privacyPolicy: Record<Locale, LegalDoc> = {
  fr: {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : 7 juillet 2026',
    sections: [
      {
        h: 'Introduction',
        body: [
          'Cette politique explique quelles données personnelles sont collectées sur ce site et comment elles sont utilisées.',
        ],
      },
      {
        h: 'Données collectées',
        body: [
          'Le formulaire de contact recueille votre nom, votre adresse e-mail, le type de projet et votre message. Ces informations servent uniquement à répondre à votre demande.',
        ],
      },
      {
        h: 'Finalité et base légale',
        body: [
          'Vos données sont traitées dans le seul but de répondre à votre demande, sur la base de votre consentement.',
        ],
      },
      {
        h: 'Durée de conservation',
        body: [
          'Vos messages sont conservés le temps nécessaire au traitement de votre demande, puis supprimés.',
        ],
      },
      {
        h: 'Cookies et mesure d’audience',
        body: [
          'Ce site n’utilise pas de cookies de suivi ni d’outil de mesure d’audience.',
        ],
      },
      {
        h: 'Vos droits',
        body: [
          'Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données. Pour l’exercer, contactez : gdpr@ojardias.me.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    updated: 'Last updated: July 7, 2026',
    sections: [
      {
        h: 'Introduction',
        body: [
          'This policy explains what personal data is collected on this site and how it is used.',
        ],
      },
      {
        h: 'Data collected',
        body: [
          'The contact form collects your name, email address, project type and message. This information is used solely to respond to your request.',
        ],
      },
      {
        h: 'Purpose and legal basis',
        body: [
          'Your data is processed for the sole purpose of responding to your request, on the basis of your consent.',
        ],
      },
      {
        h: 'Retention period',
        body: [
          'Your messages are kept for as long as needed to handle your request, then deleted.',
        ],
      },
      {
        h: 'Cookies and analytics',
        body: [
          'This site does not use tracking cookies or any analytics tool.',
        ],
      },
      {
        h: 'Your rights',
        body: [
          'Under the GDPR, you have the right to access, rectify and erase your data. To exercise it, contact: gdpr@ojardias.me.',
        ],
      },
    ],
  },
};
