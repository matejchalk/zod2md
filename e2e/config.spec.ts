import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);

const fixturesDir = join(fileURLToPath(dirname(import.meta.url)), 'fixtures');

describe('zod2md config', () => {
  it('should generate markdown for commitlint example', async () => {
    const { stdout, stderr } = await execAsync('npx zod2md', {
      cwd: join(fixturesDir, 'commitlint'),
    });

    expect(stderr).toBe('');
    expect(stdout).toContain('commitlint.md');

    await expect(
      readFile('tmp/config/commitlint.md', 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/commitlint-example.md');
  });

  it('should generate markdown for prettier example', async () => {
    const { stdout, stderr } = await execAsync('npx zod2md', {
      cwd: join(fixturesDir, 'prettier'),
    });

    expect(stderr).toBe('');
    expect(stdout).toContain('prettier.md');

    await expect(
      readFile('tmp/config/prettier.md', 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/prettier-example.md');
  });

  it('should generate markdown for user-rest-api example', async () => {
    const { stdout, stderr } = await execAsync('npx zod2md', {
      cwd: join(fixturesDir, 'user-rest-api'),
    });

    expect(stderr).toBe('');
    expect(stdout).toContain('user-rest-api.md');

    await expect(
      readFile('tmp/config/user-rest-api.md', 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/user-rest-api-example.md');
  });
});
