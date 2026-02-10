import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, RotateCcw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PortfolioContent } from '@/content/portfolioContent';
import { parseResumeToPortfolioPatch } from '@/lib/resume/parseResumeToPortfolioPatch';
import { applyPortfolioPatch } from '@/lib/resume/applyPortfolioPatch';
import { summarizePortfolioPatch, type PatchSummary } from '@/lib/resume/summarizePortfolioPatch';

interface FillMyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentContent: PortfolioContent;
  onSave: (content: PortfolioContent) => void;
  onReset: () => void;
  hasOverride: boolean;
}

export function FillMyDetailsDialog({
  open,
  onOpenChange,
  currentContent,
  onSave,
  onReset,
  hasOverride,
}: FillMyDetailsDialogProps) {
  const [formData, setFormData] = useState<PortfolioContent>(currentContent);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Resume import state
  const [resumeText, setResumeText] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [generatedPatch, setGeneratedPatch] = useState<Partial<PortfolioContent> | null>(null);
  const [patchSummary, setPatchSummary] = useState<PatchSummary | null>(null);

  useEffect(() => {
    if (open) {
      setFormData(currentContent);
      setErrors({});
      setResumeText('');
      setResumeError('');
      setGeneratedPatch(null);
      setPatchSummary(null);
    }
  }, [open, currentContent]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.hero.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.hero.role.trim()) {
      newErrors.role = 'Role is required';
    }
    if (!formData.hero.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }
    if (!formData.contact.email.trim()) {
      newErrors.email = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    onReset();
    setShowResetDialog(false);
    onOpenChange(false);
  };

  const handleGenerateDraft = () => {
    setResumeError('');
    
    if (!resumeText.trim()) {
      setResumeError('Please paste your resume text to generate a draft.');
      return;
    }

    try {
      const patch = parseResumeToPortfolioPatch(resumeText);
      const summary = summarizePortfolioPatch(patch);
      
      if (!summary.hasChanges) {
        setResumeError('Could not extract any information from the resume. Please check the format and try again.');
        return;
      }
      
      setGeneratedPatch(patch);
      setPatchSummary(summary);
    } catch (error) {
      setResumeError('An error occurred while parsing the resume. Please try again.');
      console.error('Resume parsing error:', error);
    }
  };

  const handleApplyDraft = () => {
    if (generatedPatch) {
      const updatedContent = applyPortfolioPatch(formData, generatedPatch);
      setFormData(updatedContent);
      setGeneratedPatch(null);
      setPatchSummary(null);
      setResumeText('');
    }
  };

  const handleDiscardDraft = () => {
    setGeneratedPatch(null);
    setPatchSummary(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Fill My Details</DialogTitle>
            <DialogDescription>
              Update your portfolio information. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-180px)] px-6">
            <Tabs defaultValue="hero" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="resume">
                  <FileText className="h-4 w-4 mr-1" />
                  Resume
                </TabsTrigger>
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="footer">Footer</TabsTrigger>
              </TabsList>

              {/* Resume Import Tab */}
              <TabsContent value="resume" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Import from Resume</CardTitle>
                    <CardDescription>
                      Paste your resume text below to automatically fill your portfolio details.
                      The parser will extract your name, role, skills, experience, and more.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!generatedPatch ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="resume-text">Resume Text</Label>
                          <Textarea
                            id="resume-text"
                            value={resumeText}
                            onChange={(e) => {
                              setResumeText(e.target.value);
                              setResumeError('');
                            }}
                            placeholder="Paste your resume text here..."
                            rows={12}
                            className="font-mono text-sm"
                          />
                          {resumeError && (
                            <div className="flex items-start gap-2 text-sm text-destructive">
                              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{resumeError}</span>
                            </div>
                          )}
                        </div>
                        <Button onClick={handleGenerateDraft} className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Draft
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                            Draft Generated Successfully
                          </div>
                          
                          {patchSummary && (
                            <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                              <h4 className="font-medium text-sm">Extracted Information:</h4>
                              
                              {patchSummary.sections.hero.name && (
                                <div className="text-sm">
                                  <span className="font-medium">Name:</span> {patchSummary.sections.hero.name}
                                </div>
                              )}
                              
                              {patchSummary.sections.hero.role && (
                                <div className="text-sm">
                                  <span className="font-medium">Role:</span> {patchSummary.sections.hero.role}
                                </div>
                              )}
                              
                              {patchSummary.sections.contact.email && (
                                <div className="text-sm">
                                  <span className="font-medium">Email:</span> {patchSummary.sections.contact.email}
                                </div>
                              )}
                              
                              {patchSummary.sections.hero.bio && (
                                <div className="text-sm">
                                  <span className="font-medium">Bio:</span> {patchSummary.sections.hero.bio.substring(0, 100)}
                                  {patchSummary.sections.hero.bio.length > 100 ? '...' : ''}
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                {patchSummary.sections.about.paragraphCount > 0 && (
                                  <div className="text-sm">
                                    <span className="font-medium">About:</span> {patchSummary.sections.about.paragraphCount} paragraph(s)
                                  </div>
                                )}
                                
                                {patchSummary.sections.skills.categoryCount > 0 && (
                                  <div className="text-sm">
                                    <span className="font-medium">Skills:</span> {patchSummary.sections.skills.categoryCount} categories, {patchSummary.sections.skills.totalSkills} skills
                                  </div>
                                )}
                                
                                {patchSummary.sections.experience.itemCount > 0 && (
                                  <div className="text-sm">
                                    <span className="font-medium">Experience:</span> {patchSummary.sections.experience.itemCount} item(s)
                                  </div>
                                )}
                                
                                {patchSummary.sections.projects.projectCount > 0 && (
                                  <div className="text-sm">
                                    <span className="font-medium">Projects:</span> {patchSummary.sections.projects.projectCount} project(s)
                                  </div>
                                )}
                                
                                {patchSummary.sections.footer.socialLinkCount > 0 && (
                                  <div className="text-sm">
                                    <span className="font-medium">Social Links:</span> {patchSummary.sections.footer.socialLinkCount} link(s)
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button onClick={handleApplyDraft} className="flex-1">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Apply Draft
                            </Button>
                            <Button onClick={handleDiscardDraft} variant="outline" className="flex-1">
                              Discard
                            </Button>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Applying the draft will update the form fields in other tabs. You can review and edit them before saving.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hero Tab */}
              <TabsContent value="hero" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.hero.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, name: e.target.value },
                      })
                    }
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.hero.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, role: e.target.value },
                      })
                    }
                    placeholder="Your professional role"
                  />
                  {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.hero.bio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, bio: e.target.value },
                      })
                    }
                    placeholder="A brief introduction about yourself"
                    rows={4}
                  />
                  {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Call-to-Action Buttons</Label>
                  {formData.hero.ctas.map((cta, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={cta.label}
                            onChange={(e) => {
                              const newCtas = [...formData.hero.ctas];
                              newCtas[index] = { ...cta, label: e.target.value };
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, ctas: newCtas },
                              });
                            }}
                            placeholder="Button label"
                          />
                          <Input
                            value={cta.href}
                            onChange={(e) => {
                              const newCtas = [...formData.hero.ctas];
                              newCtas[index] = { ...cta, href: e.target.value };
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, ctas: newCtas },
                              });
                            }}
                            placeholder="Link (e.g., #projects)"
                          />
                          <Select
                            value={cta.variant || 'default'}
                            onValueChange={(value: 'default' | 'outline') => {
                              const newCtas = [...formData.hero.ctas];
                              newCtas[index] = { ...cta, variant: value };
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, ctas: newCtas },
                              });
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newCtas = formData.hero.ctas.filter((_, i) => i !== index);
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, ctas: newCtas },
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          ctas: [
                            ...formData.hero.ctas,
                            { label: 'New Button', href: '#', variant: 'default' },
                          ],
                        },
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Button
                  </Button>
                </div>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="about-title">Section Title</Label>
                  <Input
                    id="about-title"
                    value={formData.about.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, title: e.target.value },
                      })
                    }
                    placeholder="About Me"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Paragraphs</Label>
                  {formData.about.paragraphs.map((paragraph, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex gap-2">
                          <Textarea
                            value={paragraph}
                            onChange={(e) => {
                              const newParagraphs = [...formData.about.paragraphs];
                              newParagraphs[index] = e.target.value;
                              setFormData({
                                ...formData,
                                about: { ...formData.about, paragraphs: newParagraphs },
                              });
                            }}
                            placeholder="Paragraph text"
                            rows={3}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newParagraphs = formData.about.paragraphs.filter(
                                (_, i) => i !== index
                              );
                              setFormData({
                                ...formData,
                                about: { ...formData.about, paragraphs: newParagraphs },
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          paragraphs: [...formData.about.paragraphs, ''],
                        },
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Paragraph
                  </Button>
                </div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="skills-title">Section Title</Label>
                  <Input
                    id="skills-title"
                    value={formData.skills.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: { ...formData.skills, title: e.target.value },
                      })
                    }
                    placeholder="Skills & Technologies"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skill Categories</Label>
                  {formData.skills.categories.map((category, catIndex) => (
                    <Card key={catIndex}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Input
                            value={category.name}
                            onChange={(e) => {
                              const newCategories = [...formData.skills.categories];
                              newCategories[catIndex] = {
                                ...category,
                                name: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                skills: { ...formData.skills, categories: newCategories },
                              });
                            }}
                            placeholder="Category name"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newCategories = formData.skills.categories.filter(
                                (_, i) => i !== catIndex
                              );
                              setFormData({
                                ...formData,
                                skills: { ...formData.skills, categories: newCategories },
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {category.skills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="flex gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                const newCategories = [...formData.skills.categories];
                                const newSkills = [...category.skills];
                                newSkills[skillIndex] = e.target.value;
                                newCategories[catIndex] = { ...category, skills: newSkills };
                                setFormData({
                                  ...formData,
                                  skills: { ...formData.skills, categories: newCategories },
                                });
                              }}
                              placeholder="Skill name"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newCategories = [...formData.skills.categories];
                                const newSkills = category.skills.filter(
                                  (_, i) => i !== skillIndex
                                );
                                newCategories[catIndex] = { ...category, skills: newSkills };
                                setFormData({
                                  ...formData,
                                  skills: { ...formData.skills, categories: newCategories },
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newCategories = [...formData.skills.categories];
                            newCategories[catIndex] = {
                              ...category,
                              skills: [...category.skills, ''],
                            };
                            setFormData({
                              ...formData,
                              skills: { ...formData.skills, categories: newCategories },
                            });
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Skill
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        skills: {
                          ...formData.skills,
                          categories: [
                            ...formData.skills.categories,
                            { name: 'New Category', skills: [] },
                          ],
                        },
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="projects-title">Section Title</Label>
                  <Input
                    id="projects-title"
                    value={formData.projects.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projects: { ...formData.projects, title: e.target.value },
                      })
                    }
                    placeholder="Featured Projects"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Projects</Label>
                  {formData.projects.projects.map((project, projIndex) => (
                    <Card key={projIndex}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Project {projIndex + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newProjects = formData.projects.projects.filter(
                                (_, i) => i !== projIndex
                              );
                              setFormData({
                                ...formData,
                                projects: { ...formData.projects, projects: newProjects },
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={project.title}
                            onChange={(e) => {
                              const newProjects = [...formData.projects.projects];
                              newProjects[projIndex] = { ...project, title: e.target.value };
                              setFormData({
                                ...formData,
                                projects: { ...formData.projects, projects: newProjects },
                              });
                            }}
                            placeholder="Project title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) => {
                              const newProjects = [...formData.projects.projects];
                              newProjects[projIndex] = {
                                ...project,
                                description: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                projects: { ...formData.projects, projects: newProjects },
                              });
                            }}
                            placeholder="Project description"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Technologies (comma-separated)</Label>
                          <Input
                            value={project.technologies.join(', ')}
                            onChange={(e) => {
                              const newProjects = [...formData.projects.projects];
                              newProjects[projIndex] = {
                                ...project,
                                technologies: e.target.value
                                  .split(',')
                                  .map((t) => t.trim())
                                  .filter(Boolean),
                              };
                              setFormData({
                                ...formData,
                                projects: { ...formData.projects, projects: newProjects },
                              });
                            }}
                            placeholder="React, Node.js, PostgreSQL"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Links</Label>
                          {project.links.map((link, linkIndex) => (
                            <div key={linkIndex} className="flex gap-2">
                              <Input
                                value={link.label}
                                onChange={(e) => {
                                  const newProjects = [...formData.projects.projects];
                                  const newLinks = [...project.links];
                                  newLinks[linkIndex] = { ...link, label: e.target.value };
                                  newProjects[projIndex] = { ...project, links: newLinks };
                                  setFormData({
                                    ...formData,
                                    projects: { ...formData.projects, projects: newProjects },
                                  });
                                }}
                                placeholder="Label"
                                className="w-32"
                              />
                              <Input
                                value={link.href}
                                onChange={(e) => {
                                  const newProjects = [...formData.projects.projects];
                                  const newLinks = [...project.links];
                                  newLinks[linkIndex] = { ...link, href: e.target.value };
                                  newProjects[projIndex] = { ...project, links: newLinks };
                                  setFormData({
                                    ...formData,
                                    projects: { ...formData.projects, projects: newProjects },
                                  });
                                }}
                                placeholder="https://..."
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newProjects = [...formData.projects.projects];
                                  const newLinks = project.links.filter(
                                    (_, i) => i !== linkIndex
                                  );
                                  newProjects[projIndex] = { ...project, links: newLinks };
                                  setFormData({
                                    ...formData,
                                    projects: { ...formData.projects, projects: newProjects },
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newProjects = [...formData.projects.projects];
                              newProjects[projIndex] = {
                                ...project,
                                links: [...project.links, { label: 'Link', href: '' }],
                              };
                              setFormData({
                                ...formData,
                                projects: { ...formData.projects, projects: newProjects },
                              });
                            }}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Link
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        projects: {
                          ...formData.projects,
                          projects: [
                            ...formData.projects.projects,
                            {
                              title: 'New Project',
                              description: '',
                              technologies: [],
                              links: [],
                            },
                          ],
                        },
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="experience-title">Section Title</Label>
                  <Input
                    id="experience-title"
                    value={formData.experience.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: { ...formData.experience, title: e.target.value },
                      })
                    }
                    placeholder="Experience & Education"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Experience Items</Label>
                  {formData.experience.items.map((item, itemIndex) => (
                    <Card key={itemIndex}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {item.type === 'work' ? 'Work' : 'Education'} {itemIndex + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newItems = formData.experience.items.filter(
                                (_, i) => i !== itemIndex
                              );
                              setFormData({
                                ...formData,
                                experience: { ...formData.experience, items: newItems },
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={item.type}
                            onValueChange={(value: 'work' | 'education') => {
                              const newItems = [...formData.experience.items];
                              newItems[itemIndex] = { ...item, type: value };
                              setFormData({
                                ...formData,
                                experience: { ...formData.experience, items: newItems },
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...formData.experience.items];
                              newItems[itemIndex] = { ...item, title: e.target.value };
                              setFormData({
                                ...formData,
                                experience: { ...formData.experience, items: newItems },
                              });
                            }}
                            placeholder="Job title or degree"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Organization</Label>
                          <Input
                            value={item.organization}
                            onChange={(e) => {
                              const newItems = [...formData.experience.items];
                              newItems[itemIndex] = { ...item, organization: e.target.value };
                              setFormData({
                                ...formData,
                                experience: { ...formData.experience, items: newItems },
                              });
                            }}
                            placeholder="Company or institution"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Period</Label>
                          <Input
                            value={item.period}
                            onChange={(e) => {
                              const newItems = [...formData.experience.items];
                              newItems[itemIndex] = { ...item, period: e.target.value };
                              setFormData({
                                ...formData,
                                experience: { ...formData.experience, items: newItems },
                              });
                            }}
                            placeholder="2020 - Present"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...formData.experience.items];
                              newItems[itemIndex] = { ...item, description: e.target.value };
                              setFormData({
                                ...formData,
                                experience: { ...formData.experience, items: newItems },
                              });
                            }}
                            placeholder="Brief description"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        experience: {
                          ...formData.experience,
                          items: [
                            ...formData.experience.items,
                            {
                              title: '',
                              organization: '',
                              period: '',
                              description: '',
                              type: 'work',
                            },
                          ],
                        },
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-title">Section Title</Label>
                  <Input
                    id="contact-title"
                    value={formData.contact.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, title: e.target.value },
                      })
                    }
                    placeholder="Get In Touch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-description">Description</Label>
                  <Textarea
                    id="contact-description"
                    value={formData.contact.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, description: e.target.value },
                      })
                    }
                    placeholder="Contact section description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, email: e.target.value },
                      })
                    }
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </TabsContent>

              {/* Footer Tab */}
              <TabsContent value="footer" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Social Links</Label>
                  {formData.footer.socialLinks.map((link, linkIndex) => (
                    <Card key={linkIndex}>
                      <CardContent className="pt-4">
                        <div className="flex gap-2">
                          <Input
                            value={link.label}
                            onChange={(e) => {
                              const newLinks = [...formData.footer.socialLinks];
                              newLinks[linkIndex] = { ...link, label: e.target.value };
                              setFormData({
                                ...formData,
                                footer: { ...formData.footer, socialLinks: newLinks },
                              });
                            }}
                            placeholder="Label"
                            className="w-32"
                          />
                          <Input
                            value={link.href}
                            onChange={(e) => {
                              const newLinks = [...formData.footer.socialLinks];
                              newLinks[linkIndex] = { ...link, href: e.target.value };
                              setFormData({
                                ...formData,
                                footer: { ...formData.footer, socialLinks: newLinks },
                              });
                            }}
                            placeholder="https://..."
                          />
                          <Input
                            value={link.icon}
                            onChange={(e) => {
                              const newLinks = [...formData.footer.socialLinks];
                              newLinks[linkIndex] = { ...link, icon: e.target.value };
                              setFormData({
                                ...formData,
                                footer: { ...formData.footer, socialLinks: newLinks },
                              });
                            }}
                            placeholder="Icon name"
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newLinks = formData.footer.socialLinks.filter(
                                (_, i) => i !== linkIndex
                              );
                              setFormData({
                                ...formData,
                                footer: { ...formData.footer, socialLinks: newLinks },
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        footer: {
                          ...formData.footer,
                          socialLinks: [
                            ...formData.footer.socialLinks,
                            { label: 'Link', href: '', icon: 'link' },
                          ],
                        },
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Link
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copyright">Copyright Text</Label>
                  <Input
                    id="copyright"
                    value={formData.footer.copyright}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        footer: { ...formData.footer, copyright: e.target.value },
                      })
                    }
                    placeholder="© 2026 Your Name. All rights reserved."
                  />
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <DialogFooter className="px-6 pb-6 flex-row gap-2">
            {hasOverride && (
              <Button
                variant="outline"
                onClick={() => setShowResetDialog(true)}
                className="mr-auto"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default Content?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all your custom changes and restore the original portfolio content.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
