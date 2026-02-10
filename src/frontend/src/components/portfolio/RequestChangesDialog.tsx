import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RequestChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationEmail: string;
}

const sections = [
  { value: 'hero', label: 'Hero' },
  { value: 'about', label: 'About' },
  { value: 'skills', label: 'Skills' },
  { value: 'projects', label: 'Projects' },
  { value: 'experience', label: 'Experience' },
  { value: 'contact', label: 'Contact' },
  { value: 'footer', label: 'Footer' },
];

export function RequestChangesDialog({
  open,
  onOpenChange,
  destinationEmail,
}: RequestChangesDialogProps) {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [requestedEdits, setRequestedEdits] = useState('');
  const [resumeText, setResumeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSection || !requestedEdits.trim()) {
      return;
    }

    const sectionLabel = sections.find((s) => s.value === selectedSection)?.label || selectedSection;

    const subject = encodeURIComponent('Portfolio change request');
    const body = encodeURIComponent(
      `Section: ${sectionLabel}\n\nRequested Changes:\n${requestedEdits}${
        resumeText.trim() ? `\n\nResume/Additional Information:\n${resumeText}` : ''
      }`
    );

    const mailtoUrl = `mailto:${destinationEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    // Reset form and close dialog
    setSelectedSection('');
    setRequestedEdits('');
    setResumeText('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedSection('');
    setRequestedEdits('');
    setResumeText('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
          <DialogDescription>
            Select a section and describe the changes you'd like to see. Your request will be sent
            via email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section">Section *</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection} required>
                <SelectTrigger id="section">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.value} value={section.value}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edits">Requested Changes *</Label>
              <Textarea
                id="edits"
                placeholder="Describe the changes you'd like to see..."
                value={requestedEdits}
                onChange={(e) => setRequestedEdits(e.target.value)}
                required
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume / Additional Information (Optional)</Label>
              <Textarea
                id="resume"
                placeholder="Paste your resume text or additional context here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedSection || !requestedEdits.trim()}>
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
