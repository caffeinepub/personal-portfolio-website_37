import type { PortfolioContent } from '@/content/portfolioContent';

type PortfolioPatch = Partial<PortfolioContent>;

/**
 * Deterministic, client-side resume parser that extracts common fields
 * and maps them to the PortfolioContent schema.
 */
export function parseResumeToPortfolioPatch(resumeText: string): PortfolioPatch {
  if (!resumeText || !resumeText.trim()) {
    return {};
  }

  const lines = resumeText.split('\n').map(line => line.trim()).filter(Boolean);
  const patch: PortfolioPatch = {};

  // Extract name (usually first non-empty line or after "Name:" label)
  const name = extractName(lines);
  if (name) {
    patch.hero = { ...patch.hero, name } as any;
  }

  // Extract email
  const email = extractEmail(resumeText);
  if (email) {
    patch.contact = { ...patch.contact, email } as any;
  }

  // Extract role/title
  const role = extractRole(lines);
  if (role) {
    patch.hero = { ...patch.hero, role } as any;
  }

  // Extract summary/bio
  const bio = extractSummary(lines, resumeText);
  if (bio) {
    patch.hero = { ...patch.hero, bio } as any;
  }

  // Extract about paragraphs
  const aboutParagraphs = extractAboutParagraphs(lines, resumeText);
  if (aboutParagraphs.length > 0) {
    patch.about = { paragraphs: aboutParagraphs } as any;
  }

  // Extract skills
  const skillCategories = extractSkills(lines, resumeText);
  if (skillCategories.length > 0) {
    patch.skills = { categories: skillCategories } as any;
  }

  // Extract experience
  const experienceItems = extractExperience(lines, resumeText);
  if (experienceItems.length > 0) {
    patch.experience = { items: experienceItems } as any;
  }

  // Extract projects
  const projects = extractProjects(lines, resumeText);
  if (projects.length > 0) {
    patch.projects = { projects } as any;
  }

  // Extract social links
  const socialLinks = extractSocialLinks(resumeText);
  if (socialLinks.length > 0) {
    patch.footer = { socialLinks } as any;
  }

  return patch;
}

function extractName(lines: string[]): string | null {
  // Look for name in first few lines or after "Name:" label
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    
    // Skip common headers
    if (/^(resume|curriculum vitae|cv)$/i.test(line)) {
      continue;
    }
    
    // Check for "Name:" label
    const nameMatch = line.match(/^name\s*:?\s*(.+)$/i);
    if (nameMatch) {
      return nameMatch[1].trim();
    }
    
    // First substantial line that looks like a name (2-4 words, capitalized)
    if (line.length > 3 && line.length < 50 && /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(line)) {
      return line;
    }
  }
  
  return null;
}

function extractEmail(text: string): string | null {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

function extractRole(lines: string[]): string | null {
  // Look for role/title near the top or after specific labels
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i];
    
    // Check for explicit labels
    const roleMatch = line.match(/^(title|role|position|profession)\s*:?\s*(.+)$/i);
    if (roleMatch) {
      return roleMatch[2].trim();
    }
    
    // Common role patterns (after name, before summary)
    if (i > 0 && i < 5 && line.length > 5 && line.length < 80) {
      // Skip email/phone lines
      if (/@/.test(line) || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line)) {
        continue;
      }
      
      // Look for developer/engineer/designer patterns
      if (/\b(developer|engineer|designer|architect|manager|analyst|consultant|specialist)\b/i.test(line)) {
        return line;
      }
    }
  }
  
  return null;
}

function extractSummary(lines: string[], fullText: string): string | null {
  const summaryHeaders = /^(summary|profile|objective|about|bio|introduction)\s*:?$/i;
  
  for (let i = 0; i < lines.length; i++) {
    if (summaryHeaders.test(lines[i])) {
      // Collect lines until next section or empty line
      const summaryLines: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        const line = lines[j];
        
        // Stop at next section header
        if (isSectionHeader(line)) {
          break;
        }
        
        summaryLines.push(line);
        
        // Stop after reasonable summary length
        if (summaryLines.join(' ').length > 300) {
          break;
        }
      }
      
      const summary = summaryLines.join(' ').trim();
      if (summary.length > 20 && summary.length < 500) {
        return summary;
      }
    }
  }
  
  return null;
}

function extractAboutParagraphs(lines: string[], fullText: string): string[] {
  const summary = extractSummary(lines, fullText);
  if (summary) {
    // Split into sentences and group into paragraphs
    const sentences = summary.match(/[^.!?]+[.!?]+/g) || [summary];
    const paragraphs: string[] = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const para = sentences.slice(i, i + 2).join(' ').trim();
      if (para) {
        paragraphs.push(para);
      }
    }
    
    return paragraphs.length > 0 ? paragraphs : [summary];
  }
  
  return [];
}

function extractSkills(lines: string[], fullText: string): Array<{ name: string; skills: string[] }> {
  const skillsHeaders = /^(skills|technical skills|technologies|competencies|expertise)\s*:?$/i;
  const categories: Array<{ name: string; skills: string[] }> = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (skillsHeaders.test(lines[i])) {
      // Look for categorized or flat skill lists
      for (let j = i + 1; j < lines.length; j++) {
        const line = lines[j];
        
        // Stop at next major section
        if (isSectionHeader(line) && !line.match(/^(frontend|backend|tools|languages|frameworks|databases)/i)) {
          break;
        }
        
        // Check for category: skills format
        const categoryMatch = line.match(/^([^:]+):\s*(.+)$/);
        if (categoryMatch) {
          const categoryName = categoryMatch[1].trim();
          const skillsText = categoryMatch[2].trim();
          const skills = skillsText.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
          
          if (skills.length > 0) {
            categories.push({ name: categoryName, skills });
          }
        } else if (line.includes(',') || line.includes('•') || line.includes('-')) {
          // Flat list of skills
          const skills = line
            .replace(/^[•\-*]\s*/, '')
            .split(/[,;|]/)
            .map(s => s.trim())
            .filter(s => s.length > 0 && s.length < 50);
          
          if (skills.length > 0) {
            categories.push({ name: 'Technical Skills', skills });
          }
        }
      }
      
      break;
    }
  }
  
  return categories;
}

function extractExperience(lines: string[], fullText: string): Array<{
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'work' | 'education';
}> {
  const items: Array<{
    title: string;
    organization: string;
    period: string;
    description: string;
    type: 'work' | 'education';
  }> = [];
  
  const workHeaders = /^(experience|work experience|employment|professional experience)\s*:?$/i;
  const eduHeaders = /^(education|academic background|qualifications)\s*:?$/i;
  
  // Extract work experience
  for (let i = 0; i < lines.length; i++) {
    if (workHeaders.test(lines[i])) {
      const workItems = extractExperienceSection(lines, i + 1, 'work');
      items.push(...workItems);
    }
    
    if (eduHeaders.test(lines[i])) {
      const eduItems = extractExperienceSection(lines, i + 1, 'education');
      items.push(...eduItems);
    }
  }
  
  return items;
}

function extractExperienceSection(
  lines: string[],
  startIndex: number,
  type: 'work' | 'education'
): Array<{
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'work' | 'education';
}> {
  const items: Array<{
    title: string;
    organization: string;
    period: string;
    description: string;
    type: 'work' | 'education';
  }> = [];
  
  let currentItem: Partial<{
    title: string;
    organization: string;
    period: string;
    description: string;
  }> | null = null;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Stop at next major section
    if (isSectionHeader(line) && !line.match(/^(senior|junior|lead|principal)/i)) {
      if (currentItem && currentItem.title && currentItem.organization) {
        items.push({
          title: currentItem.title,
          organization: currentItem.organization,
          period: currentItem.period || 'N/A',
          description: currentItem.description || '',
          type,
        });
      }
      break;
    }
    
    // Look for date patterns (e.g., "2020 - 2023", "Jan 2020 - Present")
    const dateMatch = line.match(/\b(\d{4}|[A-Z][a-z]{2,8}\s+\d{4})\s*[-–—]\s*(\d{4}|[A-Z][a-z]{2,8}\s+\d{4}|Present|Current)\b/i);
    
    if (dateMatch) {
      // Save previous item
      if (currentItem && currentItem.title && currentItem.organization) {
        items.push({
          title: currentItem.title,
          organization: currentItem.organization,
          period: currentItem.period || 'N/A',
          description: currentItem.description || '',
          type,
        });
      }
      
      // Start new item
      currentItem = { period: dateMatch[0] };
      
      // Title might be on same line before date
      const beforeDate = line.substring(0, dateMatch.index).trim();
      if (beforeDate) {
        currentItem.title = beforeDate;
      }
    } else if (currentItem && !currentItem.title && line.length > 3 && line.length < 100) {
      // Likely a title line
      currentItem.title = line;
    } else if (currentItem && !currentItem.organization && line.length > 3 && line.length < 100) {
      // Likely organization line
      currentItem.organization = line;
    } else if (currentItem && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
      // Description bullet point
      const desc = line.replace(/^[•\-*]\s*/, '').trim();
      if (currentItem.description) {
        currentItem.description = `${currentItem.description} ${desc}`;
      } else {
        currentItem.description = desc;
      }
    }
  }
  
  // Add last item
  if (currentItem && currentItem.title && currentItem.organization) {
    items.push({
      title: currentItem.title,
      organization: currentItem.organization,
      period: currentItem.period || 'N/A',
      description: currentItem.description || '',
      type,
    });
  }
  
  return items;
}

function extractProjects(lines: string[], fullText: string): Array<{
  title: string;
  description: string;
  technologies: string[];
  links: Array<{ label: string; href: string }>;
}> {
  const projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    links: Array<{ label: string; href: string }>;
  }> = [];
  
  const projectHeaders = /^(projects|portfolio|work samples|notable projects)\s*:?$/i;
  
  for (let i = 0; i < lines.length; i++) {
    if (projectHeaders.test(lines[i])) {
      let currentProject: Partial<{
        title: string;
        description: string;
        technologies: string[];
        links: Array<{ label: string; href: string }>;
      }> | null = null;
      
      for (let j = i + 1; j < lines.length; j++) {
        const line = lines[j];
        
        // Stop at next major section
        if (isSectionHeader(line)) {
          if (currentProject && currentProject.title) {
            projects.push({
              title: currentProject.title,
              description: currentProject.description || '',
              technologies: currentProject.technologies || [],
              links: currentProject.links || [],
            });
          }
          break;
        }
        
        // New project (bold/capitalized title)
        if (line.length > 3 && line.length < 80 && /^[A-Z]/.test(line) && !line.includes(':')) {
          // Save previous project
          if (currentProject && currentProject.title) {
            projects.push({
              title: currentProject.title,
              description: currentProject.description || '',
              technologies: currentProject.technologies || [],
              links: currentProject.links || [],
            });
          }
          
          currentProject = { title: line, technologies: [], links: [] };
        } else if (currentProject) {
          // Check for technologies
          const techMatch = line.match(/^(technologies|tech stack|built with)\s*:?\s*(.+)$/i);
          if (techMatch) {
            const techs = techMatch[2].split(/[,;|]/).map(t => t.trim()).filter(Boolean);
            currentProject.technologies = techs;
          } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            // Description
            const desc = line.replace(/^[•\-*]\s*/, '').trim();
            if (currentProject.description) {
              currentProject.description = `${currentProject.description} ${desc}`;
            } else {
              currentProject.description = desc;
            }
          } else if (line.match(/https?:\/\//)) {
            // Link
            const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
            if (urlMatch && currentProject.links) {
              currentProject.links.push({ label: 'View Project', href: urlMatch[1] });
            }
          }
        }
      }
      
      // Add last project
      if (currentProject && currentProject.title) {
        projects.push({
          title: currentProject.title,
          description: currentProject.description || '',
          technologies: currentProject.technologies || [],
          links: currentProject.links || [],
        });
      }
      
      break;
    }
  }
  
  return projects;
}

function extractSocialLinks(text: string): Array<{ label: string; href: string; icon: string }> {
  const links: Array<{ label: string; href: string; icon: string }> = [];
  
  // GitHub
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) {
    links.push({
      label: 'GitHub',
      href: `https://github.com/${githubMatch[1]}`,
      icon: 'github',
    });
  }
  
  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    links.push({
      label: 'LinkedIn',
      href: `https://linkedin.com/in/${linkedinMatch[1]}`,
      icon: 'linkedin',
    });
  }
  
  // Twitter/X
  const twitterMatch = text.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i);
  if (twitterMatch) {
    links.push({
      label: 'Twitter',
      href: `https://twitter.com/${twitterMatch[1]}`,
      icon: 'twitter',
    });
  }
  
  // Portfolio website
  const websiteMatch = text.match(/(?:portfolio|website)\s*:?\s*(https?:\/\/[^\s]+)/i);
  if (websiteMatch) {
    links.push({
      label: 'Website',
      href: websiteMatch[1],
      icon: 'globe',
    });
  }
  
  return links;
}

function isSectionHeader(line: string): boolean {
  const headers = [
    'summary',
    'profile',
    'objective',
    'about',
    'skills',
    'experience',
    'work experience',
    'employment',
    'education',
    'projects',
    'portfolio',
    'certifications',
    'awards',
    'publications',
    'references',
    'contact',
    'languages',
  ];
  
  const normalized = line.toLowerCase().replace(/[:\s]/g, '');
  return headers.some(h => normalized === h.replace(/\s/g, ''));
}
