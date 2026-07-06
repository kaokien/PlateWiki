import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/utils/seoSchemas';

const VALID_CATEGORIES: Record<string, string> = {
  punches: 'Punches',
  defense: 'Defense',
  footwork: 'Footwork',
  combinations: 'Combinations',
  conditioning: 'Conditioning',
  'ring-iq': 'Ring IQ',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
};

export default async function CategoryLayout({ children, params }: Props) {
  const { category } = await params;
  const displayName = VALID_CATEGORIES[category] || category;

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Techniques', url: '/techniques' },
    { name: displayName },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
