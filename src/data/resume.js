/**
 * Source of truth for every piece of content on the site.
 *
 * PLACEHOLDERS
 * ------------
 * Anything set to the `TODO` sentinel (or a string starting with "TODO") is
 * treated as "waiting for Manan's input" and rendered as a dashed slot in the
 * UI. Replace the value and the slot disappears automatically.
 *
 *   photo: TODO            -> shows a "drop your photo here" frame
 *   images: [] / TODO      -> shows a "add a project shot" frame
 *   live/repo: TODO        -> link is hidden / shown as an empty slot
 */
export const TODO = 'TODO'

const isPlaceholder = (value) => value === TODO || (typeof value === 'string' && value.startsWith(TODO))
export { isPlaceholder }

export const profile = {
  name: 'Manan Gohil',
  initials: 'MG',
  firstName: 'Manan',
  lastName: 'Gohil',
  location: 'Mumbai, Maharashtra',
  tagline: 'AI, data & the web — built to be used.',
  role: 'Computer Science (Data Science) student',
  photo: '/MananGohil.jpg',
  resumeFile: '/Manan_Gohil_Resume.pdf',
  available: 'Open to internships',
  bio: [
    'Second-year Computer Science (Data Science) student with a strong interest in AI, data analytics and scalable systems.',
    'I build real-world projects spanning machine learning, web technologies and governance-focused AI, and I care about turning messy problems into things people can actually use.',
  ],
}

export const contact = {
  email: 'manangohil2357@gmail.com',
  phone: '+91 7977960537',
  phoneHref: 'tel:+917977960537',
  linkedin: 'https://linkedin.com/in/manan-gohil',
  linkedinLabel: 'linkedin.com/in/manan-gohil',
  github: 'https://github.com/MananGohil23',
  githubLabel: 'github.com/MananGohil23',
  twitter: 'https://x.com/MananGohil19',
  twitterLabel: '@MananGohil19',
  formEndpoint: 'https://formspree.io/f/mljdlvdw',
}

export const stats = [
  { label: 'CGPA', value: '9.83' },
  { label: 'Graduating', value: '2029' },
  { label: 'JEE %ile', value: '95.44' },
]

export const projects = [
  {
    id: 'edudash',
    title: 'EduDash',
    subtitle: 'Student Academic Dashboard',
    context: 'Personal Project',
    accent: 'mustard',
    year: '2026',
    images: ['/edudash1.png', '/edudash2.png', '/edudash3.png', '/edudash4.png', '/edudash5.png', '/edudash6.png'],
    live: 'https://edu-dash-anb2.vercel.app/',
    repo: 'https://github.com/MananGohil23/EduDash.git',
    tags: ['React 19', 'Node.js', 'Express', 'MongoDB', 'JWT', 'REST APIs'],
    points: [
      'Built a full-stack student academic dashboard using React 19, Node.js/Express and MongoDB.',
      'Developed a PDF attendance parser pipeline for automated attendance tracking.',
      'Integrated the YouTube API for in-app lecture access.',
      'Implemented JWT-based authentication for secure user sessions.',
    ],
  },
  {
    id: 'sugarcare',
    title: 'SugarCareDiabetes',
    subtitle: 'AI Health Platform',
    context: 'TechnoVate, D.Y. Patil University',
    accent: 'coral',
    year: '2025',
    images: ['/sugar1.png', '/sugar2.png', '/sugar3.png', '/sugar4.png'],
    live: 'https://sugar-care-diabetes.vercel.app/',
    repo: 'https://github.com/MananGohil23/SugarCareDiabetes.git',
    tags: ['Python', 'Machine Learning', 'Chatbot', 'HTML/CSS', 'JavaScript'],
    points: [
      'Built an AI-powered system for diabetes risk prediction using real-time user inputs.',
      'Developed a health chatbot for diet and exercise recommendations.',
      'Shipped a full-stack application with Python, HTML/CSS and JavaScript.',
      'Focused on user-centric design and real-world healthcare applicability.',
    ],
  },
  {
    id: 'djsce-express',
    title: 'DJSCE eXpress Website',
    subtitle: 'Official Events Website',
    context: 'DJSCE eXpress',
    accent: 'cobalt',
    year: '2026',
    images: ['/express1.png', '/express2.png'],
    live: 'https://www.djscexpress.com/previous-events',
    tags: ['Frontend', 'HTML', 'CSS', 'JavaScript', 'Collaboration'],
    points: [
      "Contributed to the development of DJSCE eXpress's new official website.",
      'Built the Previous Events page with an interactive timeline of every event hosted by the committee.',
      'Collaborated with the team on broader front-end development across the site.',
    ],
  },
]

export const experience = [
  {
    role: 'Technical & Creatives Associate',
    org: 'DJSCE eXpress',
    period: 'Feb 2026 — Present',
    accent: 'coral',
    points: [
      'Contributed to technical and creative initiatives within the college community.',
      'Collaborated in team-based environments for event execution and management.',
    ],
  },
  {
    role: 'Web Development & Creatives Committee Member',
    org: 'DJS Compute',
    period: 'Aug 2026 — Present',
    accent: 'cobalt',
    points: ['Contributing to web development and creative initiatives within the DJS Compute community.'],
  },
  {
    role: 'Software Team Member',
    org: 'DJS Arya',
    period: 'Jun 2026 — Present',
    accent: 'teal',
    points: [
      'Working on radio communication between the CanSat and its ground control station.',
      'Gaining hands-on experience with sensor integration for CanSat payloads.',
      'Contributing to the in-house ground control station software.',
    ],
  },
]

export const education = [
  {
    degree: 'B.Tech. Computer Science (Data Science)',
    school: 'Dwarkadas J. Sanghvi College of Engineering',
    period: '2025 — 2029',
    detail: 'CGPA: 9.83',
  },
  {
    degree: 'HSC (PCM)',
    school: 'Brio E.Tech Jr. College',
    period: '2023 — 2025',
    detail: 'JEE Mains: 95.44 percentile · JEE Advanced: AIR 19792',
  },
]

export const skillGroups = [
  { label: 'Languages', accent: 'coral', items: ['Python', 'Java', 'C/C++', 'JavaScript'] },
  { label: 'Web Development', accent: 'cobalt', items: ['HTML', 'CSS'] },
  {
    label: 'Core Concepts',
    accent: 'teal',
    items: ['Data Structures', 'Pandas', 'NumPy', 'Basic Machine Learning', 'APIs'],
  },
  { label: 'Tools', accent: 'mustard', items: ['Git (basics)', 'VS Code'] },
  {
    label: 'Soft Skills',
    accent: 'plum',
    items: ['Communication', 'Teamwork', 'Time Management', 'Creativity'],
  },
]

export const marqueeSkills = [
  'Python',
  'JavaScript',
  'React 19',
  'Node.js',
  'MongoDB',
  'Pandas',
  'NumPy',
  'Machine Learning',
  'Data Analytics',
  'REST APIs',
  'Java',
  'C/C++',
  'Git',
]

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]
