import { type FormattedText, MarkdownDocument } from 'build-md';

expect.extend({
  toEqualMarkdown(received: unknown, expected) {
    const { isNot } = this;

    const lines = expected.split('\n');
    const indentation = lines
      .filter(line => line.startsWith(' ') && line.trim().length > 0)
      .reduce(
        (acc, line) => Math.min(acc, line.match(/^( +)/)?.[1]?.length ?? 0),
        Number.POSITIVE_INFINITY
      );
    const rhs = lines
      .map(line =>
        line.length >= indentation &&
        line.slice(0, indentation).trim().length === 0
          ? line.slice(indentation)
          : line
      )
      .join('\n')
      .trim();

    if (!isMarkdownText(received)) {
      return {
        pass: false,
        message: () => `Is${isNot ? '' : ' not'} markdown text from build-md`,
        actual: received,
        expected: rhs,
      };
    }

    const lhs = new MarkdownDocument().paragraph(received).toString().trim();

    return {
      pass: lhs === rhs,
      message: () => `Markdown texts are${isNot ? ' not' : ''} equal`,
      actual: lhs,
      expected: rhs,
    };
  },
});

function isMarkdownText(received: unknown): received is FormattedText {
  if (Array.isArray(received)) {
    return received.every(isMarkdownText);
  }
  return (
    typeof received === 'string' ||
    (typeof received === 'object' &&
      received !== null &&
      (received.constructor.name.endsWith('Block') ||
        received.constructor.name.endsWith('Mark')))
  );
}
