import { AUTH_COVER_IMAGE_PATH } from '@/auth/constants/AuthCoverImagePath';
import { AUTH_FORM_COLUMN_MAX_WIDTH } from '@/auth/constants/AuthFormColumnMaxWidth';
import { AUTH_SPLIT_LAYOUT_BREAKPOINT } from '@/auth/constants/AuthSplitLayoutBreakpoint';
import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledContainer = styled.div`
  background: ${themeCssVariables.background.primary};
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  height: calc(100dvh / var(--t-zoom, 1));
  width: 100%;

  @media (min-width: ${AUTH_SPLIT_LAYOUT_BREAKPOINT}px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
`;

const StyledFormColumn = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[10]} ${themeCssVariables.spacing[4]};
`;

// Auto margins center the block yet keep it scrollable when taller than the viewport.
const StyledFormBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: ${AUTH_FORM_COLUMN_MAX_WIDTH}px;
  width: 100%;
`;

const StyledCover = styled.div`
  background: ${themeCssVariables.background.tertiary};
  display: none;
  min-height: 0;
  overflow: hidden;

  @media (min-width: ${AUTH_SPLIT_LAYOUT_BREAKPOINT}px) {
    display: block;
  }
`;

const StyledCoverImage = styled.img`
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
`;

type AuthSplitLayoutProps = {
  children: ReactNode;
};

export const AuthSplitLayout = ({ children }: AuthSplitLayoutProps) => (
  <StyledContainer>
    <StyledFormColumn>
      <StyledFormBlock>{children}</StyledFormBlock>
    </StyledFormColumn>
    <StyledCover aria-hidden="true">
      {/* lazy so small screens, where the cover is hidden, never fetch it */}
      <StyledCoverImage src={AUTH_COVER_IMAGE_PATH} alt="" loading="lazy" />
    </StyledCover>
  </StyledContainer>
);
