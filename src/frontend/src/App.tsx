import { useState } from 'react';
import { HeroSection } from './components/portfolio/HeroSection';
import { AboutSection } from './components/portfolio/AboutSection';
import { SkillsSection } from './components/portfolio/SkillsSection';
import { ProjectsSection } from './components/portfolio/ProjectsSection';
import { ExperienceSection } from './components/portfolio/ExperienceSection';
import { ContactSection } from './components/portfolio/ContactSection';
import { Footer } from './components/portfolio/Footer';
import { TopNav } from './components/portfolio/TopNav';
import { RequestChangesDialog } from './components/portfolio/RequestChangesDialog';
import { FillMyDetailsDialog } from './components/portfolio/FillMyDetailsDialog';
import { usePortfolioContentOverride } from './hooks/usePortfolioContentOverride';

function App() {
  const [isRequestChangesOpen, setIsRequestChangesOpen] = useState(false);
  const [isFillDetailsOpen, setIsFillDetailsOpen] = useState(false);
  
  const {
    effectiveContent,
    saveContent,
    clearOverride,
    hasOverride,
    isLoading,
  } = usePortfolioContentOverride();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav 
        onRequestChanges={() => setIsRequestChangesOpen(true)}
        onFillDetails={() => setIsFillDetailsOpen(true)}
      />
      <main>
        <HeroSection content={effectiveContent.hero} />
        <AboutSection content={effectiveContent.about} />
        <SkillsSection content={effectiveContent.skills} />
        <ProjectsSection content={effectiveContent.projects} />
        <ExperienceSection content={effectiveContent.experience} />
        <ContactSection content={effectiveContent.contact} />
      </main>
      <Footer 
        content={effectiveContent.footer} 
        onRequestChanges={() => setIsRequestChangesOpen(true)}
        onFillDetails={() => setIsFillDetailsOpen(true)}
      />
      <RequestChangesDialog
        open={isRequestChangesOpen}
        onOpenChange={setIsRequestChangesOpen}
        destinationEmail={effectiveContent.contact.email}
      />
      <FillMyDetailsDialog
        open={isFillDetailsOpen}
        onOpenChange={setIsFillDetailsOpen}
        currentContent={effectiveContent}
        onSave={saveContent}
        onReset={clearOverride}
        hasOverride={hasOverride}
      />
    </div>
  );
}

export default App;
