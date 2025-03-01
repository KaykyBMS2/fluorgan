
import { Tables } from "@/integrations/supabase/types";
import { Profile } from "./profile";

export type Board = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_archived: boolean;
  lists?: List[];
  permissions?: BoardPermission[];
};

export type List = {
  id: string;
  name: string;
  position: number;
  board_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_archived: boolean;
  cards?: Card[];
};

export type Card = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  due_date: string | null;
  list_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to: string | null;
  is_archived: boolean;
  color: string | null;
  labels?: CardLabel[];
  checklists?: CardChecklist[];
  comments?: CardComment[];
  attachments?: CardAttachment[];
  assigned_user?: Profile;
};

export type CardLabel = {
  id: string;
  card_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type CardChecklist = {
  id: string;
  title: string;
  card_id: string;
  created_at: string;
  updated_at: string;
  items?: ChecklistItem[];
};

export type ChecklistItem = {
  id: string;
  text: string;
  is_completed: boolean;
  position: number;
  checklist_id: string;
  created_at: string;
  updated_at: string;
};

export type CardComment = {
  id: string;
  content: string;
  card_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
};

export type CardAttachment = {
  id: string;
  file_name: string;
  file_path: string;
  content_type: string;
  card_id: string;
  created_by: string;
  created_at: string;
};

export type PermissionLevel = "view" | "edit" | "admin";

export type BoardPermission = {
  id: string;
  board_id: string;
  user_id: string;
  permission_level: PermissionLevel;
  created_at: string;
  user?: Profile;
};
