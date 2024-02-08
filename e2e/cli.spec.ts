import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('zod2md CLI', () => {
  it('should generate markdown for commitlint example', async () => {
    const { stdout, stderr } = await execAsync(
      'zod2md --entry e2e/fixtures/commitlint/index.ts --output tmp/cli/commitlint.md --title "Commitlint config"'
    );

    expect(stderr).toBe('');
    expect(stdout).toContain('commitlint.md');

    await expect(
      readFile('tmp/cli/commitlint.md', 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/commitlint-example.md');
  });

  it('should generate markdown for prettier example', async () => {
    const { stdout, stderr } = await execAsync(
      `zod2md --entry e2e/fixtures/prettier/prettierrc.js --output tmp/cli/prettier.md --title "Prettier configuration file reference"`
    );

    expect(stderr).toBe('');
    expect(stdout).toContain('prettier.md');

    await expect(
      readFile('tmp/cli/prettier.md', 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/prettier-example.md');
  });

  it('should generate markdown for user-rest-api example', async () => {
    const { stdout, stderr } = await execAsync(
      `zod2md \\
         --entry e2e/fixtures/user-rest-api/endpoints/get-users.mjs \\
         --entry e2e/fixtures/user-rest-api/endpoints/get-user.mjs \\
         --entry e2e/fixtures/user-rest-api/endpoints/create-user.mjs \\
         --entry e2e/fixtures/user-rest-api/endpoints/update-user.mjs \\
         --entry e2e/fixtures/user-rest-api/endpoints/delete-user.mjs \\
         --output tmp/cli/user-rest-api.md \\
         --title "User REST API"`
    );

    expect(stderr).toBe('');
    expect(stdout).toContain('user-rest-api.md');

    await expect(
      readFile('tmp/cli/user-rest-api.md', 'utf8')
    ).resolves.toMatchFileSnapshot('__snapshots__/user-rest-api-example.md');
  });
});
