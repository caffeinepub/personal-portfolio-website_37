import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import type { ProjectsContent } from '@/content/portfolioContent';

interface ProjectsSectionProps {
  content: ProjectsContent;
}

export function ProjectsSection({ content }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12 md:mb-16 text-center">
            {content.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {content.projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectsContent['projects'][0] }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail */}
      {project.thumbnail && !imageError && (
        <div className="relative w-full aspect-video overflow-hidden bg-muted">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}
      {(!project.thumbnail || imageError) && (
        <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="text-4xl font-bold text-primary/20">{project.title.charAt(0)}</div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <CardDescription className="line-clamp-3">{project.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-4 border-t">
        {project.links.map((link, index) => (
          <Button key={index} variant="outline" size="sm" asChild className="flex-1">
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label.toLowerCase().includes('github') ? (
                <Github className="mr-2 h-4 w-4" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              {link.label}
            </a>
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
