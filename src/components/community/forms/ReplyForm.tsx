import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createReply } from '@/services/communityService';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, MessageSquare } from 'lucide-react';

const formSchema = z.object({
  content: z.string().min(3, {
    message: 'Reply must be at least 3 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ReplyFormProps {
  discussionId: string;
  replyToId?: string;
  onSuccess?: () => void;
}

export function ReplyForm({ discussionId, replyToId, onSuccess }: ReplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to post a reply.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let content = values.content;
      
      // If replying to another reply, add a mention
      if (replyToId) {
        // We could fetch the author of the reply being responded to
        // For now, we'll just indicate it's a reply to another comment
        content = `[Reply] ${content}`;
      }
      
      console.log('Submitting reply:', {
        discussion_id: discussionId,
        content,
        user_id: user.id,
        author: user.email?.split('@')[0] || 'Anonymous',
        parent_reply_id: replyToId
      });
      
      const reply = await createReply({
        discussion_id: discussionId,
        content,
        user_id: user.id,
        author: user.email?.split('@')[0] || 'Anonymous',
        parent_reply_id: replyToId
      });
      
      console.log('Reply created successfully:', reply);
      
      toast({
        title: 'Reply posted!',
        description: 'Your reply has been successfully added.',
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      
      let errorMessage = 'There was a problem posting your reply. Please try again.';
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        
        if (error.message.includes('foreign key constraint')) {
          errorMessage = 'The discussion you are replying to may have been deleted.';
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder={replyToId ? "Write your reply..." : "Add to the discussion..."} 
                  className={replyToId ? "min-h-[80px] border-primary/30 focus-visible:ring-primary/50" : "min-h-[100px] border-primary/30 focus-visible:ring-primary/50"}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-5 w-5" />
                Post Reply
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 