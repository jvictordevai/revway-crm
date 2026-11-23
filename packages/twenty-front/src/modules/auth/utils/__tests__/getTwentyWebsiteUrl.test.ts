import { getTwentyWebsiteUrl } from '@/auth/utils/getTwentyWebsiteUrl';

describe('getTwentyWebsiteUrl', () => {
  it.each(['en', 'pt-BR', 'fr-FR', 'pseudo-en'])(
    'returns the RevWay terms page for %s',
    (locale) => {
      expect(getTwentyWebsiteUrl(locale, 'terms')).toBe(
        'https://revway.com.br/termos',
      );
    },
  );

  it.each(['en', 'pt-BR', 'fr-FR', 'pseudo-en'])(
    'returns the RevWay privacy page for %s',
    (locale) => {
      expect(getTwentyWebsiteUrl(locale, 'privacy-policy')).toBe(
        'https://revway.com.br/privacidade',
      );
    },
  );
});
