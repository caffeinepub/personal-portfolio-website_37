import type { PortfolioContent } from '@/content/portfolioContent';

type PortfolioPatch = Partial<PortfolioContent>;

/**
 * Safely applies a resume patch to existing portfolio content.
 * Only overwrites fields that are present and non-empty in the patch.
 */
export function applyPortfolioPatch(
  current: PortfolioContent,
  patch: PortfolioPatch
): PortfolioContent {
  const result: PortfolioContent = JSON.parse(JSON.stringify(current));

  // Apply hero fields
  if (patch.hero) {
    if (patch.hero.name && patch.hero.name.trim()) {
      result.hero.name = patch.hero.name;
    }
    if (patch.hero.role && patch.hero.role.trim()) {
      result.hero.role = patch.hero.role;
    }
    if (patch.hero.bio && patch.hero.bio.trim()) {
      result.hero.bio = patch.hero.bio;
    }
    // Keep existing CTAs, avatar, and background
  }

  // Apply about paragraphs
  if (patch.about?.paragraphs && patch.about.paragraphs.length > 0) {
    const validParagraphs = patch.about.paragraphs.filter(p => p.trim());
    if (validParagraphs.length > 0) {
      result.about.paragraphs = validParagraphs;
    }
  }

  // Apply skills categories
  if (patch.skills?.categories && patch.skills.categories.length > 0) {
    const validCategories = patch.skills.categories.filter(
      cat => cat.name.trim() && cat.skills.length > 0
    );
    if (validCategories.length > 0) {
      result.skills.categories = validCategories;
    }
  }

  // Apply experience items
  if (patch.experience?.items && patch.experience.items.length > 0) {
    const validItems = patch.experience.items.filter(
      item => item.title.trim() && item.organization.trim()
    );
    if (validItems.length > 0) {
      result.experience.items = validItems;
    }
  }

  // Apply projects
  if (patch.projects?.projects && patch.projects.projects.length > 0) {
    const validProjects = patch.projects.projects.filter(
      proj => proj.title.trim() && proj.description.trim()
    );
    if (validProjects.length > 0) {
      result.projects.projects = validProjects;
    }
  }

  // Apply contact email
  if (patch.contact?.email && patch.contact.email.trim()) {
    result.contact.email = patch.contact.email;
  }

  // Apply social links
  if (patch.footer?.socialLinks && patch.footer.socialLinks.length > 0) {
    const validLinks = patch.footer.socialLinks.filter(
      link => link.label.trim() && link.href.trim()
    );
    if (validLinks.length > 0) {
      // Merge with existing links, avoiding duplicates
      const existingHrefs = new Set(result.footer.socialLinks.map(l => l.href));
      const newLinks = validLinks.filter(link => !existingHrefs.has(link.href));
      result.footer.socialLinks = [...result.footer.socialLinks, ...newLinks];
    }
  }

  return result;
}
