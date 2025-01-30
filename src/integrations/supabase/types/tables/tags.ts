export interface TagsTable {
  Row: {
    color: string
    created_at: string
    created_by: string
    id: string
    name: string
    updated_at: string
  }
  Insert: {
    color: string
    created_at?: string
    created_by: string
    id?: string
    name: string
    updated_at?: string
  }
  Update: {
    color?: string
    created_at?: string
    created_by?: string
    id?: string
    name?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "tags_created_by_fkey"
      columns: ["created_by"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}