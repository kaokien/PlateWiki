import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/utils/seoSchemas';

export default function WorkoutLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Workout Generator' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
