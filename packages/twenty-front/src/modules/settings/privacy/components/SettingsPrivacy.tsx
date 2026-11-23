import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { SettingsPrivacyAiDataProcessing } from '@/settings/privacy/components/SettingsPrivacyAiDataProcessing';
import { SettingsPrivacySharingWithTwenty } from '@/settings/privacy/components/SettingsPrivacySharingWithTwenty';
import { useIsAiDataPolicyConfigurable } from '@/settings/privacy/hooks/useIsAiDataPolicyConfigurable';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

// RevWay: SettingsPrivacySafeguards is not rendered, its claims (hosting,
// SOC 2, trust center) describe Twenty Cloud, not RevWay CRM.
export const SettingsPrivacy = () => {
  const isAiDataPolicyConfigurable = useIsAiDataPolicyConfigurable();
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );

  return (
    <>
      {isAiDataPolicyConfigurable && <SettingsPrivacyAiDataProcessing />}
      {isMultiWorkspaceEnabled && <SettingsPrivacySharingWithTwenty />}
    </>
  );
};
