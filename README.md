# Anh Pham — personal portfolio

A responsive portfolio built with React, Ant Design, and Vite. Career content combines the supplied LinkedIn PDF, temporary CV, and publicly indexed LinkedIn details. A centered, typography-led hero introduces the owner and provides contact and experience links. The downloadable DOCX preserves the supplied CV template, with its experience and high school education updated to match the LinkedIn export. The user's original source files remain unchanged.

## Content sources

- Supplied LinkedIn export (`Profile.pdf`): source for employment, ANSV and MindX responsibilities, and SUSOFT apprenticeship status. At the owner's request, NAB is displayed as one Quality Engineer entry from July 2023 to present, combining the internship and subsequent employment. The downloadable CV uses the same combined entry. Four roles are displayed; private tutoring is excluded. The source PDF is not published. SUSOFT ends in February 2022.
- Supplied CV: source for detailed NAB engineering responsibilities.
- Hero description: condensed from the Summary in the supplied LinkedIn export, including manual/automation testing, Cypress/WebdriverIO/Playwright, API testing, CI/CD, and the commitment to education access.
- Theme: primary burgundy `#A41034`, read directly from the name heading in the supplied CV's DOCX formatting. Interface backgrounds, borders, and supporting accents use matching warm tints; status colors and official company logos retain their meaning and artwork.
- [LinkedIn profile](https://vn.linkedin.com/in/anhpham197/fr): additional credentials, GPA (3.51; no scale assumed), award dates, volunteering, education interests, and English proficiency. Publicly indexed content reviewed on 27 October 2026. Employment details are taken from the subsequently supplied PDF because the public view hides them.
- [Numberlink research repository](https://github.com/anhpham197/SAT-Encoding-for-Numberlink): research code linked from the education section. Its owner handle and research topic match the profile and CV.
- AWS Cloud Practitioner is shown as earned in September 2023 and expired in September 2026, as listed on LinkedIn. No renewal is assumed. The six learning entries include certifications and programmes; they are not presented as six active professional certifications.
- High school: Le Hong Phong High School for the Gifted, Nam Dinh; High School Diploma, 2016–2019, as listed in the supplied LinkedIn PDF. No subject specialization or grades are inferred.
- University and high school share one education card, with the high school directly beneath VNU/UET. Their logos come from their official websites; exact sources are stored in `public/logos/SCHOOLS.json`.
- Research coverage: the two university articles selected by the owner are stored in `src/research-news.js`. The faculty awards article is linked beneath First Prize, and the university conference article beneath Second Prize. There is no standalone news section. The original articles are Vietnamese; links show month/year rather than an unverified publication day. The existing `#research-news` anchor now points to the prize entries.
- Research thumbnails are each article's original published Open Graph image, served by the university's image CDN. Copies and source URLs are in `public/research/`; no generic or generated photography is substituted.
- Toolkit icons: all 17 tools have local brand or application icons, sourced from Devicon, Simple Icons, or the tool's official website. Rally uses the actual Rally application favicon, and qTest uses its official Tricentis application favicon. Exact URLs are recorded in `public/tools/SOURCES.json`.

## Local development

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

The production output is `dist/`.

## GitHub Pages

Repository: https://github.com/anhpham197/portfolio

Pages address: https://anhpham197.github.io/portfolio/

The workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to `main`, or manually through the Actions tab. It uses Node.js 22 and the committed npm lockfile. In repository Settings → Pages, the publishing source must be **GitHub Actions**.

The Pages configuration supplies the deployment base path automatically. Local assets, favicons, and CV download URLs use that base path, so they work under `/portfolio/` and at a custom domain root.

To reproduce the Pages build locally:

```sh
VITE_BASE_PATH=/portfolio/ npm run build
VITE_BASE_PATH=/portfolio/ npm run preview
```

Open http://127.0.0.1:4173/portfolio/ for that preview. Running `npm run build` without `VITE_BASE_PATH` builds for a domain root. The previous Sites deployment is managed separately; this repository contains the standalone application source.

## Updating content

- References: `src/references.js` contains the three NAB reference contacts supplied by the owner, with their stated names, titles, company, emails, and phone numbers. Phone links use normalized international numbers. Relationships are omitted because none were supplied.

- Role titles, employers, dates, responsibilities, and company logo paths: `src/experience.js`.
- Skills, education, certificates, contact details, and page composition: `src/main.jsx`.
- Official company logos and their sources: `public/logos/`.
- Credential verification: five direct links and three credential IDs supplied by the owner are shown beneath the matching certificates. The final Drive file, `YFLP_Cert.pdf`, belongs to Youth Future Leader Programme. IT Business Analyst has no supplied verification link or ID. Optional `credentialUrl` and `credentialId` fields live in `src/credentials.js`; IDs are displayed verbatim, with no badge UUID inferred as an ID.
- Credential issuers and volunteer organizations: `src/credentials.js`. Their official logos and source URLs are recorded in `public/logos/ORGANIZATIONS.json`; artwork is stored locally with its original proportions and colors.
- Team panther favicon, transparent source, and edit provenance: `FAVICON.md` and `public/panther-source.png`.
- University news links and summaries: `src/research-news.js`.
- Toolkit icon paths and official links: `src/tool-icons.js`.
- Theme, animations, and responsive styles: `src/styles.css`.
- Downloadable CV with experience aligned to the supplied LinkedIn export: `public/Ngoc-Anh-Pham-CV.docx`.
- Page title, description, and social metadata: `index.html`.

Animations respect reduced-motion preferences. Navigation, mobile drawer, skill selection, experience accordions, CV download, and contact links are keyboard accessible. Email copy uses the browser clipboard, with a visible address fallback.

Ant Design integration follows the [official React/Vite guide](https://ant.design/docs/react/use-with-vite/).
