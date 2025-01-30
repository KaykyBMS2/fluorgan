export interface CommentsTable {
  Row: {
    content: string
    created_at: string
    created_by: string
    id: string
    task_id: string | null
    updated_at: string
  }
  Insert: {
    content: string
    created_at?: string
    created_by: string
    id?: string
    task_id?: string | null
    updated_at?: string
  }
  Update: {
    content?: string
    created_at?: string
    created_by?: string
    id?: string
    task_id?: string | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "comments_created_by_fkey"
      columns: ["created_by"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "comments_task_id_fkey"
      columns: ["task_id"]
      isOneToOne: false
      referencedRelation: "tasks"
      referencedColumns: ["id"]
    }
  ]
}