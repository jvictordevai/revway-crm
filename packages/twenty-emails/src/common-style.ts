/* oxlint-disable twenty/no-hardcoded-colors */

const grayScale = {
  gray100: '#000000',
  gray90: '#141414',
  gray85: '#171717',
  gray80: '#1b1b1b',
  gray75: '#1d1d1d',
  gray70: '#222222',
  gray65: '#292929',
  gray60: '#333333',
  gray55: '#4c4c4c',
  gray50: '#666666',
  gray45: '#818181',
  gray40: '#999999',
  gray35: '#b3b3b3',
  gray30: '#cccccc',
  gray25: '#d6d6d6',
  gray20: '#ebebeb',
  gray15: '#f1f1f1',
  gray10: '#fcfcfc',
  gray0: '#ffffff',
};

const colors = {
  blue40: '#154BD4',
};

// RevWay: e-mail palette aligned with the RevWay platform templates
// (tinta #0B1B33, tinta-media #465775, tinta-leve #586783, linha #E1E7F1, apoio #F3F6FB).
const revway = {
  ink: '#0B1B33',
  inkMedium: '#465775',
  inkLight: '#586783',
  line: '#E1E7F1',
  canvas: '#F3F6FB',
  sheet: '#FFFFFF',
  highlight: '#E9EEF7',
  brand: colors.blue40,
};

export const canvasTheme = {
  font: {
    colors: {
      highlighted: revway.ink,
      primary: revway.inkMedium,
      tertiary: revway.inkLight,
      inverted: grayScale.gray0,
      blue: revway.brand,
    },
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    weight: {
      regular: 400,
      bold: 600,
    },
    size: {
      sm: '12px',
      md: '15px',
      lg: '17px',
      xl: '26px',
    },
    lineHeight: '24px',
  },
  border: {
    radius: { sm: '6px', md: '8px', lg: '12px' },
    color: { highlighted: revway.line },
  },
  background: {
    colors: {
      highlight: revway.highlight,
      canvas: revway.canvas,
      sheet: revway.sheet,
    },
    button: revway.brand,
    transparent: {
      medium: 'rgba(11, 27, 51, 0.08)',
      light: 'rgba(11, 27, 51, 0.04)',
    },
  },
};
