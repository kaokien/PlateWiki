import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/utils/seoSchemas';

export default function TimerLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Round Timer' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
