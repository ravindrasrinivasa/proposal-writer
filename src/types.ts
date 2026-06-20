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

export interface ProposalMetadata {
  pricing_model: string;
  estimated_cost: string;
  estimated_duration: string;
  estimated_efforts: string;
  currency: string;
}

export function parseProposalMetadata(content?: string): ProposalMetadata {
  const result: ProposalMetadata = {
    pricing_model: "Fixed Price",
    estimated_cost: "Not specified",
    estimated_duration: "Not specified",
    estimated_efforts: "Not specified",
    currency: "$",
  };

  if (!content) return result;

  // Try parsing frontmatter
  const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (frontMatterMatch) {
    const lines = frontMatterMatch[1].split("\n");
    for (const line of lines) {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.substring(0, idx).trim().toLowerCase();
        const value = line.substring(idx + 1).trim();
        if (key === "pricing_model" || key === "pricing-model") result.pricing_model = value;
        else if (key === "estimated_cost" || key === "estimated-cost" || key === "cost") result.estimated_cost = value;
        else if (key === "estimated_duration" || key === "estimated-duration" || key === "duration") result.estimated_duration = value;
        else if (key === "estimated_efforts" || key === "estimated-efforts" || key === "efforts" || key === "effort") result.estimated_efforts = value;
        else if (key === "currency") result.currency = value;
      }
    }
  } else {
    // Regex fallbacks for non-frontmatter proposals
    const costMatch = content.match(/(?:Cost|Budget):\s*([^\n\r]+)/i);
    const durationMatch = content.match(/(?:Duration|Timeline):\s*([^\n\r]+)/i);
    const effortsMatch = content.match(/(?:Efforts|Hours):\s*([^\n\r]+)/i);
    const modelMatch = content.match(/(?:Pricing Model|Model):\s*([^\n\r]+)/i);

    if (costMatch) result.estimated_cost = costMatch[1].trim().replace(/\*\*|__/g, "");
    if (durationMatch) result.estimated_duration = durationMatch[1].trim().replace(/\*\*|__/g, "");
    if (effortsMatch) result.estimated_efforts = effortsMatch[1].trim().replace(/\*\*|__/g, "");
    if (modelMatch) result.pricing_model = modelMatch[1].trim().replace(/\*\*|__/g, "");
  }

  return result;
}
