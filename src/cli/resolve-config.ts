import type { Config, Prettify } from '../types';
import { findDefaultConfig } from './find-config';
import { importConfig } from './import-config';
import { parseArgs, type CLIArgs } from './parse-args';

export async function resolveConfig(argv?: string[]): Promise<Config> {
  const cliArgs = await parseArgs(argv);

  const configPath = cliArgs.config ?? (await findDefaultConfig());

  if (!configPath) {
    assertCliArgsSufficient(cliArgs);
    return cliArgs;
  }

  const config = await importConfig(configPath);
  return { ...config, ...cliArgs };
}

type RequiredOption = Extract<keyof Config, 'entry' | 'output' | 'title'>;
type SufficientCLIArgs = Prettify<
  Required<Pick<CLIArgs, RequiredOption>> &
    Omit<CLIArgs, RequiredOption | 'config'>
>;

function assertCliArgsSufficient(
  cliArgs: CLIArgs
): asserts cliArgs is SufficientCLIArgs {
  const requiredArgs = typedObjectKeys({
    entry: true,
    output: true,
    title: true,
  } satisfies Record<RequiredOption, true>);

  const missingArgs = requiredArgs.filter(name => !cliArgs[name]);

  if (missingArgs.length > 0) {
    throw new Error(
      `CLI arguments ${missingArgs
        .map(name => '`--' + name + '`')
        .join(' and ')} are required when no config file is provided`
    );
  }
}

function typedObjectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}
