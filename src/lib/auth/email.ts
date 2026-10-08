import { Resend } from 'resend';

const from =
  process.env.MAIL_FROM || 'Inštitut za informatiko <noreply@cms.bclabum.si>';
const serverURL = process.env.SERVER_URL || 'http://localhost:3000';

/** "482913" → "482 913", easier to read and type. */
const spaced = (code: string) => code.replace(/^(\d{3})(\d{3})$/, '$1 $2');

/**
 * Bilingual sign-in email with a code to type in. Deliberately no link: mail scanners
 * (Microsoft Defender at UM) open and click links in advance and would use them up.
 */
function render(code: string) {
  const shown = spaced(code);
  const text = [
    'Prijava v CMS Inštituta za informatiko',
    '',
    `Vaša koda za prijavo: ${shown}`,
    'Vpišite jo na prijavnem zaslonu. Koda velja 10 minut.',
    '',
    'Če prijave niste zahtevali, to sporočilo prezrite.',
    '',
    '---',
    'Sign in to the Institute of Informatics CMS',
    `Your sign-in code: ${shown}`,
    'Enter it on the sign-in screen. The code is valid for 10 minutes.',
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
          <p style="margin:0 0 16px;color:#4a5560;line-height:1.6">Vaša koda za prijavo. Vpišite jo na prijavnem zaslonu; velja 10 minut.</p>
          <p style="margin:0 0 20px;font-size:32px;font-weight:700;letter-spacing:6px;color:#006A8E;font-family:Consolas,'SFMono-Regular',monospace">${shown}</p>
          <p style="margin:0;color:#8a949e;font-size:13px;line-height:1.6">Če prijave niste zahtevali, to sporočilo prezrite.</p>
        </td></tr>
        <tr><td style="padding:20px 28px 28px">
          <hr style="border:none;border-top:1px solid #e4e7ea;margin:0 0 16px">
          <p style="margin:0;color:#8a949e;font-size:13px;line-height:1.6">
            <strong>Sign in to the CMS:</strong> your code is <strong>${shown}</strong>, valid for
            10 minutes. If you didn't request it, ignore this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  return { text, html };
}

export async function sendSignInCodeEmail({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Local development without email: the code goes to the server log instead.
    console.info(`[auth] sign-in code for ${to}: ${code}`);
    return;
  }
  const { error } = await new Resend(key).emails.send({
    from,
    to,
    subject: `Koda za prijavo: ${spaced(code)} — Inštitut za informatiko`,
    ...render(code),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
