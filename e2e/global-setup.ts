import { exec } from 'child_process';
import { type Server } from 'http';
import { promisify } from 'util';
import { runServer } from 'verdaccio';

let server: Server;

const port = 4873;
const registry = `http://localhost:${port}`;

export async function setup() {
  server = await runServer('.verdaccio/config.yml');
  await new Promise<void>((resolve, reject) => {
    server.listen(port).once('listening', resolve).once('error', reject);
  });
  console.info(`🚀 Verdaccio local registry started at ${registry}`);

  await promisify(exec)(`npm unpublish --registry ${registry} --force`);
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
