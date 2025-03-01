-- Add parent_reply_id column to discussion_replies table
ALTER TABLE public.discussion_replies 
ADD COLUMN IF NOT EXISTS parent_reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE SET NULL;

-- Create an index on parent_reply_id for better performance
CREATE INDEX IF NOT EXISTS idx_discussion_replies_parent_reply_id ON public.discussion_replies(parent_reply_id);

-- Update the RLS policies to ensure proper access
ALTER POLICY "Enable read access for all users" ON public.discussion_replies
USING (true);

ALTER POLICY "Enable insert for authenticated users only" ON public.discussion_replies
WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Enable update for users based on user_id" ON public.discussion_replies
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Enable delete for users based on user_id" ON public.discussion_replies
USING (auth.uid() = user_id); 