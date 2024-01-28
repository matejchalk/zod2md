export type NameTransformFn = (
  name: string | undefined,
  path: string
) => string;

export type FormatterOptions = {
  title: string;
  transformName?: NameTransformFn;
};
