import { Resend } from 'resend';

const from =
  process.env.MAIL_FROM || 'Inštitut za informatiko <noreply@cms.bclabum.si>';
const serverURL = process.env.SERVER_URL || 'http://localhost:3000';

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c
  );

/** Bilingual sign-in email; Slovenian first, since that is the default language of the CMS. */
function render(url: string) {
  const link = escapeHtml(url);
  const text = [
    'Prijava v CMS Inštituta za informatiko',
    '',
    'Za prijavo odprite to povezavo (velja 15 minut, uporabite jo lahko enkrat):',
    url,
    '',
    'Če prijave niste zahtevali, to sporočilo prezrite.',
    '',
    '---',
    'Sign in to the Institute of Informatics CMS',
    'Open this link to sign in (valid for 15 minutes, single use):',
    url,
    "If you didn't request it, ignore this email.",
  ].join('\n');

  const html = `<!doctype html>
<html lang="sl"><body style="margin:0;background:#f3f4f5;font-family:'Open Sans',Arial,sans-serif;color:#1f2933">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden">
        <tr><td style="height:4px;background:#006A8E"></td></tr>
        <tr><td style="padding:28px 28px 8px">
          <img src="${serverURL}/logos/ii-logo.png" alt="Inštitut za informatiko" height="40" style="display:block">
        </td></tr>
        <tr><td style="padding:8px 28px 0">
          <h1 style="font-size:20px;margin:16px 0 8px">Prijava v CMS</h1>
          <p style="margin:0 0 20px;color:#4a5560;line-height:1.6">Kliknite gumb za prijavo. Povezava velja 15 minut in jo lahko uporabite enkrat.</p>
          <a href="${link}" style="display:inline-block;background:#006A8E;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px">Prijava</a>
          <p style="margin:20px 0 0;color:#8a949e;font-size:13px;line-height:1.6">Če prijave niste zahtevali, to sporočilo prezrite.</p>
        </td></tr>
        <tr><td style="padding:20px 28px 28px">
          <hr style="border:none;border-top:1px solid #e4e7ea;margin:0 0 16px">
          <p style="margin:0;color:#8a949e;font-size:13px;line-height:1.6">
            <strong>Sign in to the CMS:</strong> <a href="${link}" style="color:#006A8E">open this link</a>
            (valid for 15 minutes, single use). If you didn't request it, ignore this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  return { text, html };
}

export async function sendMagicLinkEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Local development without email: the link goes to the server log instead.
    console.info(`[auth] magic link for ${to}: ${url}`);
    return;
  }
  const { error } = await new Resend(key).emails.send({
    from,
    to,
    subject: 'Prijava v CMS — Inštitut za informatiko',
    ...render(url),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
