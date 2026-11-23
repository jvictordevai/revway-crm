import { isWorkspaceCountWithinLimit } from 'src/engine/core-modules/auth/utils/is-workspace-count-within-limit.util';

describe('isWorkspaceCountWithinLimit', () => {
  it('allows creation while the count is below the limit', () => {
    expect(isWorkspaceCountWithinLimit({ workspaceCount: 4, limit: 5 })).toBe(
      true,
    );
  });

  it('refuses creation when the count reaches the limit', () => {
    expect(isWorkspaceCountWithinLimit({ workspaceCount: 5, limit: 5 })).toBe(
      false,
    );
  });

  it('treats a limit of 0 as unlimited', () => {
    expect(
      isWorkspaceCountWithinLimit({ workspaceCount: 10_000, limit: 0 }),
    ).toBe(true);
  });

  it('falls back to the upstream default when the limit is undefined', () => {
    expect(
      isWorkspaceCountWithinLimit({ workspaceCount: 5, limit: undefined }),
    ).toBe(false);
    expect(
      isWorkspaceCountWithinLimit({ workspaceCount: 4, limit: undefined }),
    ).toBe(true);
  });
});
