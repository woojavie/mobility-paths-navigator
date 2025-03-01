-- Add SELECT policy to discussion_likes table
CREATE POLICY IF NOT EXISTS "Anyone can read discussion likes" 
ON public.discussion_likes FOR SELECT USING (true); 