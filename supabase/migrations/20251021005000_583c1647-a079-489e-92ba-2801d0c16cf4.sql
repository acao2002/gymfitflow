-- Create Membership table
CREATE TABLE public.membership (
  plan_id SERIAL PRIMARY KEY,
  plan_name TEXT NOT NULL,
  duration_months INTEGER NOT NULL
);

-- Create Trainer table
CREATE TABLE public.trainer (
  trainer_id SERIAL PRIMARY KEY,
  first TEXT NOT NULL,
  middle TEXT,
  last TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  hourly_rate INTEGER NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Create Personal_Trainer table
CREATE TABLE public.personal_trainer (
  trainer_id INTEGER PRIMARY KEY REFERENCES public.trainer(trainer_id) ON DELETE CASCADE,
  max_members INTEGER NOT NULL
);

-- Create Group_Trainer table
CREATE TABLE public.group_trainer (
  trainer_id INTEGER PRIMARY KEY REFERENCES public.trainer(trainer_id) ON DELETE CASCADE,
  max_classes INTEGER NOT NULL
);

-- Create Member table
CREATE TABLE public.member (
  member_id SERIAL PRIMARY KEY,
  first TEXT NOT NULL,
  middle TEXT,
  last TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  trainer_id INTEGER REFERENCES public.trainer(trainer_id) ON DELETE SET NULL,
  membership_id INTEGER REFERENCES public.membership(plan_id) ON DELETE SET NULL
);

-- Create Class table
CREATE TABLE public.class (
  class_id SERIAL PRIMARY KEY,
  class_name TEXT NOT NULL,
  schedule_time TEXT NOT NULL,
  max_capacity INTEGER NOT NULL,
  trainer_id INTEGER REFERENCES public.trainer(trainer_id) ON DELETE SET NULL
);

-- Create Attendance table
CREATE TABLE public.attendance (
  attendance_id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  class_id INTEGER NOT NULL REFERENCES public.class(class_id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES public.member(member_id) ON DELETE CASCADE,
  UNIQUE(date, class_id, member_id)
);

-- Create Train table (Personal Trainer <-> Member)
CREATE TABLE public.train (
  trainer_id INTEGER NOT NULL REFERENCES public.personal_trainer(trainer_id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES public.member(member_id) ON DELETE CASCADE,
  PRIMARY KEY (trainer_id, member_id)
);

-- Create Teach table (Group Trainer <-> Class)
CREATE TABLE public.teach (
  trainer_id INTEGER NOT NULL REFERENCES public.group_trainer(trainer_id) ON DELETE CASCADE,
  class_id INTEGER NOT NULL REFERENCES public.class(class_id) ON DELETE CASCADE,
  PRIMARY KEY (trainer_id, class_id)
);

-- Create Take table (Member <-> Class)
CREATE TABLE public.take (
  class_id INTEGER NOT NULL REFERENCES public.class(class_id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES public.member(member_id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, member_id)
);

-- Enable RLS on all tables
ALTER TABLE public.membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_trainer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_trainer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.train ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.take ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read access for gym management system)
CREATE POLICY "Allow public read access" ON public.membership FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.membership FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.membership FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.membership FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.trainer FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.trainer FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.trainer FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.trainer FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.personal_trainer FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.personal_trainer FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.personal_trainer FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.personal_trainer FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.group_trainer FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.group_trainer FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.group_trainer FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.group_trainer FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.member FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.member FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.member FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.member FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.class FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.class FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.class FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.class FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.attendance FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.attendance FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.train FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.train FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.train FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.train FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.teach FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.teach FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.teach FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.teach FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.take FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.take FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.take FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.take FOR DELETE USING (true);

-- Insert sample membership plans
INSERT INTO public.membership (plan_name, duration_months) VALUES
  ('Basic', 1),
  ('Premium', 12);

-- Insert sample trainers
INSERT INTO public.trainer (first, middle, last, phone_number, email, hourly_rate, rating) VALUES
  ('John', 'M', 'Smith', '555-0101', 'john.smith@gym.com', 50, 5),
  ('Sarah', 'K', 'Johnson', '555-0102', 'sarah.johnson@gym.com', 45, 4),
  ('Mike', NULL, 'Williams', '555-0103', 'mike.williams@gym.com', 55, 5),
  ('Emma', 'L', 'Brown', '555-0104', 'emma.brown@gym.com', 40, 4);

-- Assign trainers to types
INSERT INTO public.personal_trainer (trainer_id, max_members) VALUES
  (1, 10),
  (2, 8);

INSERT INTO public.group_trainer (trainer_id, max_classes) VALUES
  (3, 5),
  (4, 6);