// eslint-disable-next-line import/no-unassigned-import
import 'vitest';

interface CustomMatchers<R = unknown> {
  toEqualMarkdown: (text: string) => R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
