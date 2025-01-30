import { Json } from "../database";

export interface IntegrationsTable {
  Row: {
    created_at: string
    credentials: Json | null
    id: string
    is_active: boolean | null
    provider: string
    updated_at: string
    user_id: string
  }
  Insert: {
    created_at?: string
    credentials?: Json | null
    id?: string
    is_active?: boolean | null
    provider: string
    updated_at?: string
    user_id: string
  }
  Update: {
    created_at?: string
    credentials?: Json | null
    id?: string
    is_active?: boolean | null
    provider?: string
    updated_at?: string
    user_id?: string
  }
  Relationships: []
}