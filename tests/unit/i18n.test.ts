import { describe, expect, it } from 'vitest';
import { localizedPath, otherLocale, t } from '../../src/i18n/ui';

describe('t', () => {
  it('returns the translation in the requested locale', () => {
    expect(t('fr', 'nav.projects')).toBe('Projets');
    expect(t('en', 'nav.projects')).toBe('Projects');
  });

  it('returns the same key for both locales', () => {
    expect(t('fr', 'blog.title')).toBeTruthy();
    expect(t('en', 'blog.title')).toBeTruthy();
  });
});

describe('otherLocale', () => {
  it('flips fr to en and vice versa', () => {
    expect(otherLocale('fr')).toBe('en');
    expect(otherLocale('en')).toBe('fr');
  });
});

describe('localizedPath', () => {
  it('keeps fr paths unchanged (default locale)', () => {
    expect(localizedPath('fr', '/blog')).toBe('/blog');
    expect(localizedPath('fr', '/')).toBe('/');
  });

  it('prefixes en paths with /en', () => {
    expect(localizedPath('en', '/blog')).toBe('/en/blog');
    expect(localizedPath('en', '/')).toBe('/en');
  });

  it('normalizes paths missing a leading slash', () => {
    expect(localizedPath('fr', 'blog')).toBe('/blog');
    expect(localizedPath('en', 'blog')).toBe('/en/blog');
  });
});
