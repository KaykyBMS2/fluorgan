export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      automations: AutomationsTable
      comments: CommentsTable
      integrations: IntegrationsTable
      profiles: ProfilesTable
      subscriptions: SubscriptionsTable
      tags: TagsTable
      task_tags: TaskTagsTable
      tasks: TasksTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_premium_access: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      subscription_type: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}