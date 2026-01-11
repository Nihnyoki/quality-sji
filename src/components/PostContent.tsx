import React from 'react';
import { Link } from '@tanstack/react-router';

type PostContentProps = {
  content: string[];
  authorName?: string;
  authorImage?: string;
};

function normalizeLine(line: string) {
  return line.replace(/\s+$/g, '');
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function renderInlineLinks(text: string, keyBase: string) {
  const nodes: React.ReactNode[] = [];

  // Supports:
  // 1) Markdown links: [label](/path)
  // 2) Shorthand: here (/path)
  const re = /\[([^\]]+)\]\(([^)]+)\)|(\bhere\b)\s*\((\/[^)\s]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const start = match.index;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    const mdLabel = match[1];
    const mdHref = match[2];
    const hereLabel = match[3];
    const hereHref = match[4];

    const label = (mdLabel ?? hereLabel ?? '').trim();
    const href = (mdHref ?? hereHref ?? '').trim();

    const key = `${keyBase}-${nodes.length}`;

    if (label && href) {
      if (href.startsWith('/') && !isExternalHref(href)) {
        nodes.push(
          <Link
            key={key}
            to={href}
            onClick={() => window.scrollTo({ top: 0, left: 0 })}
            className="font-medium text-zinc-900 underline hover:text-zinc-700"
          >
            {label}
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={key}
            href={href}
            className="font-medium text-zinc-900 underline hover:text-zinc-700"
            target={isExternalHref(href) ? '_blank' : undefined}
            rel={isExternalHref(href) ? 'noreferrer' : undefined}
          >
            {label}
          </a>
        );
      }
    } else {
      nodes.push(match[0]);
    }

    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length === 1 ? nodes[0] : nodes;
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
            {renderInlineLinks(item, `li-${keyBase}-${i}`)}
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
        {renderInlineLinks(trimmed, `p-${index}`)}
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
