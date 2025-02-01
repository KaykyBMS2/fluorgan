import { Tables } from "@/integrations/supabase/types";

export type TaskWithRelations = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  status_color: string | null;
  assigned_to: Tables<"profiles">;
  tags: Tables<"tags">[];
};