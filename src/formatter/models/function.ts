import { CodeMark, md, type BlockText, type InlineText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';

type FunctionSignature = {
  parameters: readonly (z4.$ZodType | z3.ZodTypeAny)[];
  returnValue: z4.$ZodType | z3.ZodTypeAny;
};

export class FunctionModel
  implements IModel<z4.$ZodType | z3.ZodFunction<z3.ZodTuple, z3.ZodTypeAny>>
{
  isSchema(
    schema: z4.$ZodType | z3.ZodTypeAny
  ): schema is z4.$ZodType | z3.ZodFunction<z3.ZodTuple, z3.ZodTypeAny> {
    return (
      (schema instanceof z4.$ZodType &&
        this.#getV4FunctionFactory(schema) != null) ||
      schema instanceof z3.ZodFunction
    );
  }

  renderBlock(
    schema: z4.$ZodType | z3.ZodFunction<z3.ZodTuple, z3.ZodTypeAny>,
    renderer: Renderer
  ): BlockText {
    const { parameters, returnValue } = this.#getFunctionSignature(schema);
    return [
      md.paragraph(md.italic('Function.')),
      md.paragraph(md.italic('Parameters:')),
      parameters.length > 0
        ? md.list(
            'ordered',
            parameters.map(param => renderer.renderSchemaInline(param))
          )
        : md.list([md.italic('none')]),
      md.paragraph(md.italic('Return value:')),
      md.list([renderer.renderSchemaInline(returnValue)]),
    ];
  }

  renderInline(
    schema: z4.$ZodType | z3.ZodFunction<z3.ZodTuple, z3.ZodTypeAny>,
    renderer: Renderer
  ): InlineText {
    const { parameters, returnValue } = this.#getFunctionSignature(schema);
    const formattedParameters = parameters.map(param =>
      renderer.renderSchemaInline(param)
    );
    const formattedReturnValue = renderer.renderSchemaInline(returnValue);

    if (
      formattedParameters.every(param => param instanceof CodeMark) &&
      formattedReturnValue instanceof CodeMark
    ) {
      return md.code(
        `(${formattedParameters.map(param => param.text).join(', ')}) => ${
          formattedReturnValue.text
        }`
      );
    }

    return md`${md.italic('Function:')}${md.list([
      md`${md.italic('parameters:')} ${
        formattedParameters.length > 0
          ? md.list(formattedParameters)
          : md.italic('none')
      }`,
      md`${md.italic('returns:')} ${formattedReturnValue}`,
    ])}`;
  }

  #getFunctionSignature(
    schema: z4.$ZodType | z3.ZodFunction<z3.ZodTuple, z3.ZodTypeAny>
  ): FunctionSignature {
    if (schema instanceof z4.$ZodType) {
      const functionFactory = this.#getV4FunctionFactory(schema);
      if (!functionFactory) {
        // shouldn't happen
        return { parameters: [], returnValue: z4.NEVER };
      }
      return {
        parameters:
          functionFactory.def.input instanceof z4.$ZodTuple
            ? functionFactory.def.input._zod.def.items
            : [], // TODO: what about ZodArray?
        returnValue: functionFactory.def.output,
      };
    }
    return {
      // TODO: support rest args? what about implicit `...unknown[]`?
      parameters: schema._def.args.items,
      returnValue: schema._def.returns,
    };
  }

  #getV4FunctionFactory(schema: z4.$ZodType): z4.$ZodFunction | undefined {
    // workaround for z.function no longer being a schema in v4: https://zod.dev/v4/changelog?id=zfunction
    const functionFactory = z4.globalRegistry.get(schema)?.$ZodFunction;
    if (functionFactory instanceof z4.$ZodFunction) {
      return functionFactory;
    }
  }
}
