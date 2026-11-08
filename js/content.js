/*
 * All texts, dates and photo slots of the page live here.
 * Photos: assets/photos/<slot>.webp (see assets/photos/README.md).
 * A photo whose file is missing is hidden.
 */
window.CONTENT = {
  person: {
    name: 'Dmytro Myronov',
    role: 'Backend Lead · Magento 2 / Adobe Commerce',
    tagline: 'I build the boring-critical parts of e-commerce: ERP integrations that never lose an order, fast catalogs, clean modules, and AI agents that do the routine work.',
    location: 'Wrocław, Poland · Remote, any time zone',
    email: 'dmytro.mironov@gmail.com',
    phone: '+48 506 843 394',
    linkedin: 'https://www.linkedin.com/in/dmytro-myronov-3054397a',
    github: 'https://github.com/dmytro-mironov-dev',
    cv: 'assets/cv/Dmytro_Myronov_Magento2_AI.pdf',
    portrait: 'me-main',
  },

  stats: [
    { value: 12, suffix: '+', label: 'years of PHP' },
    { value: 8, suffix: '+', label: 'years of Magento 1 / 2' },
    { value: 250000, suffix: '', label: 'records per catalog import' },
    { value: 2000, suffix: '/day', label: 'orders & invoices to NetSuite' },
    { value: 15, suffix: '+', label: 'international e-commerce clients' },
  ],

  career: [
    {
      id: 'seoboost',
      years: '2015 – 2017',
      company: 'SEOBOOST',
      place: 'Kharkiv, Ukraine',
      role: 'Team Lead · Web department',
      color: '#f26322',
      text: 'My first lead role. I ran the web department: split the work, designed the technical solutions and talked to clients directly.',
      points: [
        'Led the web team: task allocation, solution design, client consulting',
        'Full-cycle e-commerce on Yii and AngularJS, OpenCart and WordPress',
        'Shipping integrations (Nova Poshta) and data-migration tooling',
      ],
      tags: ['Yii', 'AngularJS', 'OpenCart', 'MySQL', 'Team lead'],
      feature: {
        slot: 'seoboost-lead-portrait',
        word: 'TEAM LEAD',
        kicker: 'SEOBOOST · Kharkiv · 2015',
        title: 'Where I learned to lead',
        text: 'Head of the web development department: my own team, my own clients and the first architecture decisions that were mine to defend.',
      },
      photos: [
        { slot: 'seoboost-team', cap: 'My web team at SEOBOOST · 2016' },
        { slot: 'seoboost-card', cap: 'Head of Web Development: my first lead title' },
        { slot: 'seoboost-dev', cap: 'With one of my developers' },
        { slot: 'seoboost-qa', cap: 'With our QA engineer' },
        { slot: 'seoboost-hr', cap: 'Our HR, who stole my only PHP t-shirt' },
      ],
    },
    {
      id: 'ssa',
      years: '2017 – 2022',
      company: 'SSA Group · IdeaSoft',
      place: 'Kharkiv, Ukraine',
      role: 'Magento Developer · Team Lead',
      color: '#7c5cff',
      text: 'Where I became a Magento engineer. Magento 1 and 2 for clients across the US, Australia and Germany, and talks with the community at Magento conferences.',
      points: [
        'Magento 1 → 2 migrations, XML import pipelines, custom product types',
        'REST APIs with OAuth 2.0 for a mobile client, 2FA, Codeception tests',
        'Mentoring and full-cycle delivery as a team lead',
      ],
      tags: ['Magento 2', 'Magento 1', 'PHP 7', 'REST', 'Codeception'],
      photos: [
        { slot: 'ssa-booth-2017', cap: 'SSA Group booth · 2017' },
        { slot: 'mageconf-2017-logo', cap: 'MageConf 2017 · Kyiv' },
      ],
    },
    {
      id: 'overdose',
      years: '2017 – 2022',
      company: 'InTechSoft × Overdose',
      place: 'Remote · Australia, US, EU',
      role: 'Senior Magento Developer (dedicated to Overdose)',
      color: '#22d3ee',
      text: 'Through InTechSoft I worked almost full time inside Overdose, a Magento agency, on big Adobe Commerce Cloud stores in Australia, the US and Europe.',
      points: [
        'Built a multi-card NMI payment gateway from scratch; HeidelPay and Stripe',
        'Salesforce CRM (SOAP + REST), NetSuite, Mindbox (L’Oréal) integrations',
        'Elasticsearch / Algolia search and performance on large catalogs',
        'Clients: Coco Republic, Foundrae, Beaurepaires · Goodyear, Lora DiCarlo, GlobeWest',
      ],
      tags: ['Adobe Commerce Cloud', 'NMI', 'Stripe', 'Salesforce', 'Algolia'],
      photos: [
        { slot: 'overdose-mug', cap: 'Remote for Overdose: coffee, code, Adobe Commerce Cloud' },
        { slot: 'overdose-mug-code', cap: 'Morning deploy, morning mug' },
        { slot: 'overdose-desk', cap: 'Home office with the ElePHPant' },
        { slot: 'overdose-desk-2', cap: 'Same desk, a different Magento store' },
      ],
    },
    {
      id: 'startupsoft',
      years: '2023',
      company: 'StartupSoft',
      place: 'Poland',
      role: 'Senior Software Engineer',
      color: '#a3e635',
      text: 'B-Stock, a US B2B liquidation auction marketplace on a large legacy Magento codebase.',
      points: [
        'NetSuite ERP integration: orders, customers, inventory',
        'Auction services in Node.js, shipping and payment provider APIs',
        'Data-processing automation in Python',
      ],
      tags: ['Magento', 'NetSuite', 'Node.js', 'Python'],
      photos: [],
    },
    {
      id: 'hoofdfabriek',
      years: 'Nov 2023 – now',
      company: 'Hoofdfabriek',
      place: 'Netherlands · remote',
      role: 'Backend Lead',
      color: '#c6f432',
      text: 'Backend Lead for a four-brand Magento 2 platform (B2B and B2C). I own the integrations and the architecture, and I am rolling out MagePilot, my AI agent pipeline, into the team’s daily work.',
      points: [
        'Kerridge ERP: delta sync of products, tier prices, stock; imports of 250,000 records',
        'NetSuite: up to 2,000 orders and invoices per day with retries and reconciliation',
        'Hyvä B2B storefront, Magento 2.4.x upgrades, CI/CD on GitHub Actions',
        'Introducing MagePilot: Jira tickets to tested branches with AI agents',
      ],
      tags: ['Magento 2.4', 'Kerridge', 'NetSuite', 'Hyvä', 'MagePilot'],
      photos: [
        { slot: 'hoofdfabriek-outing', cap: 'Team outing with the Hoofdfabriek crew' },
        { slot: 'hoofdfabriek-visit', cap: 'Visiting the team in the Netherlands' },
        { slot: 'hoofdfabriek-teamday', cap: 'Team day away from the screens' },
        { slot: 'hoofdfabriek-jacket', cap: 'Hoofdfabriek team jacket: part of the crew since 2023' },
      ],
    },
  ],

  community: {
    lead: 'Magento is a community thing. I go to meetups and conferences, talk to the people who build the platform and bring the ideas back to my team.',
    events: [
      { slot: 'meetup-kharkiv-2017', date: 'Oct 2017', title: 'Magento Meetup Kharkiv', text: 'Local Magento crowd, talks and a lot of checkout war stories.' },
      { slot: 'ssa-booth-2017', date: 'Nov 2017', title: 'SSA Group booth', text: 'Representing the company and meeting other Magento teams.' },
      { slot: 'mageconf-2017-stage', date: 'Dec 2017', title: 'MageConf 2017 · Kyiv', text: 'The biggest Magento conference in Ukraine. Focus on tech.' },
      { slot: 'mageconf-2017-logo', date: 'Dec 2017', title: 'MageConf 2017 · Kyiv', text: 'Yes, I love Magento. Even after 8 years.' },
    ],
  },

  integrations: [
    { name: 'Kerridge ERP', flows: ['products', 'tier prices', 'stock'] },
    { name: 'NetSuite', flows: ['orders', 'invoices', 'customers'] },
    { name: 'Salesforce', flows: ['customers', 'orders'] },
    { name: 'Stripe · NMI', flows: ['payments', 'refunds'] },
    { name: 'Algolia', flows: ['search index'] },
    { name: 'Mindbox', flows: ['transactions'] },
  ],

  magepilot: {
    site: 'https://dmytro-mironov-dev.github.io/magepilot-site/',
    steps: [
      { name: 'Jira', text: 'picks my sprint ticket' },
      { name: 'Investigator', text: 'turns it into a concrete task' },
      { name: 'Architect', text: 'drafts a design, I approve in Telegram' },
      { name: 'Coder', text: 'implements it on a new branch' },
      { name: 'QA', text: 'tests + real browser via Playwright' },
      { name: 'Branch', text: 'pushed, I review and open the PR' },
    ],
    shots: [
      { src: 'assets/magepilot/magepilot-investigate.webp', caption: 'Live board: agents, queue and questions waiting for me' },
      { src: 'assets/magepilot/magepilot-qa.webp', caption: 'QA agent checks the change on a real Magento' },
      { src: 'assets/magepilot/magepilot-code.webp', caption: 'Coder agent at work' },
      { src: 'assets/magepilot/magepilot-telegram.webp', caption: 'Design approval in Telegram', tall: true },
    ],
  },

  skills: [
    { group: 'Magento & E-commerce', level: 95, items: ['Magento 2 / Adobe Commerce', 'Adobe Commerce Cloud', 'Magento 1', 'Hyvä', 'Luma', 'Knockout.js', 'Checkout & payments', 'GraphQL', 'Upgrades & migrations'] },
    { group: 'PHP backend', level: 92, items: ['PHP 8.x', 'Laravel', 'Yii / Yii2', 'REST / SOAP', 'OAuth 2.0', 'Queues & cron', 'PHPUnit', 'Codeception'] },
    { group: 'Integrations', level: 93, items: ['NetSuite', 'Kerridge', 'Salesforce', 'Mindbox', 'Stripe', 'NMI', 'HeidelPay', 'QuickBooks Online', 'Algolia'] },
    { group: 'AI-driven development', level: 90, items: ['Claude Code', 'Claude Agent SDK', 'MCP servers', 'Playwright MCP', 'n8n', 'OpenAI / Anthropic APIs', 'Ollama'] },
    { group: 'Python & Computer Vision', level: 78, items: ['Python 3', 'Django', 'DRF', 'OpenCV', 'YOLO', 'PyTorch', 'Celery', 'Pandas'] },
    { group: 'Data & performance', level: 88, items: ['MySQL / MariaDB', 'PostgreSQL', 'Redis', 'Varnish', 'Elasticsearch', 'RabbitMQ'] },
    { group: 'DevOps & leadership', level: 85, items: ['Docker', 'GitHub Actions', 'GitLab CI', 'Nginx', 'Linux', 'Code review', 'Architecture', 'Mentoring'] },
  ],
};
