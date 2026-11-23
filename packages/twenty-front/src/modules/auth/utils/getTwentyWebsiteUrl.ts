// RevWay: legal pages live on the RevWay website and are not localized per path.
const REVWAY_WEBSITE_PAGES = {
  terms: 'https://revway.com.br/termos',
  'privacy-policy': 'https://revway.com.br/privacidade',
} as const;

type TwentyWebsitePage = keyof typeof REVWAY_WEBSITE_PAGES;

export const getTwentyWebsiteUrl = (
  _locale: string,
  page: TwentyWebsitePage,
): string => REVWAY_WEBSITE_PAGES[page];
