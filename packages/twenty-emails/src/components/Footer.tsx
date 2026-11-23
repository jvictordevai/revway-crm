import { type I18n } from '@lingui/core';
import { Column, Container, Row } from 'react-email';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

type FooterProps = {
  i18n: I18n;
};

// RevWay: RevWay footer (site, support, AGPL source code link).
export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href="https://revway.com.br/"
              value={i18n._('Website')}
              aria-label={i18n._('Visit the RevWay website')}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="mailto:suporte@revway.com.br"
              value={i18n._('Support')}
              aria-label={i18n._('Email RevWay support')}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://github.com/jvictordevai/revway-crm"
              value={i18n._('Source code')}
              aria-label={i18n._('View the RevWay CRM source code')}
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          RevWay
          <br />
          revway.com.br · suporte@revway.com.br
        </>
      </ShadowText>
    </Container>
  );
};
