export interface HeroContent {
  name: string;
  role: string;
  bio: string;
  ctas: Array<{ label: string; href: string; variant?: 'default' | 'outline' }>;
  avatarImage: string;
  backgroundImage: string;
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
}

export interface SkillsContent {
  title: string;
  categories: Array<{
    name: string;
    skills: string[];
  }>;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  links: Array<{ label: string; href: string }>;
  thumbnail?: string;
}

export interface ProjectsContent {
  title: string;
  projects: Project[];
}

export interface ExperienceItem {
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'work' | 'education';
}

export interface ExperienceContent {
  title: string;
  items: ExperienceItem[];
}

export interface ContactContent {
  title: string;
  description: string;
  email: string;
}

export interface FooterContent {
  socialLinks: Array<{ label: string; href: string; icon: string }>;
  copyright: string;
}

export interface PortfolioContent {
  hero: HeroContent;
  about: AboutContent;
  skills: SkillsContent;
  projects: ProjectsContent;
  experience: ExperienceContent;
  contact: ContactContent;
  footer: FooterContent;
}

export const portfolioContent: PortfolioContent = {
  hero: {
    name: 'Alex Morgan',
    role: 'Full-Stack Developer & Designer',
    bio: 'I craft beautiful, functional web experiences that solve real problems. Passionate about clean code, intuitive design, and building products people love.',
    ctas: [
      { label: 'View Projects', href: '#projects', variant: 'default' },
      { label: 'Get in Touch', href: '#contact', variant: 'outline' },
    ],
    avatarImage: '/assets/generated/avatar-illustration.dim_512x512.png',
    backgroundImage: '/assets/generated/hero-bg.dim_1920x1080.png',
  },
  about: {
    title: 'About Me',
    paragraphs: [
      "I'm a full-stack developer with a passion for creating elegant solutions to complex problems. With over 5 years of experience in web development, I've worked with startups and established companies to bring their digital visions to life.",
      'My approach combines technical expertise with a keen eye for design. I believe the best products are built at the intersection of functionality and aesthetics, where every line of code serves a purpose and every pixel tells a story.',
      'When I\'m not coding, you\'ll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community through writing and mentorship.',
    ],
  },
  skills: {
    title: 'Skills & Technologies',
    categories: [
      {
        name: 'Frontend',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js', 'HTML5/CSS3'],
      },
      {
        name: 'Backend',
        skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
      },
      {
        name: 'Tools & Platforms',
        skills: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'CI/CD'],
      },
      {
        name: 'Blockchain',
        skills: ['Internet Computer', 'Motoko', 'Web3', 'Smart Contracts'],
      },
    ],
  },
  projects: {
    title: 'Featured Projects',
    projects: [
      {
        title: 'E-Commerce Platform',
        description:
          'A modern, scalable e-commerce solution with real-time inventory management, payment processing, and analytics dashboard.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
        links: [
          { label: 'View Live', href: 'https://example.com' },
          { label: 'GitHub', href: 'https://github.com' },
        ],
        thumbnail: '/assets/generated/project-thumb-1.dim_1200x750.png',
      },
      {
        title: 'Task Management App',
        description:
          'Collaborative task management tool with real-time updates, team workspaces, and advanced filtering capabilities.',
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'tRPC', 'Tailwind'],
        links: [
          { label: 'View Live', href: 'https://example.com' },
          { label: 'GitHub', href: 'https://github.com' },
        ],
        thumbnail: '/assets/generated/project-thumb-2.dim_1200x750.png',
      },
      {
        title: 'Decentralized Social Network',
        description:
          'Privacy-focused social platform built on the Internet Computer, featuring end-to-end encryption and user-owned data.',
        technologies: ['React', 'Motoko', 'Internet Computer', 'TypeScript'],
        links: [
          { label: 'View Live', href: 'https://example.com' },
          { label: 'GitHub', href: 'https://github.com' },
        ],
        thumbnail: '/assets/generated/project-thumb-3.dim_1200x750.png',
      },
    ],
  },
  experience: {
    title: 'Experience & Education',
    items: [
      {
        title: 'Senior Full-Stack Developer',
        organization: 'TechCorp Solutions',
        period: '2021 - Present',
        description:
          'Lead development of enterprise web applications, mentor junior developers, and architect scalable solutions for Fortune 500 clients.',
        type: 'work',
      },
      {
        title: 'Full-Stack Developer',
        organization: 'StartupXYZ',
        period: '2019 - 2021',
        description:
          'Built and maintained core product features, implemented CI/CD pipelines, and contributed to product strategy and design decisions.',
        type: 'work',
      },
      {
        title: 'Frontend Developer',
        organization: 'Digital Agency Co',
        period: '2018 - 2019',
        description:
          'Developed responsive websites and web applications for diverse clients, focusing on performance optimization and accessibility.',
        type: 'work',
      },
      {
        title: 'B.S. Computer Science',
        organization: 'University of Technology',
        period: '2014 - 2018',
        description:
          'Graduated with honors. Focused on software engineering, algorithms, and human-computer interaction.',
        type: 'education',
      },
    ],
  },
  contact: {
    title: 'Get In Touch',
    description:
      "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!",
    email: 'hello@alexmorgan.dev',
  },
  footer: {
    socialLinks: [
      { label: 'GitHub', href: 'https://github.com', icon: 'github' },
      { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
      { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
      { label: 'Email', href: 'mailto:hello@alexmorgan.dev', icon: 'mail' },
    ],
    copyright: `© ${new Date().getFullYear()} Alex Morgan. All rights reserved.`,
  },
};
