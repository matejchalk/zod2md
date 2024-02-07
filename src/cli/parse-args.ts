import { Command, Option } from '@commander-js/extra-typings';
import { description, name, version } from '../../package.json';

export async function parseArgs(argv?: string[]) {
  const program = new Command()
    .name(name)
    .description(description)
    .version(version)
    .option('-c, --config <path>')
    .option('-e, --entry <paths...>')
    .option('-o, --output <path>')
    .option('-t, --title <text>')
    .option('--tsconfig <path>')
    .addOption(
      new Option('-f, --format <format>').choices(['esm', 'cjs'] as const)
    );

  await program.parseAsync(argv);

  return program.opts();
}

export type CLIArgs = Awaited<ReturnType<typeof parseArgs>>;
