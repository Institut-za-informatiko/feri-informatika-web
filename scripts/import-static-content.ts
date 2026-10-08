/**
 * One-off import of the texts that used to be hardcoded in the old site's pages:
 * research text pages (collection `pages`), the English locale of the `about` and
 * `research-group` globals and the English titles of the home page slides.
 *
 *   pnpm import:static
 *
 * Safe to run again: pages are upserted by slug, globals and slides are overwritten.
 */
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical';
import { getPayload } from 'payload';
import config from '../src/payload.config';

const payload = await getPayload({ config });
const editorConfig = await editorConfigFactory.default({
  config: payload.config,
});
const lexical = (markdown: string) =>
  convertMarkdownToLexical({ editorConfig, markdown });

// Bulk writes skip the per-document cache purge.
const context = { disableRevalidate: true };

type Locale = { title: string; lead?: string; body: string };
type PageSeed = { slug: string; sl: Locale; en: Locale };

const pages: PageSeed[] = [
  {
    slug: 'research/group/areas',
    sl: {
      title: 'Raziskovalna področja',
      lead: 'Inštitut za informatiko pokriva širok spekter raziskovalnih področij, vključno z razširjenimi sistemi, umetno inteligenco, računalniškimi omrežji, razvojem programske opreme in interakcijo med človekom in računalnikom.',
      body: `## Glavna področja

- Informacijski sistemi
- Inženirstvo programske opreme
- Vdelani sistemi
- Inteligentni sistemi
- Informacijske in komunikacijske tehnologije`,
    },
    en: {
      title: 'Research Areas',
      lead: 'The Institute of Informatics covers a wide range of research areas, including distributed systems, artificial intelligence, computer networks, software development and human-computer interaction.',
      body: `## Main Areas

- Information Systems
- Software Engineering
- Embedded Systems
- Intelligent Systems
- Information and Communication Technologies`,
    },
  },
  {
    slug: 'research/group/sicris',
    sl: {
      title: 'Povezava do SICRIS-a',
      lead: 'Vse informacije o raziskovalni skupini, vključno s člani in bibliografskimi zapisi, so na voljo v nacionalnem sistemu SICRIS.',
      body: `## Zunanji vir

[Oglej si SICRIS →](https://www.sicris.si/)`,
    },
    en: {
      title: 'Link to SICRIS',
      lead: 'Full information about the research group, including members and bibliographic records, is available in the national SICRIS system.',
      body: `## External Resource

[View SICRIS →](https://www.sicris.si/)`,
    },
  },
  {
    // The programme description is long, so it goes into the body instead of the lead.
    slug: 'research/publications',
    sl: {
      title: 'Publikacije',
      body: `Raziskovalni program (RP) celovito naslavlja področje obvladovanja kompleksnosti in zagotavljanja kakovosti pri zasnovi, razvoju, implementaciji, vpeljavi ter upravljanju informacijskih sistemov (IS) in storitev. Usmerjen je v razvoj novih pristopov, metod, tehnologij, konceptov in algoritmov na področjih, ki omogočajo in spodbujajo proces digitalne preobrazbe. V vseh fazah življenjskega cikla razvoja IS kompleksnost vse bolj narašča. Tako smo priča izjemnemu naraščanju priliva in obsega podatkov ter večanju njihove raznolikosti. Podatki so vse bolj raznovrstni, nestrukturirani in porazdeljeni po heterogenih virih, v katerih z vse večjo hitrostjo nastajajo. Obvladovanje kompleksnosti obdelave podatkov je tako prva ključna naloga, ki predstavlja osnovo vsem ostalim aktivnostim. Da bi informacijske tehnologije (IT) lahko sledile rasti obsega, raznolikosti ter hitrosti dotoka podatkov, njihov razvoj zahteva vpeljavo vse bolj kompleksnih arhitektur, na katerih temeljijo sodobni IS. Kot drugo ključno nalogo RP želimo zato nasloviti izzive učinkovitosti, skladnosti, skalabilnosti in interoperabilnosti arhitektur IS. Sodobne tehnologije in pristopi k razvoju IS so tesno povezani z vzpostavitvijo zveznega, po možnosti neprekinjenega procesa, ki skrajša čas od poslovnih idej do njihove implementacije, na osnovi spremljanja in nadzora razvitih storitev pa vodi do njihovega izboljševanja in nadgradnje. Zagotavljanje učinkovitih modelov in ogrodij za razvoj IS in na IKT temelječih storitev je tako tretja ključna naloga RP. Z vidika vse večje vključenosti uporabnikov, zadovoljevanja njihovih zahtev in prilagajanja njihovim vlogam je ključno razumevanje kontekstno odvisnih, uporabniško usmerjenih procesov. Ustrezno modeliranje takšnih procesov omogoča njihovo poenostavitev in predstavlja prvo operativno področje delovanja RP. Drugo operativno področje združuje raziskave na področju inteligentnih sistemov. Pridobljena spoznanja in rešitve lahko uporabimo za pomensko integracijo in razvoj nizko kompleksnih napovednih modelov. Z njimi lažje odkrivamo značilnosti podatkov, procesov in njihov vpliv na vire ter optimiziramo posamezne faze procesa razvoja IS, s čimer zmanjšamo njihovo kompleksnost. Tretje področje dela naslavlja zagotavljanje kakovosti IS z vidika varnosti in zasebnosti v celotnem življenjskem ciklu IS. Rezultati raziskav na četrtem področju načrtovanja kiber-fizikalnih sistemov so namenjeni predvsem povečanju zanesljivosti in varnosti. Zaradi navedenega je učinkovito obvladovanje kompleksnosti ključno za zagotavljanje kakovosti in vzdržen razvoj, ki ga naslavljamo z definiranjem in sistematično vpeljavo modelov vrednotenja kakovosti skozi celoten proces razvoja IS. Kakovost uporabniške izkušnje predstavlja še zadnje operativno področje, kjer bomo med drugim naslovili tudi uporabnike s posebnimi potrebami. Združeni dosežki vseh predlaganih področij bodo omogočili doseganje temeljnega cilja IS – s perspektive uporabnika bolj kakovostno sprejemanje odločitev, s perspektive razvijalca pa lažje obvladljiv proces razvoja.

## Zunanji vir

[Oglejte si publikacije v COBISS-u →](https://cris.cobiss.net/ecris/si/sl/rest)`,
    },
    en: {
      title: 'Publications',
      body: `The research programme comprehensively addresses the management of complexity and quality assurance in the design, development, implementation and management of information systems (IS) and services. It focuses on developing new approaches, methods, technologies, concepts and algorithms in areas that enable and promote digital transformation.

## External Resource

[Publications (COBISS) →](https://cris.cobiss.net/ecris/si/sl/rest)`,
    },
  },
  {
    slug: 'research/ethics',
    sl: {
      title: 'Odbor za raziskovalno etiko',
      body: `## Informacije

- [Naloge in delovanje odbora](/research/ethics/mandate)
- [Predloži zahteve in odločitve odbora](/research/ethics/submissions)`,
    },
    en: {
      title: 'Research Ethics Committee',
      body: `## Information

- [Tasks and functioning of the Committee](/en/research/ethics/mandate)
- [Submission of applications and decisions](/en/research/ethics/submissions)`,
    },
  },
  {
    slug: 'research/ethics/mandate',
    sl: {
      title: 'Naloge in delovanje odbora',
      body: `## O odboru

Etični odbor Instituta za informacije spremlja etično ravnanje v vseh raziskovalnih aktivnostih, ki se izvajajo znotraj instituta.

## Naloge odbora

Odbor pregleduje predloge raziskav, izdaja mnenja in spremlja spoštovanje etičnih standardov skozi celoten raziskovalni cikel.`,
    },
    en: {
      title: 'Tasks and Functioning of the Committee',
      body: `## About the Committee

The Research Ethics Committee of the Institute of Informatics oversees ethical conduct across all research activities carried out within the institute.

## Committee Mandate

The Committee reviews research proposals, issues opinions, and monitors compliance with ethical standards throughout the entire research lifecycle.`,
    },
  },
  {
    slug: 'research/ethics/submissions',
    sl: {
      title: 'Vložitev vlog in odločitve',
      lead: 'Raziskovalci, ki želijo predložiti zahtevek za etično pregled, morajo izpolniti standardno obliko in jo predložiti sekretariatu odbora.',
      body: `## Odločitve

Odločitve so objavljene v tabeli mnenj na [glavna stran Etike komisije](/research/ethics).`,
    },
    en: {
      title: 'Submission of Applications and Decisions',
      lead: 'Researchers wishing to submit an application for ethical review must complete the standard form and submit it to the Committee secretariat.',
      body: `## Decisions

Decisions are published in the opinions table on the [main Ethics Committee page](/en/research/ethics).`,
    },
  },
];

const pageData = (l: Locale) => ({
  title: l.title,
  lead: l.lead ?? null,
  body: lexical(l.body),
  _status: 'published' as const,
});

let created = 0;
let updated = 0;
for (const seed of pages) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: seed.slug } },
    locale: 'sl',
    limit: 1,
    depth: 0,
  });
  const id = docs[0]
    ? (
        await payload.update({
          collection: 'pages',
          id: docs[0].id,
          locale: 'sl',
          data: pageData(seed.sl),
          context,
        })
      ).id
    : (
        await payload.create({
          collection: 'pages',
          locale: 'sl',
          data: { slug: seed.slug, ...pageData(seed.sl) },
          context,
        })
      ).id;
  if (docs[0]) updated++;
  else created++;
  await payload.update({
    collection: 'pages',
    id,
    locale: 'en',
    data: pageData(seed.en),
    context,
  });
}
console.log(`pages: ${created} created, ${updated} updated (sl + en)`);

await payload.updateGlobal({
  slug: 'about',
  locale: 'en',
  data: {
    title: 'Institute of Informatics',
    subtitle:
      'Faculty of Electrical Engineering, Computer Science and Information Science · University of Maribor',
    body: lexical(`The Institute of Informatics conducts research in the field of informatics aimed at the effective development and management of safe, intelligent and reliable information systems, solutions and services. The focus of the research work is on data engineering and big data, artificial intelligence and intelligent systems, cyber, information and digital security and privacy, software engineering and agile development and process automation, centralized and decentralized architectures and systems.

At UM FERI, the Institute of Informatics is the main provider of education in undergraduate and postgraduate programs in Informatics and Data Technologies.

As part of our research in the field of IS architectures, we explore decentralized, cloud, big data, microservices and serverless architectures; data warehouses, data lakes and data spaces, and decentralized AI networks and systems.

Research in the broader field of intelligent systems addresses the challenges of the growing scale, complexity and multimodality of data, biased and unfair decisions of AI models, the need for customized machine learning solutions, and the challenges of models in production environments (MLOps/AI engineering).

We develop advanced approaches to IS development using intelligent components in the cloud, with a particular focus on DevSecOps practices, including CI/CD automation that ensures continuous testing, enforcement of secure code practices, and metric-based quality assessment.

Research in the field of cybersecurity and privacy focuses on the evaluation of approaches to improving system security and privacy, modern centralized and decentralized authentication methods, and proactive approaches to detecting and preventing cyber threats, including the use of artificial intelligence.

The research work in the field of business process management deals with a dynamic view of modern information solutions driven by advanced approaches to process modeling, flexible and unstructured process modeling, and process mining.`),
  },
  context,
});
console.log('about: en updated');

await payload.updateGlobal({
  slug: 'research-group',
  locale: 'en',
  data: {
    body: lexical(
      'The Institute of Informatics brings together an active research group working in the field of information systems development and management. Researchers collaborate on numerous national and international projects and publish results in leading scientific journals and conferences. The group covers a broad spectrum of areas, from artificial intelligence and data technologies to cybersecurity and software engineering.'
    ),
  },
  context,
});
console.log('research-group: en updated');

// The old English home page showed these with images hero-1/2/3.jpg in this order.
const enSlides = [
  {
    image: 'hero-1.jpg',
    title: 'Institute of Informatics',
    subtitle:
      'Research that shapes safe, intelligent and reliable information systems, solutions and services.',
  },
  {
    image: 'hero-2.jpg',
    title: 'Study Informatics & Data Technologies',
    subtitle:
      'Undergraduate and postgraduate programmes combining theory with hands-on industry practice.',
  },
  {
    image: 'hero-3.jpg',
    title: 'Research with Real Impact',
    subtitle:
      'From AI and cybersecurity to decentralized systems — our work shapes the technology of tomorrow.',
  },
];

const { docs: slides } = await payload.find({
  collection: 'hero-slides',
  sort: 'order',
  locale: 'sl',
  depth: 1,
  pagination: false,
});
const imageName = (image: unknown) =>
  image && typeof image === 'object' && 'filename' in image
    ? image.filename
    : undefined;
let slideCount = 0;
for (const [i, slide] of slides.entries()) {
  // The SL slides were reordered, so match by image; fall back to position.
  const en =
    enSlides.find((s) => s.image === imageName(slide.image)) ?? enSlides[i];
  if (!en) continue;
  await payload.update({
    collection: 'hero-slides',
    id: slide.id,
    locale: 'en',
    data: { title: en.title, subtitle: en.subtitle },
    context,
  });
  slideCount++;
}
console.log(`hero-slides: ${slideCount} of ${slides.length} en updated`);

process.exit(0);
