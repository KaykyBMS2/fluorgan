export interface SubscriptionsTable {
  Row: {
    created_at: string
    id: string
    is_active: boolean | null
    plan_type: "free" | "premium" | null
    trial_end: string | null
    trial_start: string | null
    updated_at: string
    user_id: string
  }
  Insert: {
    created_at?: string
    id?: string
    is_active?: boolean | null
    plan_type?: "free" | "premium" | null
    trial_end?: string | null
    trial_start?: string | null
    updated_at?: string
    user_id: string
  }
  Update: {
    created_at?: string
    id?: string
    is_active?: boolean | null
    plan_type?: "free" | "premium" | null
    trial_end?: string | null
    trial_start?: string | null
    updated_at?: string
    user_id?: string
  }
  Relationships: []
}