import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import {
  type JSXConvertersFunction,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react';
import { toImage } from '@/lib/media';
import { CmsImage } from './CmsImage';

/** Uploaded images inside rich text render like every other CMS image (srcset, same-origin URLs). */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const img = toImage(node.value);
    return img ? <CmsImage src={img} /> : null;
  },
});

export function RichText({
  data,
  className,
}: {
  data: unknown;
  className?: string;
}) {
  if (!data || typeof data !== 'object') return null;
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      converters={converters}
      className={className}
    />
  );
}
