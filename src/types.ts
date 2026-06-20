export type ToneType = "Professional" | "Friendly" | "Premium" | "Enterprise";

export interface Proposal {
  id: string;
  user_id: string; // Linked to auth.users in Supabase
  client_name: string;
  service_requested: string;
  project_description: string;
  tone: ToneType;
  proposal_content: string;
  status: "draft" | "sent" | "approved";
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
}
