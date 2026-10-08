/** Institute logo in place of the Payload logo (admin login screen and navigation). */
export function Logo() {
  return (
    // biome-ignore lint/performance/noImgElement: static logo in the admin panel
    <img
      src="/logos/ii-logo.png"
      alt="Inštitut za informatiko"
      style={{ height: 72, width: 'auto' }}
    />
  );
}

export function Icon() {
  return (
    // biome-ignore lint/performance/noImgElement: static logo in the admin panel
    <img
      src="/logos/ii-logo.png"
      alt=""
      style={{ height: 28, width: 'auto' }}
    />
  );
}
