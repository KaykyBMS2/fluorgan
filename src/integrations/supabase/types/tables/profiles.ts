export interface ProfilesTable {
  Row: {
    avatar_url: string | null
    created_at: string
    first_name: string | null
    id: string
    language: string | null
    last_name: string | null
    updated_at: string
  }
  Insert: {
    avatar_url?: string | null
    created_at?: string
    first_name?: string | null
    id: string
    language?: string | null
    last_name?: string | null
    updated_at?: string
  }
  Update: {
    avatar_url?: string | null
    created_at?: string
    first_name?: string | null
    id?: string
    language?: string | null
    last_name?: string | null
    updated_at?: string
  }
  Relationships: []
}