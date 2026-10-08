# CMS Guide — Editor's Manual

For editors and content managers. **No coding required.**

## How to log in

1. Open **https://ii-preview.bclabum.si/admin**
2. Enter your **email address** and click **Pošlji kodo**.
3. Open the email from *noreply@cms.bclabum.si* (**check the Junk folder**, it often lands
   there) and type the 6-digit code on the sign-in screen. The code is valid for 10 minutes.
   You stay signed in for 7 days.

Why a code and not a link: the university mail system (Microsoft Defender) opens and clicks
every link in an email to check it, which would use up a one-time link before you could.

There are no passwords. Only addresses an administrator has added can sign in; if no email
arrives, check your junk folder, then ask an administrator to check your account.

### Passkeys (faster sign-in)

After your first sign-in, open your account (avatar, bottom left → **Account**) and click
**Dodaj passkey**. Your phone or computer saves it with Face ID, Touch ID, Windows Hello or a
security key. Next time the login page offers the passkey right in the email field: one tap
and you are in, no code needed. You can remove passkeys on the same page. Passkeys are tied to the site's
address; if the site moves to a new domain, add them again.

## Roles

| Role | Can do |
|---|---|
| **Urednik** (editor) | Create, edit, publish and delete all content and media |
| **Administrator** | Everything an editor can, plus manage user accounts |

Administrators add people under **Administracija → Uporabniki → Create New** (email, name,
role). Unticking **Lahko se prijavi** signs the person out immediately and blocks new sign-ins,
without deleting the account.

## What can you edit?

| Group | Collection | Where it appears |
|---|---|---|
| Vsebina | **Novice** | /news, home page, "latest news" boxes |
| Vsebina | **Dosežki** | /achievements |
| Vsebina | **Osebje** | /staff |
| Vsebina | **Mediji** | Images used anywhere on the site |
| Raziskovanje | **Laboratoriji**, **Projekti**, **Konference**, **Etična mnenja** | /laboratories, /research, /conferences |
| Študij | **Študijski programi**, **Študentski projekti**, **Interesne skupine** | /studies, /interest-groups |
| Sodelovanje | **Industrijski partnerji** | /industry |
| Naslovnica | **Drsniki**, **Izpostavljeno** | Home page slider and highlighted items |
| Strani | **O inštitutu**, **Raziskovalna skupina**, **Strani** | /about, /research/group, publications, ethics pages, … |

## Drafts, preview and publishing

News, achievements, staff, text pages, **O inštitutu** and **Raziskovalna skupina** have **drafts**:

- While you edit, your changes are **saved automatically as a draft**. Nothing changes on
  the website.
- **Live Preview** (button at the top of the editor) shows the real page next to the form
  and updates as you type. Switch between phone, tablet and desktop width there.
- **Preview** opens the draft page in a new tab.
- **Publish changes** makes the draft public. The website shows it **immediately**.
- **Unpublish** (in the ⋯ menu) takes an entry off the website without deleting it.
- **Versions** (tab at the top of an entry) shows earlier versions and lets you restore one.

Other collections have no drafts: **Save** publishes immediately.

## Slovenian and English

Every entry has two tabs next to the publish button: **Slovenščina | English**.

- Click **English** to translate: the fields switch to the English version (empty until you
  fill them in). Live Preview switches to the English page at the same time.
- An orange dot on a tab means that language has no translation yet.
- Slovenian is the main language and is required. English is optional: any field left empty
  in English shows the Slovenian text on the `/en/` pages.
- To start from the Slovenian text, use **⋮ → Copy to locale** (copies the Slovenian content
  into English, which you then translate).
- Images, dates, emails and links are shared between both languages.
- Publish in each language you changed: **Publish changes** publishes the language you are
  viewing.

## Common tasks

### Add a news article

1. **Novice → Create New**
2. Fill in **Naslov**, **Povzetek** and **Vsebina**. Set **Datum** and **Oznake** in the sidebar.
3. **Naslovna slika**: upload or pick an image. **Galerija**: add more images.
4. **Slug (URL)** fills in from the title if you leave it empty.
5. Check it in **Live Preview**, then **Publish changes**.

### Add a staff member

1. **Osebje → Create New**
2. Fill in name, role, contact details and photo. Pick a **Skupina** (group) in the sidebar.
   **Nekdanji sodelavci** moves the person to the "former staff" list.
3. **Sekcije profila**: add one section per topic (e.g. "Življenjepis", "Pedagoško delo"),
   each with a heading and rich text.
4. **Publish changes**.

### Edit a text page (publications, ethics committee, …)

**Strani**: open the page by its title. **Pot (URL)** is its address on the site; don't change
it unless you also want the address to change.

### Change what is highlighted on the home page

**Naslovnica → Izpostavljeno**: pick 2–5 news items, 2–3 achievements and 2–3 projects.

### Images

- Upload JPG, PNG or WebP. The CMS creates smaller versions automatically, so there is no
  need to resize beforehand.
- Fill in **Opis slike (alt)**. It describes the image for screen readers.
- Drag the focal point to the important part of the image so crops keep it in view.

### Videos

Achievements accept video links (**Videoposnetki**): either a full URL (e.g. YouTube) or a
path to a file on the site, such as `/assets/media/video.mp4`.

## Need help?

Contact an administrator of the CMS.
