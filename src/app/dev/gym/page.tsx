import { notFound } from 'next/navigation';
import VirtualGym from '@/components/VirtualGym';

// Dev-only harness for the Virtual Gym viewport — lets you preview the
// tamagotchi scene (garden growth, famished/withered states, sleep filter)
// without signing in. Returns 404 in production builds.
export default function DevGymPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 16px' }}>
      <VirtualGym />
    </div>
  );
}
