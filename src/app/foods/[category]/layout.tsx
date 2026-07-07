import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/utils/seoSchemas';

const VALID_CATEGORIES: Record<string, string> = {
  macronutrients: 'Macronutrients',
  'hydration-salts': 'Hydration & Salts',
  micronutrients: 'Micronutrients',
  'gut-digestion': 'Gut & Digestion',
  'superfoods-adaptogens': 'Superfoods & Adaptogens',
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
    { name: 'Techniques', url: '/foods' },
    { name: displayName },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
