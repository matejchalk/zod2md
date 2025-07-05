export const VERSIONS = ['v3', 'v4', 'v4-mini'] as const;

export function versionToCommitlintSnapshotFile(
  version: (typeof VERSIONS)[number]
): string {
  switch (version) {
    case 'v3':
      return 'commitlint-example-v3.md';
    case 'v4':
    case 'v4-mini':
      return 'commitlint-example-v4.md';
  }
}
