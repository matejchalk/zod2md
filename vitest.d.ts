import 'vitest';

interface CustomMatchers<R = unknown> {
  toEqualMarkdown: (text: string) => R;
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
