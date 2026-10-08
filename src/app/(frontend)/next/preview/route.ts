import config from '@payload-config';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';

/**
 * Entry point for Preview / Live Preview (Payload docs pattern): only a logged-in CMS user
 * with the preview secret can switch on draft mode, then lands on the requested page.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') ?? '/';
  const secret = url.searchParams.get('secret');

  if (
    !process.env.PREVIEW_SECRET ||
    secret !== process.env.PREVIEW_SECRET ||
    !path.startsWith('/')
  ) {
    return new Response('Invalid preview request', { status: 403 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user)
    return new Response('Log in to the CMS to preview drafts', { status: 403 });

  (await draftMode()).enable();
  redirect(path);
}
