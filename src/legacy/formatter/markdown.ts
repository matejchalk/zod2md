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

export const bold = (text: string, lang: 'md' | 'html' = 'md') =>
  lang === 'html' ? `<b>${text}</b>` : `**${text}**`;

export const italic = (text: string, lang: 'md' | 'html' = 'md') =>
  lang === 'html' ? `<i>${text}</i>` : `_${text}_`;

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
  html: {
    unordered: (items: string[]) =>
      `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`,
    ordered: (items: string[]) =>
      `<ol>${items.map(item => `<li>${item}</li>`).join('')}</ol>`,
  },
};

export const table = (
  cells: string[][],
  headers?: string[],
  align?: ('left' | 'center' | 'right')[]
) => {
  const alignSymbols = {
    left: ':--',
    center: ':-:',
    right: '--:',
  };

  const getColAlign = (index: number) => align?.[index] ?? 'left';

  const rows: string[][] = [
    ...(headers
      ? [headers, headers.map((_, i) => alignSymbols[getColAlign(i)])]
      : []),
    ...cells,
  ].map(row =>
    row.map(cell => cell.replace(/\|/g, '\\|').replace(/\n+/g, '<br />'))
  );

  const columnCount = Math.max(...rows.map(row => row.length));
  const columnWidths = Array.from({ length: columnCount }).map((_, i) =>
    Math.max(...rows.map(row => row[i]?.length ?? 0))
  );

  const formatCell = (cell: string, index: number) => {
    const width = columnWidths[index] ?? cell.length;
    const colAlign = getColAlign(index);
    if (cell === alignSymbols[colAlign]) {
      return `${cell[0]}${'-'.repeat(width - cell.length)}${cell.slice(1)}`;
    }
    switch (colAlign) {
      case 'left':
        return cell.padEnd(width, ' ');
      case 'right':
        return cell.padStart(width, ' ');
      case 'center':
        const toFill = width - cell.length;
        const fillLeft = Math.floor(toFill / 2);
        const fillRight = toFill - fillLeft;
        return ' '.repeat(fillLeft) + cell + ' '.repeat(fillRight);
    }
  };

  return lines(...rows.map(row => `| ${row.map(formatCell).join(' | ')} |`));
};

export const details = (summary: string, details: string) =>
  lines(
    '<details>',
    `<summary>${summary}</summary>`,
    `\n${details}\n`.replace(/^\n{2,}/, '\n').replace(/\n{2,}$/, '\n'),
    '</details>'
  );
