import type { BlockText, InlineText } from 'build-md';
import type z3 from 'zod/v3';
import type z4 from 'zod/v4/core';
import type { Renderer } from './renderer';

export interface IModel<T extends z4.$ZodType | z3.ZodTypeAny> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny): schema is T;
  renderBlock(schema: T, renderer: Renderer): BlockText;
  renderInline(schema: T, renderer: Renderer): InlineText;
}

export type NameTransformFn = (
  name: string | undefined,
  path: string
) => string;

export type FormatterOptions = {
  title: string;
  transformName?: NameTransformFn;
};
