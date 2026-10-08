import { revalidatePath } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload';

/**
 * Public pages are rendered once and cached. Any content change purges that cache
 * (Payload website template pattern), so the next request renders fresh content.
 *
 * The whole site is purged, not single paths: news, staff and projects also appear in
 * section menus, "latest news" strips and the home page, so a narrow purge would leave
 * stale copies. Pages re-render on demand, so this stays cheap.
 */
function purge(req: PayloadRequest, reason: string) {
  // Bulk scripts (imports, seeds) set this and purge once at the end.
  if (req.context?.disableRevalidate) return;
  try {
    revalidatePath('/', 'layout');
    req.payload.logger.info(`revalidated site: ${reason}`);
  } catch {
    // Outside a Next.js server (payload CLI scripts) there is no cache to purge.
  }
}

const isDraftSave = (
  doc: { _status?: string },
  previousDoc?: { _status?: string }
) =>
  // Saving a draft of something that is not live changes nothing for visitors.
  doc._status === 'draft' && previousDoc?._status !== 'published';

export const revalidateAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  collection,
  req,
}) => {
  if (!isDraftSave(doc, previousDoc))
    purge(req, `${collection.slug}/${doc.slug ?? doc.id}`);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  collection,
  req,
}) => {
  purge(req, `delete ${collection.slug}/${doc.slug ?? doc.id}`);
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({
  doc,
  previousDoc,
  global,
  req,
}) => {
  // Autosaved drafts (Live Preview) must not purge the public cache on every keystroke.
  if (!isDraftSave(doc, previousDoc)) purge(req, `global ${global.slug}`);
  return doc;
};

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
};
