import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload';

const REPO = 'Institut-za-informatiko/feri-informatika-web';
const DEBOUNCE_MS = Number(process.env.REBUILD_DEBOUNCE_MS ?? 60_000);

let timer: NodeJS.Timeout | undefined;

/**
 * The public site is a static build, so content changes only show up after CI rebuilds it.
 * Bursts of saves (e.g. an editor fixing typos) collapse into one GitHub repository_dispatch.
 */
function scheduleRebuild(req: PayloadRequest, reason: string) {
  // Bulk imports set this so thousands of writes do not each schedule a build.
  if (req.context?.skipRebuild) return;

  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!token) {
    req.payload.logger.info(
      `rebuild skipped (no GITHUB_DISPATCH_TOKEN): ${reason}`
    );
    return;
  }

  clearTimeout(timer);
  timer = setTimeout(async () => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/dispatches`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
          body: JSON.stringify({
            event_type: 'cms-publish',
            client_payload: { reason },
          }),
        }
      );
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      req.payload.logger.info(`rebuild dispatched: ${reason}`);
    } catch (err) {
      req.payload.logger.error({ err }, 'rebuild dispatch failed');
    }
  }, DEBOUNCE_MS);
}

const isDraftSave = (
  doc: { _status?: string },
  previousDoc?: { _status?: string }
) =>
  // Saving a draft of a never-published (or unpublished) doc changes nothing on the site.
  doc._status === 'draft' && previousDoc?._status !== 'published';

export const rebuildAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  collection,
  req,
}) => {
  if (!isDraftSave(doc, previousDoc))
    scheduleRebuild(req, `${collection.slug}/${doc.slug ?? doc.id}`);
  return doc;
};

export const rebuildAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  collection,
  req,
}) => {
  scheduleRebuild(req, `delete ${collection.slug}/${doc.slug ?? doc.id}`);
  return doc;
};

export const rebuildAfterGlobalChange: GlobalAfterChangeHook = ({
  doc,
  global,
  req,
}) => {
  scheduleRebuild(req, `global ${global.slug}`);
  return doc;
};

export const rebuildHooks = {
  afterChange: [rebuildAfterChange],
  afterDelete: [rebuildAfterDelete],
};
