export const document = (text: string) => `${text.trim()}\n`;

const lines = (...texts: (string | null | undefined | false)[]) =>
  texts
    .filter((text): text is string => !!text)
    .map(text => `${text}\n`)
    .join('');

export const paragraphs = (...texts: (string | null | undefined | false)[]) =>
  texts
    .filter((text): text is string => !!text)
    .map((text, i, arr) =>
      text.replace(/\n+$/, i === arr.length - 1 ? '\n' : '')
    )
    .join('\n\n');

export const heading = (level: 1 | 2 | 3 | 4 | 5 | 6, text: string) =>
  `${'#'.repeat(level)} ${text}`;

export const bold = (text: string) => `**${text}**`;

export const italic = (text: string) => `_${text}_`;

export const link = (href: string, text?: string) =>
  `[${text ?? href}](${href})`;

export const image = (href: string, alt?: string) =>
  `![${alt ?? 'image'}](${href})`;

export const quote = (text: string) =>
  text
    .split('\n')
    .map(line => `> ${line}`)
    .join('\n');

export const code = {
  inline: (text: string) => '`' + text + '`',
  block: (text: string, lang: 'ts' | 'js' | 'json') =>
    lines('```' + lang, text, '```'),
};

export const list = {
  unordered: (items: string[]) => lines(...items.map(item => `- ${item}`)),
  ordered: (items: string[]) =>
    lines(...items.map((item, idx) => `${idx + 1}. ${item}`)),
};

export const table = (
  cells: string[][],
  headers?: string[],
  align?: ('left' | 'center' | 'right')[]
) => {
  const rows: string[][] = [
    ...(headers
      ? [
          headers,
          headers.map((_, i) => {
            switch (align?.[i] ?? 'left') {
              case 'left':
                return ':--';
              case 'center':
                return ':-:';
              case 'right':
                return '--:';
            }
          }),
        ]
      : []),
    ...cells,
  ];
  return lines(
    ...rows.map(
      row => `|${row.map(cell => cell.replace(/\|/g, '\\|')).join('|')}|`
    )
  );
};
