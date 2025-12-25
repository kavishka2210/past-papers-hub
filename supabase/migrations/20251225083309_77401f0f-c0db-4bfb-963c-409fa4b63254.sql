-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  paper_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create papers table
CREATE TABLE public.papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  paper_url TEXT,
  marking_scheme_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and papers (educational resources)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view papers" ON public.papers FOR SELECT USING (true);
CREATE POLICY "Anyone can view notifications" ON public.notifications FOR SELECT USING (true);

-- Create indexes for better search performance
CREATE INDEX idx_papers_year ON public.papers(year);
CREATE INDEX idx_papers_category ON public.papers(category_id);
CREATE INDEX idx_papers_title ON public.papers USING gin(to_tsvector('english', title));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Insert sample categories
INSERT INTO public.categories (name, description, paper_count) VALUES
  ('Science for Technology', 'GCE A/L Science for Technology past papers with marking schemes', 10),
  ('Engineering Technology', 'GCE A/L Engineering Technology past papers with marking schemes', 10),
  ('Information and Communications Technology', 'GCE A/L ICT past papers with marking schemes', 15);

-- Insert sample papers for Science for Technology
INSERT INTO public.papers (category_id, year, title, description, paper_url, marking_scheme_url)
SELECT 
  c.id,
  y.year,
  'Science for Technology ' || y.year,
  'GCE A/L Science for Technology examination paper for year ' || y.year,
  'https://example.com/papers/sft-' || y.year || '.pdf',
  'https://example.com/marking/sft-' || y.year || '.pdf'
FROM public.categories c
CROSS JOIN (SELECT generate_series(2017, 2024) AS year) y
WHERE c.name = 'Science for Technology';

-- Insert sample papers for Engineering Technology
INSERT INTO public.papers (category_id, year, title, description, paper_url, marking_scheme_url)
SELECT 
  c.id,
  y.year,
  'Engineering Technology ' || y.year,
  'GCE A/L Engineering Technology examination paper for year ' || y.year,
  'https://example.com/papers/et-' || y.year || '.pdf',
  'https://example.com/marking/et-' || y.year || '.pdf'
FROM public.categories c
CROSS JOIN (SELECT generate_series(2017, 2024) AS year) y
WHERE c.name = 'Engineering Technology';

-- Insert sample papers for ICT
INSERT INTO public.papers (category_id, year, title, description, paper_url, marking_scheme_url)
SELECT 
  c.id,
  y.year,
  'Information and Communications Technology ' || y.year,
  'GCE A/L ICT examination paper for year ' || y.year,
  'https://example.com/papers/ict-' || y.year || '.pdf',
  'https://example.com/marking/ict-' || y.year || '.pdf'
FROM public.categories c
CROSS JOIN (SELECT generate_series(2017, 2024) AS year) y
WHERE c.name = 'Information and Communications Technology';

-- Insert sample notifications
INSERT INTO public.notifications (title, message) VALUES
  ('New Papers Added', '2024 A/L past papers are now available for download.'),
  ('System Update', 'We have improved the search functionality for better results.');