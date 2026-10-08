'use client';

import { Button, TextInput, useTranslation } from '@payloadcms/ui';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';

const copy = {
  sl: {
    title: 'Prijava',
    intro: 'Vpišite e-poštni naslov. Poslali vam bomo povezavo za prijavo.',
    email: 'E-pošta',
    submit: 'Pošlji povezavo',
    sending: 'Pošiljam …',
    sentTo: 'Povezavo za prijavo smo poslali na',
    sentNote:
      'Če je naslov registriran v CMS-ju, bo sporočilo prispelo v nekaj sekundah. Povezava velja 15 minut. Preverite tudi mapo z neželeno pošto.',
    again: 'Pošlji znova',
    resent: 'Poslano znova.',
    change: 'Uporabi drug naslov',
    failed: 'Pošiljanje ni uspelo. Poskusite znova čez nekaj minut.',
    linkError:
      'Povezava je potekla ali je že bila uporabljena. Zahtevajte novo.',
    confirmTitle: 'Potrdite prijavo',
    confirmIntro: 'Kliknite gumb za prijavo v CMS.',
    confirm: 'Prijava',
    or: 'ali',
    passkey: 'Prijava s passkeyjem',
    passkeyFailed:
      'Prijava s passkeyjem ni uspela. Uporabite povezavo po e-pošti.',
  },
  en: {
    title: 'Sign in',
    intro: "Enter your email address and we'll send you a sign-in link.",
    email: 'Email',
    submit: 'Send link',
    sending: 'Sending …',
    sentTo: 'We sent a sign-in link to',
    sentNote:
      'If the address is registered in the CMS, the email arrives within seconds. The link is valid for 15 minutes. Check your spam folder too.',
    again: 'Send again',
    resent: 'Sent again.',
    change: 'Use a different address',
    failed: 'Sending failed. Please try again in a few minutes.',
    linkError: 'The link has expired or was already used. Request a new one.',
    confirmTitle: 'Confirm sign-in',
    confirmIntro: 'Click the button to sign in to the CMS.',
    confirm: 'Sign in',
    or: 'or',
    passkey: 'Sign in with a passkey',
    passkeyFailed: 'Passkey sign-in failed. Use the emailed link instead.',
  },
};

/** Passwordless sign-in shown on /admin/login (replaces the password form). */
export function MagicLinkLogin() {
  const { i18n } = useTranslation();
  const t = i18n.language === 'en' ? copy.en : copy.sl;
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<
    'idle' | 'sending' | 'sent' | 'resent' | 'failed'
  >('idle');

  const [passkeyError, setPasskeyError] = useState(false);
  const target = params.get('redirect') || '/admin';
  const token = params.get('token');

  // Offer saved passkeys in the email field's autofill as soon as the page opens.
  useEffect(() => {
    if (token) return;
    let cancelled = false;
    (async () => {
      if (!(await PublicKeyCredential?.isConditionalMediationAvailable?.()))
        return;
      const { error } = await authClient.signIn.passkey({ autoFill: true });
      if (!cancelled && !error) window.location.assign(target);
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [target, token]);

  const signInWithPasskey = async () => {
    setPasskeyError(false);
    const { error } = await authClient.signIn.passkey();
    if (error) setPasskeyError(true);
    else window.location.assign(target);
  };

  const send = async (again = false) => {
    setState('sending');
    const { error } = await authClient.signIn.magicLink({
      email: email.trim(),
      callbackURL: target,
      errorCallbackURL: '/admin/login?error=link',
    });
    // Unknown addresses look the same as known ones; only transport/rate-limit errors show.
    setState(error ? 'failed' : again ? 'resent' : 'sent');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  // Arrived from the email: spend the single-use token only on an explicit click, so mail
  // scanners that open links in advance cannot use it up.
  if (token) {
    const verify = new URLSearchParams({
      token,
      callbackURL: target,
      errorCallbackURL: '/admin/login?error=link',
    });
    return (
      <div style={{ display: 'grid', gap: 'calc(var(--base) * 0.75)' }}>
        <h2 style={{ margin: 0 }}>{t.confirmTitle}</h2>
        <p style={{ margin: 0 }}>{t.confirmIntro}</p>
        <Button
          type="button"
          onClick={() =>
            window.location.assign(`/api/auth/magic-link/verify?${verify}`)
          }
        >
          {t.confirm}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{ display: 'grid', gap: 'calc(var(--base) * 0.75)' }}
    >
      <h2 style={{ margin: 0 }}>{t.title}</h2>
      {params.get('error') && (
        <p style={{ color: 'var(--theme-error-500)' }}>{t.linkError}</p>
      )}

      {state === 'sent' || state === 'resent' ? (
        <>
          <p style={{ margin: 0 }}>
            {t.sentTo} <strong>{email.trim()}</strong>.
          </p>
          <p style={{ margin: 0, color: 'var(--theme-elevation-600)' }}>
            {t.sentNote}
          </p>
          <Button
            buttonStyle="secondary"
            type="button"
            onClick={() => setState('idle')}
          >
            {t.change}
          </Button>
          <Button buttonStyle="subtle" type="button" onClick={() => send(true)}>
            {t.again}
          </Button>
          {state === 'resent' && (
            <p style={{ margin: 0, color: 'var(--theme-success-500)' }}>
              {t.resent}
            </p>
          )}
        </>
      ) : (
        <>
          <p style={{ margin: 0 }}>{t.intro}</p>
          <TextInput
            path="email"
            label={t.email}
            required
            value={email}
            onChange={(e: { target: { value: string } }) =>
              setEmail(e.target.value)
            }
            htmlAttributes={{ autoComplete: 'username webauthn' }}
          />
          {state === 'failed' && (
            <p style={{ color: 'var(--theme-error-500)' }}>{t.failed}</p>
          )}
          <Button type="submit" disabled={state === 'sending' || !email.trim()}>
            {state === 'sending' ? t.sending : t.submit}
          </Button>
          <p
            style={{
              margin: 0,
              textAlign: 'center',
              color: 'var(--theme-elevation-500)',
            }}
          >
            {t.or}
          </p>
          <Button
            buttonStyle="secondary"
            type="button"
            onClick={signInWithPasskey}
          >
            {t.passkey}
          </Button>
          {passkeyError && (
            <p style={{ color: 'var(--theme-error-500)' }}>{t.passkeyFailed}</p>
          )}
        </>
      )}
    </form>
  );
}
