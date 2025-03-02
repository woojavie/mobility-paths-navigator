import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';
import { ReplyForm } from './ReplyForm';

interface ReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  discussionId: string;
  replyToId?: string;
  replyToAuthor?: string;
  onSuccess: () => void;
}

export function ReplyDialog({ 
  isOpen, 
  onClose, 
  discussionId, 
  replyToId, 
  replyToAuthor,
  onSuccess 
}: ReplyDialogProps) {
  
  console.log('ReplyDialog props:', { isOpen, discussionId, replyToId, replyToAuthor });
  
  const handleSuccess = () => {
    console.log('ReplyDialog: handleSuccess called');
    onSuccess();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-blue-700">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-700" />
            {replyToId 
              ? `Reply to ${replyToAuthor || 'comment'}`
              : 'Add your reply to this discussion'
            }
          </DialogTitle>
          <DialogDescription>
            Share your thoughts or ask a question. Be respectful and constructive.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ReplyForm 
            discussionId={discussionId} 
            replyToId={replyToId}
            key={`dialog-reply-form-${discussionId}-${replyToId || 'main'}`}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 