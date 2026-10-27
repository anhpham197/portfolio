// Roles follow the supplied LinkedIn export. At the owner’s request, NAB tenure
// is combined from July 2023 rather than showing the internship separately.
// NAB engineering responsibilities are supported by the supplied CV.
// The owner's private tutoring roles are deliberately excluded.
export const experience = [
  {
    id: 'nab-quality-engineer',
    title: 'Quality Engineer',
    company: 'NAB Innovation Centre Vietnam',
    logo: '/logos/nab.jpg',
    website: 'https://www.nab.com.au/about-us/careers/nabvietnam',
    start: 'JUL 2023', end: 'PRESENT', location: 'Hanoi Capital Region', current: true,
    summary: 'Helping teams deliver dependable software through manual testing, frontend automation, API validation, and quality-focused collaboration.',
    details: [
      {key:'automation',label:'Frontend test automation',text:'Owned the migration of automation scripts from Cypress to WebdriverIO and Playwright using in-house frameworks. Maintained and stabilized test suites to address flaky tests and changing functional requirements.'},
      {key:'api',label:'API testing & quality assurance',text:'Performed manual API testing with Bruno and automated API testing with Karate. Designed functional, regression, and end-to-end test cases, and investigated and tracked defects using Rally, Confluence, and qTest.'},
      {key:'delivery',label:'CI/CD & cross-functional collaboration',text:'Integrated automated testing into Jenkins and Harness workflows. Partnered with developers and cross-functional teams to identify quality risks and resolve defects throughout the development lifecycle.'},
    ],
    recognition: ['Outstanding performance · FY24', 'Highly achieved performance · FY25'],
  },
  {
    id: 'ansv-solution-engineer',
    title: 'Solution Engineer',
    company: 'Advanced Network Systems Vietnam',
    logo: '/logos/ansv.png',
    website: 'https://ansv.vn/ANSV/trang-chu',
    start: 'APR 2023', end: 'JUN 2023', location: 'Hanoi Capital Region',
    bullets: [
      'Bridged vendors and clients to propose suitable telecom and IT solutions.',
      'Advised on equipment selection based on requirements and standards.',
      'Supported integration and deployment for 4G/5G projects across RAN and Core.',
    ],
  },
  {
    id: 'mindx-teaching-assistant',
    title: 'Teaching Assistant',
    company: 'MindX Technology School',
    logo: '/logos/mindx.png',
    website: 'https://mindx.edu.vn/',
    start: 'NOV 2022', end: 'MAY 2023', location: 'Hanoi Capital Region',
    bullets: [
      'Assisted in teaching entry-level web development with HTML, CSS, and JavaScript.',
      'Supported students through hands-on guidance and Q&A.',
      'Helped track progress and improve learning outcomes.',
    ],
  },
  {
    id: 'susoft-php-developer',
    title: 'PHP Web Developer',
    company: 'SUSOFT',
    logo: '/logos/susoft.png',
    website: 'https://susoft.vn/',
    start: 'MAY 2021', end: 'FEB 2022', location: 'Hanoi Capital Region',
    employmentType: 'Apprenticeship',
  },
];
