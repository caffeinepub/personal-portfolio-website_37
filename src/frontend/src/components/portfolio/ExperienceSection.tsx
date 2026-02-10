import { Briefcase, GraduationCap } from 'lucide-react';
import type { ExperienceContent } from '@/content/portfolioContent';

interface ExperienceSectionProps {
  content: ExperienceContent;
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 md:py-32">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12 md:mb-16 text-center">
            {content.title}
          </h2>
          <div className="space-y-8 md:space-y-12">
            {content.items.map((item, index) => (
              <div key={index} className="relative pl-8 md:pl-12 border-l-2 border-primary/20">
                {/* Icon */}
                <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  {item.type === 'work' ? (
                    <Briefcase className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <GraduationCap className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 md:pb-12">
                  <div className="mb-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-base sm:text-lg text-primary font-medium">
                      {item.organization}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{item.period}</p>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
