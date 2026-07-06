import React from 'react';
import Link from 'next/link';
import { glossary, toSlug } from '../data/glossary';

/**
 * Scan `text` for glossary terms and wrap the first occurrence of each
 * in a Next.js <Link> to that term's glossary page.
 *
 * @param text      The definition string to process
 * @param exclude   The current term to skip (don't self-link)
 * @returns         ReactNode with inline links
 */
// Sorted longest-first so "bob and weave" matches before "bob". The glossary
// is static, so the sorted list and compiled patterns are built once per
// exclude-term instead of on every call (articles invoke this per section).
const sortedTerms = glossary
  .map((g) => g.term)
  .sort((a, b) => b.length - a.length);

const escapeRegex = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const patternCache = new Map<string, RegExp | null>();

function getPattern(exclude?: string): RegExp | null {
  const key = exclude ?? '';
  if (!patternCache.has(key)) {
    const terms = sortedTerms.filter((t) => t !== exclude);
    patternCache.set(
      key,
      terms.length === 0 ? null : new RegExp(`\\b(${terms.map(escapeRegex).join('|')})\\b`, 'gi'),
    );
  }
  return patternCache.get(key) ?? null;
}

export function linkGlossaryTerms(
  text: string,
  exclude?: string,
): React.ReactNode {
  const pattern = getPattern(exclude);
  if (!pattern) return text;
  // shared cached regex is stateful ('g' flag) — always start from 0
  pattern.lastIndex = 0;

  const parts: React.ReactNode[] = [];
  const linked = new Set<string>(); // only link each term once
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const matchedText = match[0];
    const termKey = matchedText.toLowerCase();

    // Only link first occurrence
    if (linked.has(termKey)) continue;
    linked.add(termKey);

    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Find the canonical glossary entry for the slug
    const entry = glossary.find(
      (g) => g.term.toLowerCase() === termKey,
    );
    const slug = entry ? toSlug(entry.term) : toSlug(matchedText);

    parts.push(
      <Link
        key={`gl-${slug}-${match.index}`}
        href={`/glossary/${slug}`}
        className="glossary-inline-link"
      >
        {matchedText}
      </Link>,
    );

    lastIndex = match.index + matchedText.length;
  }

  // Remaining tail
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}
