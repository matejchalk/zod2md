export type LoaderOptions = {
  entry: string | string[];
  tsconfig?: string;
  format?: 'esm' | 'cjs';
};

export type ImportedModules = {
  [basename: string]: unknown;
};
