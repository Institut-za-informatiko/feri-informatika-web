export const languages = {
  sl: 'SL',
  en: 'EN',
};

export const defaultLang = 'sl';

export const locales = ['sl', 'en'] as const;

export const translations = {
  sl: {
    // ── Navigation ──────────────────────────────────────────────
    'nav.about': 'O inštitutu',
    'nav.research': 'Raziskovanje',
    'nav.studies': 'Študij IPT & ITK',
    'nav.conferences': 'Konferenčne aktivnosti',
    'nav.industry': 'Industrija',
    'nav.achievements': 'Dosežki',
    'nav.news': 'Novice',
    'nav.menu': 'Meni',
    'nav.close': 'Zapri meni',
    'nav.language': 'Jezik',
    'nav.home': 'Inštitut za informatiko — domov',
    'site.name': 'Inštitut za informatiko',
    'site.faculty':
      'Fakulteta za elektrotehniko, računalništvo in informatiko · Univerza v Mariboru',
    'gallery.open': 'Odpri sliko',
    'gallery.of': 'od',
    'section.menu': 'Meni razdelka',

    // ── Common ──────────────────────────────────────────────────
    'common.filter': 'Filter',
    'common.all': 'Vse',
    'common.backTo': 'Nazaj na',
    'common.latestNews': 'Najnovejše novice',
    'common.readMore': 'Preberi več',
    'common.noContent': 'Ni vsebine za prikaz.',

    // ── Home ────────────────────────────────────────────────────
    'home.highlightedNews': 'Izpostavljene novice',
    'home.highlightedAchievements': 'Izpostavljeni dosežki',
    'home.highlightedProjects': 'Izpostavljeni projekti',

    // ── About ───────────────────────────────────────────────────
    'about.title': 'O inštitutu',
    'about.sidebar.labs': 'Laboratoriji',
    'about.sidebar.groups': 'Interesne skupine',
    'about.sidebar.staff': 'Osebje',
    'about.contact': 'Kontakt',
    'about.email': 'E-pošta',
    'about.address': 'Naslov',
    'about.phone': 'Telefon',
    'about.web': 'Splet',

    // ── Laboratories ─────────────────────────────────────────────
    'labs.intro':
      'Inštitut za informatiko izvaja raziskave na področju informacijskih sistemov, rešitev in storitev, ki temeljijo na uporabi informacijskih in komunikacijskih tehnologij.',
    'labs.listTitle': 'Laboratoriji inštituta',
    'labs.researchAreas': 'Raziskovalna področja',
    'labs.members': 'Člani laboratorija',
    'labs.description': 'Opis',
    'labs.website': 'Spletna stran laboratorija',
    'labs.noContent': 'Ni na voljo še nobenega laboratorija.',

    // ── Interest groups ──────────────────────────────────────────
    'groups.intro':
      'Zainteresirane skupine na Inštitutu za informatiko združujejo študente in raziskovalce okoli skupnih tem ter spodbujajo sodelovanje in izmenjavo znanja tudi zunaj okvira uradnih raziskovalnih projektov.',
    'groups.listTitle': 'Interesne skupine na Inštitutu za informatiko',
    'groups.about': 'O skupini',
    'groups.website': 'Spletna stran skupine',
    'groups.noContent': 'Ni na voljo še nobene zainteresirane skupine.',

    // ── Research Group ───────────────────────────────────────────
    'researchGroup.title': 'Raziskovalna skupina',
    'researchGroup.sidebar.group': 'Skupina',
    'researchGroup.sidebar.labs': 'Laboratoriji',

    // ── Research ─────────────────────────────────────────────────
    'research.title': 'Raziskovanje',
    'research.sidebar.researchGroup': 'Raziskovalna skupina',
    'research.sidebar.projects': 'Raziskovalni projekti',
    'research.sidebar.publications': 'Publikacije',
    'research.sidebar.ethics': 'Etična komisija',
    'research.activeProjects': 'Aktivni projekti',
    'research.pastProjects': 'Pretekli projekti',
    'research.noProjects': 'Ni projektov za prikaz.',
    'research.present': 'danes',
    'research.status.active': 'Aktivno',
    'research.status.past': 'Zaključeno',
    'research.sidebar.areas': 'Raziskovalna področja',
    'research.sidebar.sicris': 'Povezava do SICRIS-a',
    'research.sidebar.ethicsMandate': 'Naloge in delovanje odbora',
    'research.sidebar.ethicsSubmissions': 'Vložitev vlog in odločitve',
    'research.ethics.opinions': 'Izdana mnenja',
    'research.ethics.noOpinions': 'Mnenja še niso bila zabeležena.',
    'research.ethics.date': 'Datum',
    'research.ethics.research': 'Raziskava',
    'research.ethics.researchers': 'Raziskovalci',
    'research.ethics.decision': 'Odločitev',
    'research.project.details': 'Podrobnosti projekta',
    'research.project.status': 'Stanje',
    'research.project.period': 'Obdobje',
    'research.project.funder': 'Financer',
    'research.project.pi': 'Glavni raziskovalec',
    'research.project.description': 'Opis',
    'research.project.relatedNews': 'Povezane novice',
    'research.project.backLink': 'Nazaj na raziskovalne projekte',

    // ── Studies ──────────────────────────────────────────────────
    'studies.title': 'Študij IPT & ITK',
    'studies.sidebar.ipt': 'IPT',
    'studies.sidebar.itk': 'ITK',
    'studies.sidebar.students': 'Študentski projekti',
    'studies.noContent': 'Ni programov za prikaz.',
    'studies.programmes.title': 'Študijski programi',
    'studies.programmes.intro':
      'Inštitut za informatiko je glavni izvajalec izobraževanja v dodiplomskih in podiplomskih študijskih programih »Informatika in podatkovne tehnologije« (IPT) ter »Informacijske in komunikacijske tehnologije« (ITK).',
    'studies.programmes.available': 'Na voljo so naslednji programi',
    'studies.programmes.info': 'Informacije o programu',
    'studies.programmes.curriculum': 'Učni načrt in splošne informacije',
    'studies.programmes.external': 'Oglejte si program na moja.um.si',
    'studies.programmes.backLink': 'Nazaj na študijske programe',
    'studies.programmes.type': 'Vrsta',
    'studies.programmes.duration': 'Trajanje',
    'studies.programmes.ects': 'ECTS krediti',
    'studies.years.one': 'leto',
    'studies.years.two': 'leti',
    'studies.years.few': 'leta',
    'studies.years.other': 'let',
    'studies.activities.title': 'Študentske dejavnosti',
    'studies.activities.intro':
      'Študentje na Inštitutu za informatiko sodelujejo v številnih projektih in dejavnostih, ki dopolnjujejo formalno izobraževanje in razvijajo prakso.',
    'studies.activities.projects': 'Projekti',
    'studies.activities.noContent': 'Projektov še ni na seznamu.',
    'studies.activities.info': 'Informacije o projektu',
    'studies.activities.students': 'Študent(i)',
    'studies.activities.year': 'Leto',
    'studies.activities.details': 'Podrobnosti',
    'studies.activities.external': 'Oglejte si projekt na praktik.um.si',
    'studies.activities.backLink': 'Nazaj na študentske dejavnosti',

    // ── Conferences ──────────────────────────────────────────────
    'conferences.title': 'Konferenčne aktivnosti',
    'conferences.noContent': 'Ni konferenc za prikaz.',
    'conferences.intro':
      'Inštitut za informatiko aktivno organizira in sodeluje na mednarodnih znanstvenih konferencah v področju informatike in računalništva.',
    'conferences.details': 'Podrobnosti',
    'conferences.date': 'Datum',
    'conferences.location': 'Lokacija',
    'conferences.about': 'O konferenci',
    'conferences.website': 'Spletna stran konference',
    'conferences.backLink': 'Nazaj na konference',

    // ── Industry ─────────────────────────────────────────────────
    'industry.title': 'Industrija',
    'industry.noContent': 'Ni partnerjev za prikaz.',
    'industry.lead': 'Partnerji, s katerimi sodelujemo',
    'industry.website': 'Spletna stran',

    // ── Achievements ─────────────────────────────────────────────
    'achievements.title': 'Dosežki in aktivnosti',
    'achievements.backLink': 'Nazaj na dosežke',
    'achievements.noContent': 'Ni dosežkov za prikaz.',
    'achievements.gallery': 'Galerija',
    'achievements.videos': 'Videoposnetki',
    'achievements.openVideo': 'Odpri videoposnetek',
    'achievements.videoUnsupported':
      'Tvoj brskalnik ne podpira videoposnetkov v formatu HTML5.',

    // ── News ─────────────────────────────────────────────────────
    'news.title': 'Novice',
    'news.backLink': 'Nazaj na novice',
    'news.noContent': 'Ni novic za prikaz.',
    'news.gallery': 'Galerija',

    // ── Staff ────────────────────────────────────────────────────
    'staff.title': 'Osebje',
    'staff.section.predstojnik': 'Predstojnik inštituta',
    'staff.section.profesorji': 'Profesorji in predavatelji',
    'staff.section.asistenti': 'Asistenti in raziskovalci',
    'staff.section.tehnicno': 'Tehnično osebje',
    'staff.section.prejsnji': 'Prejšnji člani',
    'staff.former.show': 'Prikaži prejšnje člane',
    'staff.former.hide': 'Skrij prejšnje člane',
    'staff.email': 'E-pošta',
    'staff.phone': 'Telefon',
    'staff.office': 'Pisarna',
    'staff.contactHours': 'Govorilne ure',
    'staff.linkedin': 'LinkedIn',
    'staff.cobiss': 'Publikacije (COBISS)',
    'staff.backLink': 'Nazaj na osebje',
    'staff.lead': 'Akademsko in raziskovalno osebje Inštituta za informatiko',
    'staff.link': 'povezava',
    'staff.cobissText': 'Celotno poročilo je dostopno na COBISS.',
    'staff.cobissLink': 'Ogled na COBISS',

    // ── Tags ─────────────────────────────────────────────────────
    'tag.student': 'Študentsko',
    'tag.conference': 'Konferenca',
    'tag.scientific': 'Znanstveno',
    'tag.professional': 'Strokovno',
    'tag.project': 'Projekt',
    'tag.awards': 'Nagrade',
    'tag.interest-groups': 'Interesne skupine',
  },

  en: {
    // ── Navigation ──────────────────────────────────────────────
    'nav.about': 'About the Institute',
    'nav.research': 'Research',
    'nav.studies': 'Studies IPT & ITK',
    'nav.conferences': 'Conference Activities',
    'nav.industry': 'Industry',
    'nav.achievements': 'Achievements',
    'nav.news': 'News',
    'nav.menu': 'Menu',
    'nav.close': 'Close menu',
    'nav.language': 'Language',
    'nav.home': 'Institute of Informatics — home',
    'site.name': 'Institute of Informatics',
    'site.faculty':
      'Faculty of Electrical Engineering and Computer Science · University of Maribor',
    'gallery.open': 'Open image',
    'gallery.of': 'of',
    'section.menu': 'Section menu',

    // ── Common ──────────────────────────────────────────────────
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.backTo': 'Back to',
    'common.latestNews': 'Latest News',
    'common.readMore': 'Read more',
    'common.noContent': 'No content to display.',

    // ── Home ────────────────────────────────────────────────────
    'home.highlightedNews': 'Highlighted News',
    'home.highlightedAchievements': 'Highlighted Achievements',
    'home.highlightedProjects': 'Highlighted Projects',

    // ── About ───────────────────────────────────────────────────
    'about.title': 'About the Institute',
    'about.sidebar.labs': 'Laboratories',
    'about.sidebar.groups': 'Interest Groups',
    'about.sidebar.staff': 'Staff',
    'about.contact': 'Contact',
    'about.email': 'Email',
    'about.address': 'Address',
    'about.phone': 'Phone',
    'about.web': 'Web',

    // ── Laboratories ─────────────────────────────────────────────
    'labs.intro':
      'The Institute of Informatics conducts research in the field of information systems, solutions and services based on the use of information and communication technologies.',
    'labs.listTitle': 'Laboratories of the Institute',
    'labs.researchAreas': 'Research Areas',
    'labs.members': 'Laboratory Members',
    'labs.description': 'Description',
    'labs.website': 'Laboratory website',
    'labs.noContent': 'No laboratories listed yet.',

    // ── Interest groups ──────────────────────────────────────────
    'groups.intro':
      'Interest groups at the Institute of Informatics bring together students and researchers around shared topics, fostering collaboration and knowledge exchange beyond the scope of formal research projects.',
    'groups.listTitle': 'Interest Groups of the Institute',
    'groups.about': 'About the Group',
    'groups.website': 'Group website',
    'groups.noContent': 'No interest groups listed yet.',

    // ── Research Group ───────────────────────────────────────────
    'researchGroup.title': 'Research Group',
    'researchGroup.sidebar.group': 'Group',
    'researchGroup.sidebar.labs': 'Laboratories',

    // ── Research ─────────────────────────────────────────────────
    'research.title': 'Research',
    'research.sidebar.researchGroup': 'Research Group',
    'research.sidebar.projects': 'Research Projects',
    'research.sidebar.publications': 'Publications',
    'research.sidebar.ethics': 'Ethics Committee',
    'research.activeProjects': 'Active Projects',
    'research.pastProjects': 'Past Projects',
    'research.noProjects': 'No projects to display.',
    'research.present': 'present',
    'research.status.active': 'Active',
    'research.status.past': 'Completed',
    'research.sidebar.areas': 'Research Areas',
    'research.sidebar.sicris': 'Link to SICRIS',
    'research.sidebar.ethicsMandate': 'Tasks and functioning of the Committee',
    'research.sidebar.ethicsSubmissions':
      'Submission of applications and decisions',
    'research.ethics.opinions': 'Issued Opinions',
    'research.ethics.noOpinions': 'No opinions recorded yet.',
    'research.ethics.date': 'Date',
    'research.ethics.research': 'Research',
    'research.ethics.researchers': 'Researchers',
    'research.ethics.decision': 'Decision',
    'research.project.details': 'Project Details',
    'research.project.status': 'Status',
    'research.project.period': 'Period',
    'research.project.funder': 'Funding body',
    'research.project.pi': 'Principal investigator',
    'research.project.description': 'Description',
    'research.project.relatedNews': 'Related news',
    'research.project.backLink': 'Back to Research Projects',

    // ── Studies ──────────────────────────────────────────────────
    'studies.title': 'Studies IPT & ITK',
    'studies.sidebar.ipt': 'IPT',
    'studies.sidebar.itk': 'ITK',
    'studies.sidebar.students': 'Student Projects',
    'studies.noContent': 'No programmes to display.',
    'studies.programmes.title': 'Study Programmes',
    'studies.programmes.intro':
      'The Institute of Informatics is the main provider of education in the undergraduate and postgraduate study programmes Informatics and Data Technologies (IPT) and Information and Communication Technologies (ITK).',
    'studies.programmes.available': 'Available Programmes',
    'studies.programmes.info': 'Programme Information',
    'studies.programmes.curriculum': 'Curriculum & General Information',
    'studies.programmes.external': 'View programme on moja.um.si',
    'studies.programmes.backLink': 'Back to Study Programmes',
    'studies.programmes.type': 'Type',
    'studies.programmes.duration': 'Duration',
    'studies.programmes.ects': 'ECTS credits',
    'studies.years.one': 'year',
    'studies.years.two': 'years',
    'studies.years.few': 'years',
    'studies.years.other': 'years',
    'studies.activities.title': 'Student Activities',
    'studies.activities.intro':
      'Students at the Institute of Informatics take part in numerous projects and activities that complement formal education and develop practical skills.',
    'studies.activities.projects': 'Projects',
    'studies.activities.noContent': 'No projects to display.',
    'studies.activities.info': 'Project Information',
    'studies.activities.students': 'Student(s)',
    'studies.activities.year': 'Year',
    'studies.activities.details': 'Details',
    'studies.activities.external': 'View on praktik.um.si',
    'studies.activities.backLink': 'Back to Student Activities',

    // ── Conferences ──────────────────────────────────────────────
    'conferences.title': 'Conference Activities',
    'conferences.noContent': 'No conferences to display.',
    'conferences.intro':
      'The Institute of Informatics actively organizes and participates in international scientific conferences in the field of informatics and computer science.',
    'conferences.details': 'Details',
    'conferences.date': 'Date',
    'conferences.location': 'Location',
    'conferences.about': 'About',
    'conferences.website': 'Conference website',
    'conferences.backLink': 'Back to Conference Activities',

    // ── Industry ─────────────────────────────────────────────────
    'industry.title': 'Industry',
    'industry.noContent': 'No partners to display.',
    'industry.lead': 'Who we work with',
    'industry.website': 'Website',

    // ── Achievements ─────────────────────────────────────────────
    'achievements.title': 'Achievements and Activities',
    'achievements.backLink': 'Back to Achievements',
    'achievements.noContent': 'No achievements listed yet.',
    'achievements.gallery': 'Gallery',
    'achievements.videos': 'Videos',
    'achievements.openVideo': 'Open video',
    'achievements.videoUnsupported':
      'Your browser does not support HTML5 videos.',

    // ── News ─────────────────────────────────────────────────────
    'news.title': 'News',
    'news.backLink': 'Back to News',
    'news.noContent': 'No news listed yet.',
    'news.gallery': 'Gallery',

    // ── Staff ────────────────────────────────────────────────────
    'staff.title': 'Staff',
    'staff.section.predstojnik': 'Head of Institute',
    'staff.section.profesorji': 'Professors and Lecturers',
    'staff.section.asistenti': 'Assistants and Researchers',
    'staff.section.tehnicno': 'Technical Staff',
    'staff.section.prejsnji': 'Former Members',
    'staff.former.show': 'Show former members',
    'staff.former.hide': 'Hide former members',
    'staff.email': 'Email',
    'staff.phone': 'Phone',
    'staff.office': 'Office',
    'staff.contactHours': 'Contact Hours',
    'staff.linkedin': 'LinkedIn',
    'staff.cobiss': 'Publications (COBISS)',
    'staff.backLink': 'Back to Staff',
    'staff.lead': 'Academic and research staff of the Institute of Informatics',
    'staff.link': 'link',
    'staff.cobissText': 'Full publication list available on COBISS.',
    'staff.cobissLink': 'View on COBISS',

    // ── Tags ─────────────────────────────────────────────────────
    'tag.student': 'Student',
    'tag.conference': 'Conference',
    'tag.scientific': 'Scientific',
    'tag.professional': 'Professional',
    'tag.project': 'Project',
    'tag.awards': 'Awards',
    'tag.interest-groups': 'Interest Groups',
  },
} as const;

export type Lang = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)[typeof defaultLang];

/** Returns `t(key)` for a locale; missing keys fall back to Slovenian, then to the key. */
export function getTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return translations[lang][key] ?? translations[defaultLang][key] ?? key;
  };
}

export const isLang = (value: string): value is Lang =>
  (locales as readonly string[]).includes(value);
