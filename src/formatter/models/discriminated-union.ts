import { md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';
import { smartJoinMd } from '../utils';

export class DiscriminatedUnionModel
  implements
    IModel<
      | z4.$ZodDiscriminatedUnion
      | z3.ZodDiscriminatedUnion<
          string,
          readonly z3.ZodDiscriminatedUnionOption<string>[]
        >
    >
{
  isSchema(schema: z4.$ZodType | z3.ZodTypeAny) {
    return (
      schema instanceof z4.$ZodDiscriminatedUnion ||
      schema instanceof z3.ZodDiscriminatedUnion
    );
  }

  renderBlock(
    schema:
      | z4.$ZodDiscriminatedUnion
      | z3.ZodDiscriminatedUnion<
          string,
          readonly z3.ZodDiscriminatedUnionOption<string>[]
        >,
    renderer: Renderer
  ): BlockText {
    const options = this.#listOptions(schema);
    const discriminator = this.#getDiscriminator(schema);
    return md`${md.italic([
      'Union of the following possible types (discriminated by ',
      md.code(discriminator),
      '):',
    ])}${md.list(options.map(option => renderer.renderSchemaInline(option)))}`;
  }

  renderInline(
    schema:
      | z4.$ZodDiscriminatedUnion
      | z3.ZodDiscriminatedUnion<
          string,
          readonly z3.ZodDiscriminatedUnionOption<string>[]
        >,
    renderer: Renderer
  ): InlineText {
    const options = this.#listOptions(schema);
    const formattedItems = options.map(option =>
      renderer.renderSchemaInline(option)
    );
    return smartJoinMd(formattedItems, md.italic('or'));
  }

  #listOptions(
    schema:
      | z4.$ZodDiscriminatedUnion
      | z3.ZodDiscriminatedUnion<
          string,
          readonly z3.ZodDiscriminatedUnionOption<string>[]
        >
  ): readonly (z4.$ZodType | z3.ZodTypeAny)[] {
    return schema instanceof z4.$ZodDiscriminatedUnion
      ? schema._zod.def.options
      : schema._def.options;
  }

  #getDiscriminator(
    schema:
      | z4.$ZodDiscriminatedUnion
      | z3.ZodDiscriminatedUnion<
          string,
          readonly z3.ZodDiscriminatedUnionOption<string>[]
        >
  ): string {
    return schema instanceof z4.$ZodDiscriminatedUnion
      ? schema._zod.def.discriminator
      : schema._def.discriminator;
  }
}
