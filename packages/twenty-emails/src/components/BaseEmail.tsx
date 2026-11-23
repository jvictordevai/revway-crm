import { type JSX } from 'react';
import { I18nProvider } from '@lingui/react';
import { Body, Container, Html, Section } from 'react-email';

import { canvasTheme } from 'src/common-style';
import { BaseHead } from 'src/components/BaseHead';
import { Footer } from 'src/components/Footer';
import { Logo } from 'src/components/Logo';
import { createI18nInstance } from 'src/utils/i18n.utils';
import { type APP_LOCALES } from 'twenty-shared/translations';

type BaseEmailProps = {
  children: JSX.Element | JSX.Element[] | string;
  // Kept for upstream compatibility; the RevWay layout uses a fixed card width.
  width?: number;
  locale: keyof typeof APP_LOCALES;
};

const SHEET_MAX_WIDTH = 560;

// RevWay: card layout matching the RevWay platform e-mails.
const bodyStyle = {
  margin: 0,
  padding: '40px 8px',
  background: canvasTheme.background.colors.canvas,
  fontFamily: canvasTheme.font.family,
  color: canvasTheme.font.colors.highlighted,
};

const sheetStyle = {
  maxWidth: `${SHEET_MAX_WIDTH}px`,
  width: '100%',
  background: canvasTheme.background.colors.sheet,
  border: `1px solid ${canvasTheme.border.color.highlighted}`,
  borderRadius: canvasTheme.border.radius.lg,
};

const headerStyle = {
  padding: '24px 40px',
  borderBottom: `1px solid ${canvasTheme.border.color.highlighted}`,
};

const contentStyle = {
  padding: '32px 40px 36px',
};

export const BaseEmail = ({ children, locale }: BaseEmailProps) => {
  const i18nInstance = createI18nInstance(locale);

  return (
    <I18nProvider i18n={i18nInstance}>
      <Html lang={locale}>
        <BaseHead i18n={i18nInstance} />
        <Body style={bodyStyle}>
          <Container style={sheetStyle}>
            <Section style={headerStyle}>
              <Logo i18n={i18nInstance} />
            </Section>
            <Section style={contentStyle}>{children}</Section>
          </Container>
          <Footer i18n={i18nInstance} />
        </Body>
      </Html>
    </I18nProvider>
  );
};
