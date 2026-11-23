import { type I18n } from '@lingui/core';
import { Column, Container, Img, Row, Text } from 'react-email';

import { canvasTheme } from 'src/common-style';
import { Link } from 'src/components/Link';

type FooterProps = {
  i18n: I18n;
};

const SYMBOL_URL = 'https://crm.revway.com.br/images/revway/email-symbol.png';

const footerContainerStyle = {
  maxWidth: '560px',
  width: '100%',
  marginTop: '20px',
};

const footerTextStyle = {
  margin: 0,
  fontFamily: canvasTheme.font.family,
  fontSize: canvasTheme.font.size.sm,
  lineHeight: '20px',
  color: canvasTheme.font.colors.tertiary,
};

const separator = ' · ';

// RevWay: footer outside the card, mirroring the RevWay platform e-mails
// (symbol, product line, support and AGPL source code link).
export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column align="center">
          <table role="presentation" cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td style={{ paddingRight: '8px' }}>
                  <Img
                    src={SYMBOL_URL}
                    width="16"
                    height="16"
                    alt="RevWay"
                    style={{ display: 'block', border: 0 }}
                  />
                </td>
                <td>
                  <Text style={footerTextStyle}>
                    RevWay CRM{separator}crm.revway.com.br
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>
          <Text style={{ ...footerTextStyle, marginTop: '6px' }}>
            <Link
              href="https://revway.com.br/"
              value={i18n._('Website')}
              aria-label={i18n._('Visit the RevWay website')}
            />
            {separator}
            <Link
              href="mailto:suporte@revway.com.br"
              value={i18n._('Support')}
              aria-label={i18n._('Email RevWay support')}
            />
            {separator}
            <Link
              href="https://github.com/jvictordevai/revway-crm"
              value={i18n._('Source code')}
              aria-label={i18n._('View the RevWay CRM source code')}
            />
          </Text>
        </Column>
      </Row>
    </Container>
  );
};
