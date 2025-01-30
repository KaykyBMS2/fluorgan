export interface TaskTagsTable {
  Row: {
    tag_id: string
    task_id: string
  }
  Insert: {
    tag_id: string
    task_id: string
  }
  Update: {
    tag_id?: string
    task_id?: string
  }
  Relationships: [
    {
      foreignKeyName: "task_tags_tag_id_fkey"
      columns: ["tag_id"]
      isOneToOne: false
      referencedRelation: "tags"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "task_tags_task_id_fkey"
      columns: ["task_id"]
      isOneToOne: false
      referencedRelation: "tasks"
      referencedColumns: ["id"]
    }
  ]
}