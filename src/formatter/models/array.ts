import { CodeMark, md, type BlockText } from 'build-md';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4/core';
import type { Renderer } from '../renderer';
import type { IModel } from '../types';
import { smartJoin } from '../utils';
import { ObjectModel } from './object';

type ArrayValidation =
  | { kind: 'min'; value: number }
  | { kind: 'max'; value: number }
  | { kind: 'length'; value: number };

export class ArrayModel
  implements IModel<z3.ZodArray<z3.ZodTypeAny> | z4.$ZodArray<z4.$ZodType>>
{
  isSchema(schema: z3.ZodTypeAny | z4.$ZodType) {
    return schema instanceof z3.ZodArray || schema instanceof z4.$ZodArray;
  }

  renderBlock(
    schema: z3.ZodArray<z3.ZodTypeAny> | z4.$ZodArray<z4.$ZodType>,
    renderer: Renderer
  ): BlockText {
    const itemSchema = this.#getItemSchema(schema);
    const validations = this.#listValidations(schema);

    if (!renderer.findExportedSchema(itemSchema)) {
      const model = renderer.findModel(itemSchema);
      if (model instanceof ObjectModel && model.isSchema(itemSchema)) {
        return model.renderBlock(itemSchema, renderer, {
          objectName: `${this.#formatPrefix(validations)} ${this.#formatSuffix(
            validations,
            'object'
          )}`,
        });
      }
    }

    const exportedSchema = renderer.findExportedSchema(itemSchema);
    if (exportedSchema) {
      return md.italic(
        md`${this.#formatPrefix(validations)} ${renderer.formatExportedSchema(
          exportedSchema
        )} ${this.#formatSuffix(validations)}`
      );
    }

    return md`${md.italic(
      this.#formatPrefix(validations)
    )} ${renderer.renderSchemaInline(itemSchema)} ${md.italic(
      this.#formatSuffix(validations)
    )}`;
  }

  renderInline(
    schema: z3.ZodArray<z3.ZodTypeAny> | z4.$ZodArray<z4.$ZodType>,
    renderer: Renderer
  ): BlockText {
    const itemSchema = this.#getItemSchema(schema);
    const validations = this.#listValidations(schema);

    const exportedSchema = renderer.findExportedSchema(itemSchema);
    if (exportedSchema) {
      return md.italic([
        this.#formatPrefix(validations),
        ' ',
        renderer.formatExportedSchema(exportedSchema),
        ' ',
        this.#formatSuffix(validations),
      ]);
    }

    const model = renderer.findModel(itemSchema);
    if (model instanceof ObjectModel && model.isSchema(itemSchema)) {
      return model.renderInline(itemSchema, renderer, {
        objectName: `${this.#formatPrefix(validations)} ${this.#formatSuffix(
          validations,
          'object'
        )}:`,
      });
    }

    const itemRendered = renderer.renderSchemaInline(itemSchema);
    if (itemRendered instanceof CodeMark) {
      const typeName = `Array<${itemRendered.text}>`;
      const validationsText = validations
        .map(({ kind, value }) => `${kind}: ${value}`)
        .join(', ');
      return validationsText
        ? md`${md.code(typeName)} (${md.italic(validationsText)})`
        : md.code(typeName);
    }

    const prefixText = `${this.#formatPrefix(validations)} ${this.#formatSuffix(
      validations
    )} of type`;
    return md`${md.italic(prefixText)} ${renderer.renderSchemaInline(
      itemSchema
    )}`;
  }

  #getItemSchema(
    schema: z3.ZodArray<z3.ZodTypeAny> | z4.$ZodArray<z4.$ZodType>
  ): z3.ZodTypeAny | z4.$ZodType {
    return schema instanceof z3.ZodArray
      ? schema.element
      : schema._zod.def.element;
  }

  #listValidations(
    schema: z3.ZodArray<z3.ZodTypeAny> | z4.$ZodArray<z4.$ZodType>
  ): ArrayValidation[] {
    const possibleValidations: (ArrayValidation | null)[] =
      schema instanceof z3.ZodArray
        ? [
            schema._def.minLength && {
              kind: 'min',
              value: schema._def.minLength.value,
            },
            schema._def.maxLength && {
              kind: 'max',
              value: schema._def.maxLength.value,
            },
            schema._def.exactLength && {
              kind: 'length',
              value: schema._def.exactLength.value,
            },
          ]
        : schema._zod.def.checks?.map((check): ArrayValidation | null => {
            if (check instanceof z4.$ZodCheckMinLength) {
              return { kind: 'min', value: check._zod.def.minimum };
            }
            if (check instanceof z4.$ZodCheckMaxLength) {
              return { kind: 'max', value: check._zod.def.maximum };
            }
            if (check instanceof z4.$ZodCheckLengthEquals) {
              return { kind: 'length', value: check._zod.def.length };
            }
            return null;
          }) ?? [];
    return possibleValidations.filter(value => value != null);
  }

  #formatPrefix(validations: ArrayValidation[]): string {
    const validationsText = smartJoin(
      validations.map(({ kind, value }): string => {
        switch (kind) {
          case 'min':
            return `at least ${value}`;
          case 'max':
            return `at most ${value}`;
          case 'length':
            return `exactly ${value}`;
        }
      }),
      ' and '
    );
    return validationsText ? `Array of ${validationsText}` : 'Array of';
  }

  #formatSuffix(
    validations: ArrayValidation[],
    noun: 'item' | 'object' = 'item'
  ): string {
    const isPlural = validations.every(({ value }) => value !== 1);
    return isPlural ? `${noun}s` : noun;
  }
}
