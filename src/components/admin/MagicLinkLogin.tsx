'use client';

import { Button, TextInput, useTranslation } from '@payloadcms/ui';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { authClient } from '@/lib/auth/client';

const copy = {
  sl: {
    title: 'Prijava',
    intro: 'Vpišite e-poštni naslov. Poslali vam bomo povezavo za prijavo.',
    email: 'E-pošta',
    submit: 'Pošlji povezavo',
    sending: 'Pošiljam …',
    sent: 'Če je naslov registriran, smo vam poslali povezavo za prijavo. Velja 15 minut.',
    again: 'Pošlji znova',
    failed: 'Pošiljanje ni uspelo. Poskusite znova čez nekaj minut.',
    linkError:
      'Povezava je potekla ali je že bila uporabljena. Zahtevajte novo.',
  },
  en: {
    title: 'Sign in',
    intro: "Enter your email address and we'll send you a sign-in link.",
    email: 'Email',
    submit: 'Send link',
    sending: 'Sending …',
    sent: 'If the address is registered, a sign-in link is on its way. It is valid for 15 minutes.',
    again: 'Send again',
    failed: 'Sending failed. Please try again in a few minutes.',
    linkError: 'The link has expired or was already used. Request a new one.',
  },
};

/** Passwordless sign-in shown on /admin/login (replaces the password form). */
export function MagicLinkLogin() {
  const { i18n } = useTranslation();
  const t = i18n.language === 'en' ? copy.en : copy.sl;
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>(
    'idle'
  );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState('sending');
    const { error } = await authClient.signIn.magicLink({
      email: email.trim(),
      callbackURL: params.get('redirect') || '/admin',
      errorCallbackURL: '/admin/login?error=link',
    });
    // Unknown addresses look the same as known ones; only transport/rate-limit errors show.
    setState(error ? 'failed' : 'sent');
  };

  return (
    <form
      onSubmit={submit}
      style={{ display: 'grid', gap: 'calc(var(--base) * 0.75)' }}
    >
      <h2 style={{ margin: 0 }}>{t.title}</h2>
      {params.get('error') && (
        <p style={{ color: 'var(--theme-error-500)' }}>{t.linkError}</p>
      )}

      {state === 'sent' ? (
        <>
          <p>{t.sent}</p>
          <Button
            buttonStyle="secondary"
            onClick={() => setState('idle')}
            type="button"
          >
            {t.again}
          </Button>
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
          />
          {state === 'failed' && (
            <p style={{ color: 'var(--theme-error-500)' }}>{t.failed}</p>
          )}
          <Button type="submit" disabled={state === 'sending' || !email.trim()}>
            {state === 'sending' ? t.sending : t.submit}
          </Button>
        </>
      )}
    </form>
  );
}
