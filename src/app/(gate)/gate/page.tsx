import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n/translations';
import { safeNext } from '@/lib/site-gate';
import { unlock } from './actions';

const t = getTranslations('sl');

export const metadata = {
  title: `${t('gate.title')} — ${t('site.name')}`,
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function GatePage({ searchParams }: Props) {
  const { next, error } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center bg-brand-dark p-4 text-primary-foreground">
      <form
        action={unlock}
        className="flex w-full max-w-sm flex-col gap-6 rounded-3xl bg-card p-7 text-card-foreground shadow-2xl sm:p-9"
      >
        <div className="flex items-center gap-3">
          {/* biome-ignore lint/performance/noImgElement: static logo */}
          <img src="/logos/ii-logo.png" alt="" className="h-10 w-auto" />
          <span className="font-heading text-lg leading-tight font-bold">
            {t('site.name')}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl leading-tight font-bold">
            {t('gate.title')}
          </h1>
          <p className="text-muted-foreground">{t('gate.lead')}</p>
        </div>
        <input type="hidden" name="next" value={safeNext(next)} />
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold">
            {t('gate.password')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            // biome-ignore lint/a11y/noAutofocus: the page has no other purpose
            autoFocus
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'password-error' : undefined}
            className="h-11 rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
          />
          {error && (
            <p
              id="password-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {t('gate.wrong')}
            </p>
          )}
        </div>
        <Button type="submit" className="h-11 text-base">
          {t('gate.submit')}
        </Button>
      </form>
    </main>
  );
}
