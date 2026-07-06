import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/utils/seoSchemas';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Boxing Blueprint Course' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
