import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { HeroContent } from '@/content/portfolioContent';

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.backgroundImage}
          alt=""
          className="w-full h-full object-cover opacity-20"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                <img
                  src={content.avatarImage}
                  alt={content.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6">
                {content.name}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-primary font-semibold mb-6 md:mb-8">
                {content.role}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 md:mb-10 leading-relaxed">
                {content.bio}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {content.ctas.map((cta, index) => (
                  <Button
                    key={index}
                    variant={cta.variant || 'default'}
                    size="lg"
                    asChild
                    className="group"
                  >
                    <a href={cta.href} onClick={(e) => handleCtaClick(e, cta.href)}>
                      {cta.label}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
