import React from 'react';
import StashDetailClient from './StashDetailClient';
import { getCuratedStashes } from '../../../lib/data';

export function generateStaticParams() {
  const curated = getCuratedStashes();
  return curated.map((stash) => ({
    stashId: stash.id,
  }));
}

export default async function StashDetailPage({
  params,
}: {
  params: Promise<{ stashId: string }>;
}) {
  const { stashId } = await params;
  return <StashDetailClient stashId={stashId} />;
}
