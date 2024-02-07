import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);

const fixturesDir = join(fileURLToPath(dirname(import.meta.url)), 'fixtures');

describe('zod2md CLI', () => {
  it('should generate markdown for commitlint example', async () => {
    const { stdout, stderr } = await execAsync(
      'npx . --entry e2e/fixtures/commitlint/index.ts --output tmp/commitlint.md --title "Commitlint config"'
    );

    expect(stdout).toContain('commitlint.md');
    expect(stderr).toBe('');

    await expect(
      readFile(join('tmp', 'commitlint.md'), 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/commitlint-example.md');
  });

  it('should generate markdown for prettier example', async () => {
    const { stdout, stderr } = await execAsync(
      `npx . --entry e2e/fixtures/prettier/prettierrc.js --output tmp/prettier.md --title "Prettier configuration file reference"`
    );

    expect(stdout).toContain('prettier.md');
    expect(stderr).toBe('');

    await expect(
      readFile(join('tmp', 'prettier.md'), 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/prettier-example.md');
  });

  it('should generate markdown for user-rest-api example', async () => {
    const { stdout, stderr } = await execAsync(
      `npx . \\
         --entry e2e/fixtures/user-rest-api/endpoints/get-users.mjs \\
         --entry e2e/fixtures/user-rest-api/endpoints/get-user.mjs \\
         --entry e2e/fixtures/user-rest-api/endpoints/create-user.mjs \\
         --entry e2e/fixtures/user-rest-api/endpoints/update-user.mjs \\
         --entry e2e/fixtures/user-rest-api/endpoints/delete-user.mjs \\
         --output tmp/user-rest-api.md \\
         --title "User REST API"`
    );

    expect(stdout).toContain('user-rest-api.md');
    expect(stderr).toBe('');

    await expect(
      readFile(join('tmp', 'user-rest-api.md'), 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/user-rest-api-example.md');
  });
});
