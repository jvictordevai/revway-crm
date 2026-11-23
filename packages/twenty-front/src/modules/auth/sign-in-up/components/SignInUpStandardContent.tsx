import { AuthSplitTitle } from '@/auth/components/AuthSplitTitle';
import { Logo } from '@/auth/components/Logo';
import { AnimatedEaseIn } from '@/auth/components/internal/AnimatedEaseIn/AnimatedEaseIn';
import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { WorkspaceSelectionFooter } from '@/auth/sign-in-up/components/WorkspaceSelectionFooter';
import { SignInUpStep } from '@/auth/states/signInUpStepState';
import { styled } from '@linaria/react';
import { type JSX } from 'react';
import { AppPath } from 'twenty-shared/types';
import { themeCssVariables } from 'twenty-ui/theme';
import { type PublicWorkspaceData } from '~/generated-metadata/graphql';

const StyledFormContainer = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  margin-bottom: ${themeCssVariables.spacing[6]};
  margin-top: ${themeCssVariables.spacing[2]};
  min-width: 0;
  width: 100%;
`;

type SignInUpStandardContentProps = {
  workspacePublicData: PublicWorkspaceData | null;
  signInUpForm: JSX.Element | null;
  signInUpStep: SignInUpStep;
  title: string;
  onClickOnLogo: () => void;
};

export const SignInUpStandardContent = ({
  workspacePublicData,
  signInUpForm,
  signInUpStep,
  title,
  onClickOnLogo,
}: SignInUpStandardContentProps) => {
  return (
    <>
      <AnimatedEaseIn>
        <Logo
          secondaryLogo={workspacePublicData?.logo}
          placeholder={workspacePublicData?.displayName}
          onClick={onClickOnLogo}
          to={AppPath.SignInUp}
        />
      </AnimatedEaseIn>
      <AuthSplitTitle>{title}</AuthSplitTitle>
      <StyledFormContainer>{signInUpForm}</StyledFormContainer>
      {signInUpStep === SignInUpStep.WorkspaceSelection && (
        <WorkspaceSelectionFooter />
      )}
      {![
        SignInUpStep.Password,
        SignInUpStep.TwoFactorAuthenticationProvision,
        SignInUpStep.TwoFactorAuthenticationVerification,
        SignInUpStep.TwoFactorAuthenticationRecovery,
        SignInUpStep.WorkspaceSelection,
        SignInUpStep.WorkspaceCreation,
      ].includes(signInUpStep) && <FooterNote />}
    </>
  );
};
