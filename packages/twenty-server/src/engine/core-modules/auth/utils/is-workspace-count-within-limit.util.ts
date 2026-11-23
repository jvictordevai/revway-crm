import { isDefined } from 'twenty-shared/utils';

import { MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY } from 'src/engine/core-modules/auth/constants/max-workspaces-without-organization-key.constant';

// RevWay: the workspace cap is configurable; a limit of 0 means unlimited.
export const isWorkspaceCountWithinLimit = ({
  workspaceCount,
  limit,
}: {
  workspaceCount: number;
  limit: number | undefined;
}): boolean => {
  const effectiveLimit = isDefined(limit)
    ? limit
    : MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY;

  if (effectiveLimit === 0) {
    return true;
  }

  return workspaceCount < effectiveLimit;
};
