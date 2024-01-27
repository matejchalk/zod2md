export type LoaderOptions = {
  entry: string | string[];
  tsconfig?: string;
  format?: 'esm' | 'cjs';
};

export type ImportedModules = {
  [path: string]: object;
};
