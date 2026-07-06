'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const AdBanner = dynamic(() => import('./AdBanner'), { ssr: false });

interface AdSlotProps {
  id: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

const AdSlot = ({ id, format = 'horizontal', className = '' }: AdSlotProps) => {
  return (
    <div className={`ad-slot ${className}`} data-slot={id}>
      <AdBanner format={format} className={className} />
    </div>
  );
};

export default AdSlot;
