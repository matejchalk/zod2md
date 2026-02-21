import { runServer } from 'verdaccio';
import { exec } from 'node:child_process';
import type { Server } from 'node:http';
import { promisify } from 'node:util';

// eslint-disable-next-line functional/no-let
let server: Server;

const port = 4873;
const registry = `http://localhost:${port}`;

export async function setup() {
  server = await runServer('.verdaccio/config.yml');
  await new Promise<void>((resolve, reject) => {
    server.listen(port).once('listening', resolve).once('error', reject);
  });
  console.info(`🚀 Verdaccio local registry started at ${registry}`);

  await promisify(exec)(
    `npm-cli-login -u test -p 1234 -e test@example.com -r ${registry}`,
  );
  await promisify(exec)(`npm publish --registry ${registry} --force`);
  console.info('🚀 Published package to local registry');

  await promisify(exec)(`npm i -D zod2md --registry ${registry}`);
  console.info('🚀 Installed zod2md from local registry\n');
}

export async function teardown() {
  await promisify(exec)(`npm rm zod2md`);
  console.info('🧹 Un-installed zod2md');

  await promisify(exec)(`npm unpublish --registry ${registry} --force`);
  console.info('🧹 Un-published package in local registry');

  server.close(console.error);
  console.info('🧹 Closed Verdaccio local registry');
}
