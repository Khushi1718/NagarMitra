-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-pictures',
    'profile-pictures',
    true,
    5242880, -- 5MB limit
    '{"image/jpeg","image/jpg","image/png","image/webp"}'
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile pictures bucket
-- Since we're using custom auth, we'll use more permissive policies for now
-- In production, you'd want to implement server-side upload with proper validation

CREATE POLICY "Anyone can upload profile pictures"
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profile-pictures');

CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Anyone can update profile pictures"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Anyone can delete profile pictures"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-pictures');

-- Add profile picture URL column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;