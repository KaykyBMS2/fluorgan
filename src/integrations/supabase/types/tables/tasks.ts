export interface TasksTable {
  Row: {
    assigned_to: string | null
    created_at: string
    created_by: string
    description: string | null
    due_date: string | null
    id: string
    priority: string
    status: string
    status_color: string | null
    title: string
    updated_at: string
  }
  Insert: {
    assigned_to?: string | null
    created_at?: string
    created_by: string
    description?: string | null
    due_date?: string | null
    id?: string
    priority?: string
    status?: string
    status_color?: string | null
    title: string
    updated_at?: string
  }
  Update: {
    assigned_to?: string | null
    created_at?: string
    created_by?: string
    description?: string | null
    due_date?: string | null
    id?: string
    priority?: string
    status?: string
    status_color?: string | null
    title?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "tasks_assigned_to_fkey"
      columns: ["assigned_to"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "tasks_created_by_fkey"
      columns: ["created_by"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}