import { useState, useEffect } from 'react';
import { PortfolioContent, portfolioContent as defaultContent } from '@/content/portfolioContent';

const STORAGE_KEY = 'portfolio_content_override';

function validatePortfolioContent(data: any): data is PortfolioContent {
  try {
    // Basic validation - ensure required fields exist
    return (
      data &&
      typeof data === 'object' &&
      data.hero &&
      typeof data.hero.name === 'string' &&
      typeof data.hero.role === 'string' &&
      typeof data.hero.bio === 'string' &&
      data.about &&
      typeof data.about.title === 'string' &&
      Array.isArray(data.about.paragraphs) &&
      data.skills &&
      Array.isArray(data.skills.categories) &&
      data.projects &&
      Array.isArray(data.projects.projects) &&
      data.experience &&
      Array.isArray(data.experience.items) &&
      data.contact &&
      typeof data.contact.email === 'string' &&
      data.footer &&
      Array.isArray(data.footer.socialLinks)
    );
  } catch {
    return false;
  }
}

export function usePortfolioContentOverride() {
  const [effectiveContent, setEffectiveContent] = useState<PortfolioContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (validatePortfolioContent(parsed)) {
          setEffectiveContent(parsed);
        } else {
          console.warn('Invalid portfolio content in localStorage, using defaults');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load portfolio content from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveContent = (content: PortfolioContent) => {
    try {
      if (!validatePortfolioContent(content)) {
        throw new Error('Invalid portfolio content structure');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setEffectiveContent(content);
    } catch (error) {
      console.error('Failed to save portfolio content:', error);
      throw error;
    }
  };

  const clearOverride = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setEffectiveContent(defaultContent);
    } catch (error) {
      console.error('Failed to clear portfolio content override:', error);
    }
  };

  const hasOverride = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  };

  return {
    effectiveContent,
    saveContent,
    clearOverride,
    hasOverride: hasOverride(),
    isLoading,
  };
}
