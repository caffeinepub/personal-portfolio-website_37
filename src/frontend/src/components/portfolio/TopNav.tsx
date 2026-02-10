import { useState, useEffect } from 'react';
import { Menu, X, Edit, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopNavProps {
  onRequestChanges: () => void;
  onFillDetails: () => void;
}

export function TopNav({ onRequestChanges, onFillDetails }: TopNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            AM
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                {link.label}
              </a>
            ))}
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
              variant="outline"
              size="sm"
              onClick={onRequestChanges}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Request Changes
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1"
                >
                  {link.label}
                </a>
              ))}
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onFillDetails();
                  setIsMobileMenuOpen(false);
                }}
                className="gap-2 w-full"
              >
                <User className="h-4 w-4" />
                Fill My Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onRequestChanges();
                  setIsMobileMenuOpen(false);
                }}
                className="gap-2 w-full"
              >
                <Edit className="h-4 w-4" />
                Request Changes
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
