import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { communityService } from '@/services/communityService';
import { AccessibilityPointType, AccessibilityIssueType } from './types';

interface ContributionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'point' | 'issue';
  location: { lat: number; lng: number };
}

export function ContributionDialog({ isOpen, onClose, type, location }: ContributionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    isOperational: true
  });

  const pointTypes: AccessibilityPointType[] = [
    'elevator',
    'ramp',
    'accessible_entrance',
    'accessible_bathroom',
    'tactile_paving',
    'handicap_parking'
  ];

  const issueTypes: AccessibilityIssueType[] = [
    'construction',
    'broken_elevator',
    'blocked_path',
    'temporary_closure',
    'other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (type === 'point') {
        await communityService.addAccessibilityPoint({
          name: formData.name,
          type: formData.type as AccessibilityPointType,
          description: formData.description || null,
          latitude: location.lat,
          longitude: location.lng,
          is_operational: formData.isOperational
        });
        toast({
          title: "Success",
          description: "Accessibility point added successfully!",
        });
      } else {
        await communityService.reportAccessibilityIssue({
          title: formData.name,
          type: formData.type as AccessibilityIssueType,
          description: formData.description || null,
          latitude: location.lat,
          longitude: location.lng,
          start_date: new Date().toISOString()
        });
        toast({
          title: "Success",
          description: "Issue reported successfully!",
        });
      }

      // Reset form and close dialog
      setFormData({
        name: '',
        type: '',
        description: '',
        isOperational: true
      });
      onClose();
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      isOperational: true
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'point' ? 'Add Accessibility Point' : 'Report Issue'}
          </DialogTitle>
          <DialogDescription>
            {type === 'point' 
              ? 'Add a new accessibility feature to help others navigate better.'
              : 'Report an accessibility issue to alert the community.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {type === 'point' ? 'Location Name' : 'Issue Title'}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={type === 'point' ? 'e.g., Main Entrance Ramp' : 'e.g., Broken Elevator'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {(type === 'point' ? pointTypes : issueTypes).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any helpful details..."
              className="h-20"
            />
          </div>

          {type === 'point' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOperational"
                checked={formData.isOperational}
                onChange={(e) => setFormData({ ...formData, isOperational: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isOperational">Currently operational</Label>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 