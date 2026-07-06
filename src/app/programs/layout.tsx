import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/utils/seoSchemas';

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Training Programs' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
