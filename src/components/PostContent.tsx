import React from 'react';

type PostContentProps = {
  content: string[];
  authorName?: string;
  authorImage?: string;
};

function normalizeLine(line: string) {
  return line.replace(/\s+$/g, '');
}

export default function PostContent({ content, authorName, authorImage }: PostContentProps) {
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let hasH2 = false;

  const resolvedAuthorName = authorName?.trim() || 'Sandile Mnqayi';
  const resolvedAuthorImage = authorImage?.trim() || '/images/author-placeholder.svg';

  const flushList = (keyBase: number) => {
    if (listItems.length === 0) return;
    const items = listItems;
    listItems = [];
    blocks.push(
      <ul key={`ul-${keyBase}`} className="space-y-2">
        {items.map((item, i) => (
          <li
            key={`li-${keyBase}-${i}`}
            className="relative pl-6 text-zinc-800 leading-relaxed before:absolute before:left-0 before:top-0 before:content-['➤'] before:text-zinc-700 before:drop-shadow-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  };

  content.forEach((raw, index) => {
    const line = normalizeLine(raw);
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(index);
      blocks.push(<div key={`sp-${index}`} className="h-2" />);
      return;
    }

    const bulletMatch = trimmed.match(/^(-|•)\s+(.*)$/);
    if (bulletMatch) {
      listItems.push(bulletMatch[2]);
      return;
    }

    flushList(index);

    if (trimmed.startsWith('## ')) {
      const isFirst = !hasH2;
      hasH2 = true;
      blocks.push(
        <h2
          key={`h2-${index}`}
          className={[
            'font-merriweather text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight',
            isFirst ? 'mt-8' : 'mt-10 pt-8 border-t border-zinc-200',
          ].join(' ')}
        >
          {trimmed.slice(3)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h3
          key={`h3-${index}`}
          className="font-merriweather text-lg md:text-xl font-semibold text-zinc-900 mt-8 pt-6 border-t border-zinc-100 tracking-tight"
        >
          {trimmed.slice(4)}
        </h3>
      );
      return;
    }

    blocks.push(
      <p key={`p-${index}`} className="text-zinc-700 leading-relaxed">
        {trimmed}
      </p>
    );
  });

  flushList(content.length + 1);

  return (
    <div className="space-y-5 border-l border-zinc-200 pl-6">
      {blocks}
      <footer className="mt-10 pt-6 border-t border-zinc-200">
        <div className="flex items-center gap-4">
          <img
            src={resolvedAuthorImage}
            alt={resolvedAuthorName}
            className="h-12 w-12 rounded-full border border-zinc-200 bg-zinc-50"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="text-sm text-zinc-500">Author</div>
            <div className="font-merriweather text-base font-semibold text-zinc-900 truncate">
              {resolvedAuthorName}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
