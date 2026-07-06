'use client';

import dynamic from 'next/dynamic';

// Client-only: the shop preview renders recolored sprites via canvas
const GymShopPage = dynamic(() => import('@/views/GymShopPage'), { ssr: false });

export default function ShopRoute() {
  return <GymShopPage />;
}
