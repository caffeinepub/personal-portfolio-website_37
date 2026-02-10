import { SiGithub, SiLinkedin, SiX } from 'react-icons/si';
import { Mail, Heart, Edit, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FooterContent } from '@/content/portfolioContent';

interface FooterProps {
  content: FooterContent;
  onRequestChanges: () => void;
  onFillDetails: () => void;
}

export function Footer({ content, onRequestChanges, onFillDetails }: FooterProps) {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      github: <SiGithub className="h-5 w-5" />,
      linkedin: <SiLinkedin className="h-5 w-5" />,
      twitter: <SiX className="h-5 w-5" />,
      mail: <Mail className="h-5 w-5" />,
    };
    return iconMap[iconName.toLowerCase()] || null;
  };

  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'portfolio-app'
  );

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            {content.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm p-2"
                aria-label={link.label}
              >
                {getIcon(link.icon)}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="default"
              size="sm"
              onClick={onFillDetails}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Fill My Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRequestChanges}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Edit className="h-4 w-4" />
              Request Changes
            </Button>
          </div>

          {/* Copyright & Attribution */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{content.copyright}</p>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              Built with{' '}
              <Heart className="h-4 w-4 text-primary fill-primary" aria-label="love" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
