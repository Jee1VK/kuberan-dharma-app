import React from 'react';
import ReaderClient from './ReaderClient';
import { CorpusId } from '../../../../lib/types/scripture';

export function generateStaticParams() {
  const params: Array<{ corpusId: string; sectionId: string }> = [];

  // Bhagavad Gita (18 chapters)
  for (let ch = 1; ch <= 18; ch++) {
    params.push({ corpusId: 'bhagavad-gita', sectionId: String(ch) });
  }

  // Ramayana, Mahabharata, Vedas, Puranas
  for (const c of ['ramayana', 'mahabharata', 'vedas', 'puranas']) {
    params.push({ corpusId: c, sectionId: '1' });
  }

  return params;
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ corpusId: string; sectionId: string }>;
}) {
  const { corpusId, sectionId } = await params;
  const sectionIdNum = parseInt(sectionId, 10) || 1;

  return <ReaderClient corpusId={corpusId as CorpusId} sectionIdNum={sectionIdNum} />;
}
