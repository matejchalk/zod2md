import { md } from 'build-md';
import { z } from 'zod/v3';
import { NativeEnumModel } from './native-enum';

describe('NativeEnumModel', () => {
  describe('renderBlock', () => {
    it('should render numeric enum', () => {
      enum Status {
        Pending,
        Success,
        Failure,
      }
      expect(new NativeEnumModel().renderBlock(z.nativeEnum(Status)))
        .toEqualMarkdown(`
          _Native enum:_

          | Key       | Value |
          | :-------- | ----: |
          | \`Pending\` |   \`0\` |
          | \`Success\` |   \`1\` |
          | \`Failure\` |   \`2\` |        
        `);
    });

    it('should render string enum', () => {
      enum Status {
        Pending = 'pending',
        Success = 'success',
        Failure = 'failure',
      }
      expect(new NativeEnumModel().renderBlock(z.nativeEnum(Status)))
        .toEqualMarkdown(`
          _Native enum:_

          | Key       | Value       |
          | :-------- | :---------- |
          | \`Pending\` | \`'pending'\` |
          | \`Success\` | \`'success'\` |
          | \`Failure\` | \`'failure'\` |        
        `);
    });
  });

  describe('renderInline', () => {
    it('should render numeric enum', () => {
      enum Rel {
        Prev,
        Next,
      }
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('rel'),
              new NativeEnumModel().renderInline(z.nativeEnum(Rel)),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property | Type                                                                                |
        | -------- | ----------------------------------------------------------------------------------- |
        | \`rel\`    | _Native enum:_<ul><li><code>Prev = 0</code></li><li><code>Next = 1</code></li></ul> |
      `);
    });

    it('should render string enum', () => {
      enum Rel {
        Prev = 'prev',
        Next = 'next',
      }
      expect(
        md.table(
          ['Property', 'Type'],
          [
            [
              md.code('rel'),
              new NativeEnumModel().renderInline(z.nativeEnum(Rel)),
            ],
          ]
        )
      ).toEqualMarkdown(`
        | Property | Type                                                                                          |
        | -------- | --------------------------------------------------------------------------------------------- |
        | \`rel\`    | _Native enum:_<ul><li><code>Prev = 'prev'</code></li><li><code>Next = 'next'</code></li></ul> |
      `);
    });
  });
});
