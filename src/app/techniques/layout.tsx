import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema, getItemListSchema } from '@/utils/seoSchemas';
import { techniques } from '@/data/techniques';

export default function TechniquesLayout({ children }: { children: React.ReactNode }) {
  const techniqueMap = techniques as Record<string, any>;
  const items = Object.entries(techniqueMap).map(([id, t]) => ({
    name: t.name,
    url: `/technique/${id}`,
  }));

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Techniques' },
  ]);

  const itemList = getItemListSchema(items);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={itemList} />
      {children}
    </>
  );
}
