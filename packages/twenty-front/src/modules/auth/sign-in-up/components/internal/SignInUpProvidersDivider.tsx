import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledDivider = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[3]};
  margin-block: ${themeCssVariables.spacing[5]};
  width: 100%;

  &::before,
  &::after {
    border-top: 1px solid ${themeCssVariables.border.color.medium};
    content: '';
    flex: 1;
  }
`;

export const SignInUpProvidersDivider = () => {
  const { t } = useLingui();

  return <StyledDivider>{t`or continue with`}</StyledDivider>;
};
