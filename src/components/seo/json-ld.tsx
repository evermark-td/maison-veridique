/**
 * Renders one or more JSON-LD blocks. Pass a single object or an array — each
 * becomes a separate <script> so validators can parse them independently.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          // JSON.stringify is safe here — the schema.org values we pass are
          // fully controlled by our own helpers, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
