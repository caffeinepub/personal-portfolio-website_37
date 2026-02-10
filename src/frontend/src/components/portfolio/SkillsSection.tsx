import { Badge } from '@/components/ui/badge';
import type { SkillsContent } from '@/content/portfolioContent';

interface SkillsSectionProps {
  content: SkillsContent;
}

export function SkillsSection({ content }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12 md:mb-16 text-center">
            {content.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {content.categories.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-sm px-4 py-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
