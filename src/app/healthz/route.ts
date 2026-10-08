/** Liveness probe for Docker and the deploy script. */
export function GET() {
  return new Response('ok\n', { headers: { 'content-type': 'text/plain' } });
}
