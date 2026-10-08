'use client';

import {
  Button,
  useAuth,
  useDocumentInfo,
  useTranslation,
} from '@payloadcms/ui';
import { useCallback, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';

type Passkey = { id: string; name?: string | null; createdAt: string | Date };

const copy = {
  sl: {
    title: 'Passkeyji',
    intro:
      'Prijava brez e-pošte s prstnim odtisom, obrazom ali varnostnim ključem. Passkey je shranjen na vaši napravi ali v upravitelju gesel.',
    none: 'Še nimate passkeyja.',
    add: 'Dodaj passkey',
    adding: 'Dodajam …',
    remove: 'Odstrani',
    confirm:
      'Odstranim ta passkey? Na tej napravi se boste nato prijavljali s povezavo po e-pošti.',
    added: 'Passkey je dodan.',
    failed: 'Dodajanje ni uspelo ali je bilo preklicano.',
    unsupported: 'Ta brskalnik ne podpira passkeyjev.',
    created: 'dodan',
  },
  en: {
    title: 'Passkeys',
    intro:
      'Sign in without email using your fingerprint, face or a security key. The passkey is stored on your device or in your password manager.',
    none: "You don't have a passkey yet.",
    add: 'Add passkey',
    adding: 'Adding …',
    remove: 'Remove',
    confirm:
      'Remove this passkey? You will then sign in on that device with an emailed link.',
    added: 'Passkey added.',
    failed: 'Adding the passkey failed or was cancelled.',
    unsupported: "This browser doesn't support passkeys.",
    created: 'added',
  },
};

/** Lets users manage their own passkeys; shown on their own account only. */
export function PasskeyManager() {
  const { user } = useAuth();
  const { id } = useDocumentInfo();
  const { i18n } = useTranslation();
  const t = i18n.language === 'en' ? copy.en : copy.sl;
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [status, setStatus] = useState<'idle' | 'adding' | 'added' | 'failed'>(
    'idle'
  );
  const supported =
    typeof window !== 'undefined' && 'PublicKeyCredential' in window;

  const load = useCallback(async () => {
    const { data } = await authClient.passkey.listUserPasskeys();
    setPasskeys((data as Passkey[] | null) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Passkeys belong to the signed-in person; admins editing someone else see nothing here.
  if (!user || String(user.id) !== String(id)) return null;

  const add = async () => {
    setStatus('adding');
    // No `name`: the authenticator must store the email as the account name.
    const res = await authClient.passkey.addPasskey();
    setStatus(res?.error ? 'failed' : 'added');
    await load();
  };

  const remove = async (passkeyId: string) => {
    if (!window.confirm(t.confirm)) return;
    await authClient.passkey.deletePasskey({ id: passkeyId });
    await load();
  };

  const locale = i18n.language === 'en' ? 'en-GB' : 'sl-SI';

  return (
    <div
      className="field-type"
      style={{ marginBlock: 'calc(var(--base) * 1.5)' }}
    >
      <h3 style={{ marginBottom: 'calc(var(--base) * 0.5)' }}>{t.title}</h3>
      <p
        style={{
          marginBottom: 'var(--base)',
          color: 'var(--theme-elevation-600)',
        }}
      >
        {t.intro}
      </p>

      {passkeys.length === 0 ? (
        <p>{t.none}</p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 var(--base)',
            display: 'grid',
            gap: 8,
          }}
        >
          {passkeys.map((p) => (
            <li
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 14px',
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: 'var(--style-radius-m)',
              }}
            >
              <span>
                <strong>{p.name || 'Passkey'}</strong>
                <span style={{ color: 'var(--theme-elevation-500)' }}>
                  {' '}
                  · {t.created}{' '}
                  {new Date(p.createdAt).toLocaleDateString(locale)}
                </span>
              </span>
              <Button
                buttonStyle="secondary"
                size="small"
                onClick={() => remove(p.id)}
              >
                {t.remove}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {supported ? (
        <Button onClick={add} disabled={status === 'adding'}>
          {status === 'adding' ? t.adding : t.add}
        </Button>
      ) : (
        <p>{t.unsupported}</p>
      )}
      {status === 'added' && (
        <p style={{ color: 'var(--theme-success-500)' }}>{t.added}</p>
      )}
      {status === 'failed' && (
        <p style={{ color: 'var(--theme-error-500)' }}>{t.failed}</p>
      )}
    </div>
  );
}
