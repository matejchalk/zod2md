import { runServer } from 'verdaccio';
import { exec } from 'node:child_process';
import { rm, writeFile } from 'node:fs/promises';
import type { Server } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

// eslint-disable-next-line functional/no-let
let server: Server;

const port = 4873;
const registry = `http://localhost:${port}`;
const username = 'test';
const password = '1234';
const email = 'test@example.com';

const npmrcPath = path.join(
  fileURLToPath(path.dirname(import.meta.url)),
  '..',
  '.npmrc',
);

export async function setup() {
  server = await runServer('.verdaccio/config.yml');
  await new Promise<void>((resolve, reject) => {
    server.listen(port).once('listening', resolve).once('error', reject);
  });
  console.info(`🚀 Verdaccio local registry started at ${registry}`);

  await loginToRegistry();
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

  await rm(npmrcPath, { force: true });

  server.close(console.error);
  console.info('🧹 Closed Verdaccio local registry');
}

async function loginToRegistry() {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  const response = await fetch(
    `${registry}/-/user/org.couchdb.user:${username}`,
    {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({ name: username, password, email }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to log in to local registry: ${response.status} ${response.statusText}`,
    );
  }
  const { token } = (await response.json()) as { token: string };
  await writeFile(npmrcPath, `//localhost:${port}/:_authToken=${token}\n`);
}
