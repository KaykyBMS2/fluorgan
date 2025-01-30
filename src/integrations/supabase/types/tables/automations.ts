import { Json } from "../database";

export interface AutomationsTable {
  Row: {
    action_type: string
    conditions: Json | null
    created_at: string
    id: string
    is_active: boolean | null
    name: string
    trigger_type: string
    updated_at: string
    user_id: string
  }
  Insert: {
    action_type: string
    conditions?: Json | null
    created_at?: string
    id?: string
    is_active?: boolean | null
    name: string
    trigger_type: string
    updated_at?: string
    user_id: string
  }
  Update: {
    action_type?: string
    conditions?: Json | null
    created_at?: string
    id?: string
    is_active?: boolean | null
    name?: string
    trigger_type?: string
    updated_at?: string
    user_id?: string
  }
  Relationships: []
}