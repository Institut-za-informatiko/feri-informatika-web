'use client';

import { Button, TextInput, useTranslation } from '@payloadcms/ui';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';

const copy = {
  sl: {
    title: 'Prijava',
    intro: 'Vpišite e-poštni naslov. Poslali vam bomo kodo za prijavo.',
    email: 'E-pošta',
    send: 'Pošlji kodo',
    sending: 'Pošiljam …',
    sentTo: 'Kodo za prijavo smo poslali na',
    junk: 'Nujno preverite tudi mapo Neželena pošta (Junk). Sporočilo pogosto pristane tam.',
    code: 'Koda iz e-pošte',
    signIn: 'Prijava',
    signingIn: 'Prijavljam …',
    wrongCode:
      'Koda ni pravilna ali je potekla. Preverite jo ali zahtevajte novo.',
    again: 'Pošlji novo kodo',
    resent: 'Nova koda je poslana.',
    change: 'Uporabi drug naslov',
    failed: 'Pošiljanje ni uspelo. Poskusite znova čez nekaj minut.',
    or: 'ali',
    passkey: 'Prijava s passkeyjem',
    passkeyFailed: 'Prijava s passkeyjem ni uspela. Uporabite kodo po e-pošti.',
  },
  en: {
    title: 'Sign in',
    intro: "Enter your email address and we'll send you a sign-in code.",
    email: 'Email',
    send: 'Send code',
    sending: 'Sending …',
    sentTo: 'We sent a sign-in code to',
    junk: 'Be sure to check your Junk / Spam folder too. The email often ends up there.',
    code: 'Code from the email',
    signIn: 'Sign in',
    signingIn: 'Signing in …',
    wrongCode:
      'The code is wrong or has expired. Check it or request a new one.',
    again: 'Send a new code',
    resent: 'A new code is on its way.',
    change: 'Use a different address',
    failed: 'Sending failed. Please try again in a few minutes.',
    or: 'or',
    passkey: 'Sign in with a passkey',
    passkeyFailed: 'Passkey sign-in failed. Use the emailed code instead.',
  },
};

type Step = 'email' | 'sending' | 'code' | 'verifying' | 'failed';

const error = (text: string) => (
  <p style={{ margin: 0, color: 'var(--theme-error-500)' }}>{text}</p>
);

/** Passwordless sign-in on /admin/login: an emailed code, or a saved passkey. */
export function SignInForm() {
  const { i18n } = useTranslation();
  const t = i18n.language === 'en' ? copy.en : copy.sl;
  const target = useSearchParams().get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [codeError, setCodeError] = useState(false);
  const [resent, setResent] = useState(false);
  const [passkeyError, setPasskeyError] = useState(false);

  // After a passkey ceremony, go to the admin as soon as a session exists. The session is
  // checked as well, because on iOS the autofill promise can settle without data even though
  // the server already signed the person in.
  const finishPasskey = async (error: unknown) => {
    if (!error || (await authClient.getSession()).data) {
      window.location.assign(target);
      return true;
    }
    return false;
  };

  // Offer saved passkeys in the email field's autofill as soon as the page opens.
  useEffect(() => {
    (async () => {
      if (!(await PublicKeyCredential?.isConditionalMediationAvailable?.()))
        return;
      const { error } = await authClient.signIn.passkey({ autoFill: true });
      await finishPasskey(error);
    })().catch(() => {});
    // Once per page load (finishPasskey only reads the redirect target).
  }, []);

  const sendCode = async (again = false) => {
    if (!again) setStep('sending');
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim(),
      type: 'sign-in',
    });
    // Unknown addresses look the same as known ones; only transport/rate-limit errors show.
    if (error) return setStep('failed');
    setStep('code');
    setResent(again);
    setCodeError(false);
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setStep('verifying');
    const { error } = await authClient.signIn.emailOtp({
      email: email.trim(),
      otp: code.replace(/\D/g, ''),
    });
    if (error) {
      setCodeError(true);
      setStep('code');
    } else window.location.assign(target);
  };

  const signInWithPasskey = async () => {
    setPasskeyError(false);
    const { error } = await authClient.signIn.passkey();
    if (!(await finishPasskey(error))) setPasskeyError(true);
  };

  const grid = { display: 'grid', gap: 'calc(var(--base) * 0.75)' } as const;

  if (step === 'code' || step === 'verifying') {
    return (
      <form onSubmit={verify} style={grid}>
        <h2 style={{ margin: 0 }}>{t.title}</h2>
        <p style={{ margin: 0 }}>
          {t.sentTo} <strong>{email.trim()}</strong>.
        </p>
        <p
          role="note"
          style={{
            margin: 0,
            padding: 'calc(var(--base) * 0.5) calc(var(--base) * 0.75)',
            borderRadius: 'var(--style-radius-m)',
            background: 'var(--theme-warning-100)',
            color: 'var(--theme-warning-900)',
            fontWeight: 600,
          }}
        >
          {t.junk}
        </p>
        <TextInput
          path="code"
          label={t.code}
          required
          value={code}
          onChange={(e: { target: { value: string } }) =>
            setCode(e.target.value)
          }
          htmlAttributes={{ autoComplete: 'one-time-code' }}
        />
        {codeError && error(t.wrongCode)}
        <Button
          type="submit"
          disabled={
            step === 'verifying' || code.replace(/\D/g, '').length !== 6
          }
        >
          {step === 'verifying' ? t.signingIn : t.signIn}
        </Button>
        <Button
          buttonStyle="secondary"
          type="button"
          onClick={() => setStep('email')}
        >
          {t.change}
        </Button>
        <Button
          buttonStyle="subtle"
          type="button"
          onClick={() => sendCode(true)}
        >
          {t.again}
        </Button>
        {resent && (
          <p style={{ margin: 0, color: 'var(--theme-success-500)' }}>
            {t.resent}
          </p>
        )}
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendCode();
      }}
      style={grid}
    >
      <h2 style={{ margin: 0 }}>{t.title}</h2>
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
      {step === 'failed' && error(t.failed)}
      <Button type="submit" disabled={step === 'sending' || !email.trim()}>
        {step === 'sending' ? t.sending : t.send}
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
      <Button buttonStyle="secondary" type="button" onClick={signInWithPasskey}>
        {t.passkey}
      </Button>
      {passkeyError && error(t.passkeyFailed)}
    </form>
  );
}
