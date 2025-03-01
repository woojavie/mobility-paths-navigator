-- Create discussions table
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  replies_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  text TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create discussion_replies table
CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  likes_count INTEGER DEFAULT 0
);

-- Create discussion_likes table
CREATE TABLE IF NOT EXISTS public.discussion_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK (
    (discussion_id IS NOT NULL AND reply_id IS NULL) OR
    (discussion_id IS NULL AND reply_id IS NOT NULL)
  )
);

-- Create review_likes table
CREATE TABLE IF NOT EXISTS public.review_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create triggers to update counts
CREATE OR REPLACE FUNCTION update_discussion_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.discussions
    SET replies_count = replies_count + 1
    WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.discussions
    SET replies_count = replies_count - 1
    WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_discussion_replies_count_trigger
AFTER INSERT OR DELETE ON public.discussion_replies
FOR EACH ROW
EXECUTE FUNCTION update_discussion_replies_count();

CREATE OR REPLACE FUNCTION update_discussion_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.discussion_id IS NOT NULL THEN
      UPDATE public.discussions
      SET likes_count = likes_count + 1
      WHERE id = NEW.discussion_id;
    ELSIF NEW.reply_id IS NOT NULL THEN
      UPDATE public.discussion_replies
      SET likes_count = likes_count + 1
      WHERE id = NEW.reply_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.discussion_id IS NOT NULL THEN
      UPDATE public.discussions
      SET likes_count = likes_count - 1
      WHERE id = OLD.discussion_id;
    ELSIF OLD.reply_id IS NOT NULL THEN
      UPDATE public.discussion_replies
      SET likes_count = likes_count - 1
      WHERE id = OLD.reply_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_discussion_likes_count_trigger
AFTER INSERT OR DELETE ON public.discussion_likes
FOR EACH ROW
EXECUTE FUNCTION update_discussion_likes_count();

-- Create RLS policies
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Anyone can read discussions" ON public.discussions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read discussion replies" ON public.discussion_replies
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read discussion likes" ON public.discussion_likes
  FOR SELECT USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert discussions" ON public.discussions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert discussion replies" ON public.discussion_replies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert discussion likes" ON public.discussion_likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert review likes" ON public.review_likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only owners can update and delete
CREATE POLICY "Users can update own discussions" ON public.discussions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own discussions" ON public.discussions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own discussion replies" ON public.discussion_replies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own discussion replies" ON public.discussion_replies
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own discussion likes" ON public.discussion_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own review likes" ON public.review_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS discussions_user_id_idx ON public.discussions(user_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS discussion_replies_discussion_id_idx ON public.discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS discussion_replies_user_id_idx ON public.discussion_replies(user_id);
CREATE INDEX IF NOT EXISTS discussion_likes_discussion_id_idx ON public.discussion_likes(discussion_id);
CREATE INDEX IF NOT EXISTS discussion_likes_reply_id_idx ON public.discussion_likes(reply_id);
CREATE INDEX IF NOT EXISTS discussion_likes_user_id_idx ON public.discussion_likes(user_id);
CREATE INDEX IF NOT EXISTS review_likes_review_id_idx ON public.review_likes(review_id);
CREATE INDEX IF NOT EXISTS review_likes_user_id_idx ON public.review_likes(user_id); 