import type { BlockText, InlineText } from 'build-md';
import type z3 from 'zod/v3';
import type z4 from 'zod/v4/core';
import type { Renderer } from './renderer';

/* eslint-disable @typescript-eslint/method-signature-style,functional/prefer-property-signatures */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface IModel<T extends z4.$ZodType | z3.ZodTypeAny> {
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny): schema is T;
  renderBlock(schema: T, renderer: Renderer): BlockText;
  renderInline(schema: T, renderer: Renderer): InlineText;
}
/* eslint-enable @typescript-eslint/method-signature-style,functional/prefer-property-signatures */

export type NameTransformFn = (
  name: string | undefined,
  path: string,
  schema: z4.$ZodType | z3.ZodTypeAny,
) => string;

export type FormatterOptions = {
  title: string;
  transformName?: NameTransformFn;
};
