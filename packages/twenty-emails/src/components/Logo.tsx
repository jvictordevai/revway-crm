import { type I18n } from '@lingui/core';
import { Img } from 'react-email';

const logoStyle = {
  display: 'block',
  border: 0,
};

type LogoProps = {
  i18n: I18n;
};

// RevWay: lockup served by the RevWay CRM front (public/images/revway).
export const Logo = ({ i18n }: LogoProps) => {
  return (
    <Img
      src="https://crm.revway.com.br/images/revway/email-logo.png"
      alt={i18n._('RevWay CRM logo')}
      width="130"
      height="28"
      style={logoStyle}
    />
  );
};
