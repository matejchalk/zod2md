import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { VERSIONS, versionToCommitlintSnapshotFile } from './utils';

const execAsync = promisify(exec);

const fixturesDir = path.join(
  fileURLToPath(path.dirname(import.meta.url)),
  'fixtures',
);

describe.each(VERSIONS)('zod2md config (%s)', version => {
  it('should generate markdown for commitlint example', async () => {
    const { stdout, stderr } = await execAsync('npx zod2md', {
      cwd: path.join(fixturesDir, 'commitlint', version),
    });

    expect(stderr).toBe('');
    expect(stdout).toContain('commitlint.md');

    await expect(
      fs.readFile('tmp/config/commitlint.md', 'utf8'),
    ).resolves.toMatchFileSnapshot(
      `__snapshots__/${versionToCommitlintSnapshotFile(version)}`,
    );
  });

  it('should generate markdown for prettier example', async () => {
    const { stdout, stderr } = await execAsync('npx zod2md', {
      cwd: path.join(fixturesDir, 'prettier', version),
    });

    expect(stderr).toBe('');
    expect(stdout).toContain('prettier.md');

    await expect(
      fs.readFile('tmp/config/prettier.md', 'utf8'),
    ).resolves.toMatchFileSnapshot('__snapshots__/prettier-example.md');
  });

  it('should generate markdown for user-rest-api example', async () => {
    const { stdout, stderr } = await execAsync('npx zod2md', {
      cwd: path.join(fixturesDir, 'user-rest-api', version),
    });

    expect(stderr).toBe('');
    expect(stdout).toContain('user-rest-api.md');

    await expect(
      fs.readFile('tmp/config/user-rest-api.md', 'utf8'),
    ).resolves.toMatchFileSnapshot('__snapshots__/user-rest-api-example.md');
  });
});
