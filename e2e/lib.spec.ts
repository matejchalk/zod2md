import { zod2md } from '../src';

describe('zod2md exported function', () => {
  // it('should generate markdown for commitlint example', async () => {
  //   await expect(
  //     zod2md({
  //       title: 'Commitlint config',
  //       entry: ['./e2e/fixtures/commitlint/index.ts'],
  //     })
  //   ).resolves.toMatchFileSnapshot('__snapshots__/commitlint-example.md');
  // });

  // it('should generate markdown for prettier example', async () => {
  //   await expect(
  //     zod2md({
  //       title: 'Prettier configuration file reference',
  //       entry: ['./e2e/fixtures/prettier/prettierrc.js'],
  //     })
  //   ).resolves.toMatchFileSnapshot('__snapshots__/prettier-example.md');
  // });

  it('should generate markdown for user-rest-api example', async () => {
    await expect(
      zod2md({
        title: 'User REST API',
        entry: [
          // './e2e/fixtures/user-rest-api/endpoints/get-users.mjs',
          './e2e/fixtures/user-rest-api/endpoints/get-user.mjs',
          './e2e/fixtures/user-rest-api/endpoints/create-user.mjs',
          './e2e/fixtures/user-rest-api/endpoints/update-user.mjs',
          './e2e/fixtures/user-rest-api/endpoints/delete-user.mjs',
        ],
      })
    ).resolves.toMatchFileSnapshot('__snapshots__/user-rest-api-example.md');
  });
});
