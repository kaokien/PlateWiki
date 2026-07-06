/**
 * Server-compatible JSON-LD component.
 * Renders structured data as a <script type="application/ld+json"> tag
 * in the initial HTML — visible to Google's Rich Results crawler.
 *
 * This is intentionally NOT a client component. It must be rendered
 * server-side so structured data appears in the raw HTML response.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
