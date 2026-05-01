-- Create 'lists' table
CREATE TABLE IF NOT EXISTS lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id)
);

-- Create 'tasks' table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  important BOOLEAN DEFAULT FALSE,
  my_day BOOLEAN DEFAULT FALSE,
  list_id UUID REFERENCES lists(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  due_date TIMESTAMP WITH TIME ZONE,
  note TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Note: Subtasks would likely be another table referencing tasks
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

-- Enable RLS and setup policies
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Lists policies
CREATE POLICY "Users can only view their own lists" ON lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own lists" ON lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own lists" ON lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own lists" ON lists FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can only view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);
