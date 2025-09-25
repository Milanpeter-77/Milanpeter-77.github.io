// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'Milanpeter-77', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Coding & Research Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'updated', // Sort projects by 'stars' or 'updated'
        limit: 12, // How many projects to display.
        exclude: {
          forks: true, // Forked projects will not be displayed if set to true.
          projects: ['Milanpeter-77/Milanpeter-77.github.io',
                     'Milanpeter-77/Milanpeter-77'], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['Milanpeter-77/Project-Trade-Recommendation-Backtesting-System',
                   'Milanpeter-77/Project-Daily-FX-Rates-Push-Notification',
                   'Milanpeter-77/Project-Credit-Risk-Analysis',
                   'Milanpeter-77/Project-MACD-Long-Trading-Strategy'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: '',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Project Name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut.',
          imageUrl:
            'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          link: 'https://example.com',
        },
        {
          title: 'Project Name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut.',
          imageUrl:
            'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          link: 'https://example.com',
        },
      ],
    },
  },
  seo: { title: 'Portfolio of Milan Peter',
        description: 'Where is this text exactly?',
        imageURL: '' },
  social: {
    linkedin: 'milan-peter',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    website: '',
    phone: '',
    email: 'peter.milan77@gmail.com',
  },
  resume: {
    fileUrl:
      'https://drive.google.com/file/d/1HCncJ4C8G2ypej6hurpP984k0V7iqL5b/view?usp=sharing', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Python',
    'R',
    'Stata',
    'LaTeX',
    'SQL',
    'Excel',
    'VBA',
    'Bloomberg Terminal',
    'LSEG Data & Analytics'
  ],
  experiences: [
    {
      company: 'MBH Investment Bank',
      position: 'Junior Equity Analyst',
      from: 'August 2024',
      to: 'Present',
      companyLink: 'www.mbhbefektetesibank.hu',
    },
    {
      company: 'K&H Bank',
      position: 'Credit Risk Modelling Intern',
      from: 'February 2024',
      to: 'May 2024',
      companyLink: '',
    },
    {
      company: 'OTP Bank',
      position: 'Country & Counterparty Risk Analyst Intern',
      from: 'July 2022',
      to: 'August 2023',
      companyLink: '',
    },
  ],
  certifications: [
    {
      name: 'Bloomberg Finance Fundamentals Certificate',
      body: 'Certificate ID: AXauuyd9sWnHChqQFGeWAWam',
      year: 'September 2024',
      link: 'https://portal.bloombergforeducation.com/certificates/AXauuyd9sWnHChqQFGeWAWam',
    },
  ],
  educations: [
    {
      institution: 'Vrije Universiteit Amsterdam (VU)',
      degree: 'Master of Science in Quantitative Finance',
      from: '2025',
      to: '2026',
    },
    {
      institution: 'Corvinus University of Budapest',
      degree: 'Bachelor of Science in Business Administration and Management',
      from: '2020',
      to: '2024',
    },
  ],
  publications: [
    {
      title: '',
      conferenceName: '',
      journalName: '',
      authors: '',
      link: '',
      description:
        '',
    },
  ],
  // Display articles from your medium or dev account. (Optional)
  blog: {
    source: 'dev', // medium | dev
    username: '', // to hide blog section, keep it empty
    limit: 2, // How many articles to display. Max is 10.
  },
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'cmyk',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: true,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'caramellatte',
      'abyss',
      'silk',
      'procyon',
    ],
  },



  enablePWA: true,
};

export default CONFIG;
