import { Helmet } from '@dr.pogodin/react-helmet';

// RevWay: the tab icon is always the RevWay platform symbol, never the workspace logo.
const REVWAY_FAVICON_URL = '/images/revway/icon.svg';

export const PageFavicon = () => {
  return (
    <Helmet>
      <link rel="icon" type="image/svg+xml" href={REVWAY_FAVICON_URL} />
    </Helmet>
  );
};
