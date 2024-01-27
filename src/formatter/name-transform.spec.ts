import { defaultNameTransform } from './name-transform';

describe('default transformName', () => {
  it.each([
    ['User', 'src/models.ts', 'User'],
    ['userSchema', 'src/schemas.ts', 'User'],
    [undefined, 'src/schemas/user.ts', 'User'],
    [undefined, 'src/schemas/user/index.ts', 'User'],
    ['uploadConfigSchema', 'src/schemas.ts', 'UploadConfig'],
    [undefined, 'src/models/upload-config.schema.ts', 'UploadConfig'],
    ['LoginProps', 'src/pages/Login.tsx', 'LoginProps'],
    [undefined, 'schemas/log-entry.mjs', 'LogEntry'],
  ])('should transform %j from %j to %j', (name, path, result) => {
    expect(defaultNameTransform(name, path)).toBe(result);
  });
});
