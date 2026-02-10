import type { PortfolioContent } from '@/content/portfolioContent';

type PortfolioPatch = Partial<PortfolioContent>;

export interface PatchSummary {
  hasChanges: boolean;
  sections: {
    hero: { name?: string; role?: string; bio?: string };
    about: { paragraphCount: number };
    skills: { categoryCount: number; totalSkills: number };
    experience: { itemCount: number };
    projects: { projectCount: number };
    contact: { email?: string };
    footer: { socialLinkCount: number };
  };
}

/**
 * Creates a compact summary of what was extracted from the resume.
 */
export function summarizePortfolioPatch(patch: PortfolioPatch): PatchSummary {
  const summary: PatchSummary = {
    hasChanges: false,
    sections: {
      hero: {},
      about: { paragraphCount: 0 },
      skills: { categoryCount: 0, totalSkills: 0 },
      experience: { itemCount: 0 },
      projects: { projectCount: 0 },
      contact: {},
      footer: { socialLinkCount: 0 },
    },
  };

  // Hero section
  if (patch.hero) {
    if (patch.hero.name?.trim()) {
      summary.sections.hero.name = patch.hero.name;
      summary.hasChanges = true;
    }
    if (patch.hero.role?.trim()) {
      summary.sections.hero.role = patch.hero.role;
      summary.hasChanges = true;
    }
    if (patch.hero.bio?.trim()) {
      summary.sections.hero.bio = patch.hero.bio;
      summary.hasChanges = true;
    }
  }

  // About section
  if (patch.about?.paragraphs) {
    const validParagraphs = patch.about.paragraphs.filter(p => p.trim());
    summary.sections.about.paragraphCount = validParagraphs.length;
    if (validParagraphs.length > 0) {
      summary.hasChanges = true;
    }
  }

  // Skills section
  if (patch.skills?.categories) {
    const validCategories = patch.skills.categories.filter(
      cat => cat.name.trim() && cat.skills.length > 0
    );
    summary.sections.skills.categoryCount = validCategories.length;
    summary.sections.skills.totalSkills = validCategories.reduce(
      (sum, cat) => sum + cat.skills.length,
      0
    );
    if (validCategories.length > 0) {
      summary.hasChanges = true;
    }
  }

  // Experience section
  if (patch.experience?.items) {
    const validItems = patch.experience.items.filter(
      item => item.title.trim() && item.organization.trim()
    );
    summary.sections.experience.itemCount = validItems.length;
    if (validItems.length > 0) {
      summary.hasChanges = true;
    }
  }

  // Projects section
  if (patch.projects?.projects) {
    const validProjects = patch.projects.projects.filter(
      proj => proj.title.trim() && proj.description.trim()
    );
    summary.sections.projects.projectCount = validProjects.length;
    if (validProjects.length > 0) {
      summary.hasChanges = true;
    }
  }

  // Contact section
  if (patch.contact?.email?.trim()) {
    summary.sections.contact.email = patch.contact.email;
    summary.hasChanges = true;
  }

  // Footer section
  if (patch.footer?.socialLinks) {
    const validLinks = patch.footer.socialLinks.filter(
      link => link.label.trim() && link.href.trim()
    );
    summary.sections.footer.socialLinkCount = validLinks.length;
    if (validLinks.length > 0) {
      summary.hasChanges = true;
    }
  }

  return summary;
}
