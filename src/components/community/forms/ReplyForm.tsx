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
      
      await createReply({
        discussion_id: discussionId,
        content,
        user_id: user.id,
        author: user.email?.split('@')[0] || 'Anonymous',
        parent_reply_id: replyToId
      });
      
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
      toast({
        title: 'Error',
        description: 'There was a problem posting your reply. Please try again.',
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
                  className={replyToId ? "min-h-[80px]" : "min-h-[100px]"}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 