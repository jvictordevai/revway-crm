import { StyledOnboardingContentContainer } from '@/auth/components/StyledOnboardingContentContainer';
import { SignInUpProvidersDivider } from '@/auth/sign-in-up/components/internal/SignInUpProvidersDivider';
import { SignInUpWithCredentials } from '@/auth/sign-in-up/components/internal/SignInUpWithCredentials';
import { SignInUpWithGoogle } from '@/auth/sign-in-up/components/internal/SignInUpWithGoogle';
import { SignInUpWithMicrosoft } from '@/auth/sign-in-up/components/internal/SignInUpWithMicrosoft';
import { SignInUpWithSso } from '@/auth/sign-in-up/components/internal/SignInUpWithSso';
import { useHandleResetPassword } from '@/auth/sign-in-up/hooks/useHandleResetPassword';
import { useSignInUp } from '@/auth/sign-in-up/hooks/useSignInUp';
import { useSignInUpForm } from '@/auth/sign-in-up/hooks/useSignInUpForm';
import { useWorkspaceBypass } from '@/auth/sign-in-up/hooks/useWorkspaceBypass';
import { SignInUpStep } from '@/auth/states/signInUpStepState';
import { workspaceAuthBypassProvidersState } from '@/workspace/states/workspaceAuthBypassProvidersState';
import { workspaceAuthProvidersState } from '@/workspace/states/workspaceAuthProvidersState';
import { Trans } from '@lingui/react/macro';
import { FormProvider } from 'react-hook-form';
import { styled } from '@linaria/react';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

const StyledForgotPasswordLinkContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${themeCssVariables.spacing[4]};
`;

export const SignInUpWorkspaceScopeForm = () => {
  const workspaceAuthProviders = useAtomStateValue(workspaceAuthProvidersState);
  const workspaceAuthBypassProviders = useAtomStateValue(
    workspaceAuthBypassProvidersState,
  );
  const { shouldOfferBypass, shouldUseBypass } = useWorkspaceBypass();

  const { form } = useSignInUpForm();

  const { handleResetPassword } = useHandleResetPassword();

  const { signInUpStep } = useSignInUp(form);

  if (!workspaceAuthProviders) {
    return null;
  }

  const providers =
    shouldOfferBypass && shouldUseBypass
      ? {
          ...workspaceAuthBypassProviders,
          sso: [],
        }
      : workspaceAuthProviders;

  return (
    <>
      <StyledOnboardingContentContainer>
        {providers.password && (
          // oxlint-disable-next-line react/jsx-props-no-spreading
          <FormProvider {...form}>
            <SignInUpWithCredentials />
          </FormProvider>
        )}
        {signInUpStep === SignInUpStep.Password && (
          <StyledForgotPasswordLinkContainer>
            <Button
              variant="link"
              onClick={handleResetPassword(form.getValues('email'))}
            >
              <Trans>Forgot your password?</Trans>
            </Button>
          </StyledForgotPasswordLinkContainer>
        )}

        {(providers.google ||
          providers.microsoft ||
          providers.sso.length > 0) &&
          providers.password && <SignInUpProvidersDivider />}

        {providers.google && <SignInUpWithGoogle action="join-workspace" />}

        {providers.microsoft && (
          <SignInUpWithMicrosoft action="join-workspace" />
        )}

        {providers.sso.length > 0 && <SignInUpWithSso />}
      </StyledOnboardingContentContainer>
    </>
  );
};
