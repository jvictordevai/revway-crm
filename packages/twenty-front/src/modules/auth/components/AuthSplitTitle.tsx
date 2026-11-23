import { AnimatedEaseIn } from '@/auth/components/internal/AnimatedEaseIn/AnimatedEaseIn';
import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { Heading } from 'twenty-ui/primitives/typography';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledTitleContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[6]};
`;

type AuthSplitTitleProps = {
  children: ReactNode;
};

export const AuthSplitTitle = ({ children }: AuthSplitTitleProps) => (
  <StyledTitleContainer>
    <AnimatedEaseIn>
      <Heading level={1} size="xxl">
        {children}
      </Heading>
    </AnimatedEaseIn>
  </StyledTitleContainer>
);
