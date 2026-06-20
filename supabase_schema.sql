-- ==========================================
-- PROPOSAL GENERATOR DATABASE SCHEMA
-- Target platform: Supabase PostgreSQL
-- ==========================================

-- 1. Create the proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL CHECK (char_length(client_name) > 0),
    service_requested TEXT NOT NULL CHECK (char_length(service_requested) > 0),
    project_description TEXT NOT NULL CHECK (char_length(project_description) > 0),
    tone TEXT NOT NULL CHECK (tone IN ('Professional', 'Friendly', 'Premium', 'Enterprise')),
    proposal_content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved')),
    pricing_model TEXT DEFAULT 'Fixed Price',
    estimated_cost TEXT DEFAULT 'Not specified',
    estimated_duration TEXT DEFAULT 'Not specified',
    estimated_efforts TEXT DEFAULT 'Not specified',
    currency TEXT DEFAULT '$',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add an index to query speed by user
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON public.proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON public.proposals(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Users can only select their own proposals
CREATE POLICY "Users can view their own proposals" 
ON public.proposals
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own proposals
CREATE POLICY "Users can create their own proposals" 
ON public.proposals
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own proposals
CREATE POLICY "Users can update their own proposals" 
ON public.proposals
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own proposals
CREATE POLICY "Users can delete their own proposals" 
ON public.proposals
FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Create automatic updated_at trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
