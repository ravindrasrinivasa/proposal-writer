import React, { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen";
import ProposalList from "./components/ProposalList";
import ProposalForm from "./components/ProposalForm";
import ProposalEditor from "./components/ProposalEditor";
import { Proposal, UserProfile, ToneType } from "./types";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { FileText, LogOut, Sparkles, AlertTriangle, CheckCircle, Database, HelpCircle, LayoutGrid } from "lucide-react";

// Pre-populate with realistic mock data in Local Mode for an instant high-fidelity experience
const INITIAL_DEMO_PROPOSALS: Proposal[] = [
  {
    id: "demo-id-1",
    user_id: "mock-user-uuid-123456",
    client_name: "Lumina Therapeutics",
    service_requested: "Brand Design Pack & Next.js Website Setup",
    project_description: "Deliver a complete visual brand style guide followed by a custom highperformance Next.js marketing landing page integrated with headless CMS.",
    tone: "Friendly",
    proposal_content: `# Brand Development & Web Experience Proposal

## Executive Summary
This proposal outlines our approach to revitalizing the Lumina Therapeutics brand identity and deploying a world-class marketing website. Our goal is to cement Lumina's position as a reliable therapeutic innovator by offering an accessible digital hub.

## Understanding of Requirement
Lumina requires an identity that balances scientific precision with patient accessibility. The companion Next.js website must ensure speed, impeccable SEO, and lightweight responsiveness for users across desktop and mobile.

## Proposed Solution
We propose a three-phased design and development sprint:
1. **Brand Discovery & Style Guide:** Formulating signature assets, color codes, and web typography systems.
2. **Next.js Implementation:** Constructing a fast Web Vitals-compliant marketing platform.
3. **Headless CMS integration:** Training managers on zero-code content publishing.

## Scope of Work
- **Brand Guide:** 3 initial logo iterations, color selection palette, typography scale guidelines.
- **Headless Website:** 4 standard web views (Home, Science, Mission, Contact).
- **Hosting configuration:** Secure, fast hosting pipeline with automated Vercel setup.

## Timeline & Milestones
- **Weeks 1-2:** Interactive style workshops and mock-up wireframes (Milestone 1 approval).
- **Weeks 3-6:** React/Next.js frontend development and CMS wiring (Milestone 2 approval).
- **Weeks 7-8:** Content entry, QA, launch, and training handoff (Final Delivery).

## Assumptions & Exclusions
- Lumina will hand off raw medical articles and corporate copy.
- Domain transfers are managed directly by customer domain leads.

## Next Steps
To begin partnership:
1. Approve this proposal draft by changing status to 'Approved'.
2. Review the scheduled brand kickoff agenda.`,
    status: "approved",
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 34 * 3600 * 1000).toISOString(),
  },
  {
    id: "demo-id-2",
    user_id: "mock-user-uuid-123456",
    client_name: "Apex Finance Hub",
    service_requested: "Security Audit and Payment Gateway Refactor",
    project_description: "Review vulnerable legacy PHP gateways, modernizing integration with secure Stripe Checkout API and adding secure dashboard authentication checks.",
    tone: "Enterprise",
    proposal_content: `# Security Refactor & Payment Gateway Audit

## Executive Summary
Apex Finance Hub requires high-efficiency compliance and refactoring for client accounts portals. This proposal details how we upgrade insecure API pipelines to standard token-based Stripe mechanisms.

## Understanding of Requirement
We must address legacy token vulnerabilities without altering current customer records. Minimizing downtime during launch is critical.

## Proposed Solution
We will systematically deprecate direct PHP handlers, shifting transactional operations safely onto secure payment APIs.

## Scope of Work
- In-depth network penetration tests on the checkout controller pathways.
- Configuration of environment secrets to hide payment parameters.
- Launching an modern checkout redirection widget.

## Timeline & Milestones
- **Sprint 1 (Week 1):** Code auditing and vulnerability assessment.
- **Sprint 2 (Week 2):** Sandbox integrations and API testing.
- **Sprint 3 (Week 3):** Live deployment, monitoring, and transfer.`,
    status: "draft",
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  }
];

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [currentView, setCurrentView] = useState<"dashboard" | "new-proposal" | "editor">("dashboard");
  const [selectedProposal, setSelectedProposal] = useState<Partial<Proposal> | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Authenticate & Load User on Boot
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function checkUserOnStartup() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
              });
            } else {
              setUser(null);
            }
          });
          unsubscribe = subscription?.unsubscribe;

          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            setUser({
              id: data.user.id,
              email: data.user.email || "",
            });
          }
        } catch (err) {
          console.error("Auth precheck failed:", err);
        }
      } else {
        // Local mode auto-restore if user was left in local-storage
        const cachedUser = localStorage.getItem("proposal_gen_user");
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch {
            localStorage.removeItem("proposal_gen_user");
          }
        }
      }
      setIsInitialized(true);
    }
    checkUserOnStartup();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Fetch proposals once authenticated
  useEffect(() => {
    if (!user) {
      setProposals([]);
      return;
    }

    async function fetchProposals() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("proposals")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) {
            // If table doesn't exist yet but user wants to use a database, show helper
            if (error.code === "PGRST116" || error.message.includes("does not exist")) {
              setErrorBanner("Wait! Your database tables are missing. Please execute the SQL code in 'supabase_schema.sql' inside your Supabase project's SQL editor.");
            }
            throw error;
          }
          if (data) {
            setProposals(data as Proposal[]);
          }
        } catch (err: any) {
          console.error("Database query failed:", err);
          setErrorBanner("Failed to retrieve credentials from Supabase: " + (err.message || err));
        }
      } else {
        // Demo storage
        const localProposalsStr = localStorage.getItem(`proposal_gen_proposals_${user.id}`);
        if (localProposalsStr) {
          try {
            setProposals(JSON.parse(localProposalsStr));
          } catch {
            setProposals(INITIAL_DEMO_PROPOSALS);
          }
        } else {
          // Initialize with some wonderful starter drafts
          const filteredStarter = INITIAL_DEMO_PROPOSALS.map(p => ({ ...p, user_id: user.id }));
          setProposals(filteredStarter);
          localStorage.setItem(`proposal_gen_proposals_${user.id}`, JSON.stringify(filteredStarter));
        }
      }
    }

    fetchProposals();
  }, [user]);

  const handleAuthSuccess = (newProfile: UserProfile) => {
    setUser(newProfile);
    if (!isSupabaseConfigured) {
      localStorage.setItem("proposal_gen_user", JSON.stringify(newProfile));
    }
    setErrorBanner(null);
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("proposal_gen_user");
    }
    setUser(null);
    setCurrentView("dashboard");
    setSelectedProposal(null);
    setErrorBanner(null);
  };

  // Generate trigger: Send values to the server endpoint
  const handleGenerateProposal = async (formData: {
    clientName: string;
    serviceRequested: string;
    projectDescription: string;
    tone: ToneType;
    pricingModel: string;
    estimatedCost: string;
    estimatedDuration: string;
    estimatedEfforts: string;
    currency: string;
  }) => {
    if (!user) return;
    setErrorBanner(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during Gemini compilation on the server-side.");
      }

      const generatedContent = data.proposalContent;

      const newProposalDraft: Partial<Proposal> = {
        client_name: formData.clientName,
        service_requested: formData.serviceRequested,
        project_description: formData.projectDescription,
        tone: formData.tone,
        proposal_content: generatedContent,
        status: "draft",
      };

      setSelectedProposal(newProposalDraft);
      setCurrentView("editor");
    } catch (err: any) {
      console.error(err);
      setErrorBanner(err.message || "Failed to parse API parameters. Please confirm settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save/Update proposal to DB/local storage
  const handleSaveProposal = async (updatedFields: Partial<Proposal>) => {
    if (!user) return;
    setErrorBanner(null);
    setIsSaving(true);

    const now = new Date().toISOString();

    try {
      if (isSupabaseConfigured && supabase) {
        if (updatedFields.id) {
          // UPDATE
          const { data, error } = await supabase
            .from("proposals")
            .update({
              client_name: updatedFields.client_name,
              service_requested: updatedFields.service_requested,
              project_description: updatedFields.project_description,
              tone: updatedFields.tone,
              proposal_content: updatedFields.proposal_content,
              status: updatedFields.status,
              updated_at: now,
            })
            .eq("id", updatedFields.id)
            .select();

          if (error) throw error;
          
          if (data && data[0]) {
            setProposals(prev =>
              prev.map(p => (p.id === updatedFields.id ? (data[0] as Proposal) : p))
            );
            setSelectedProposal(data[0]);
          }
        } else {
          // INSERT NEW
          const { data, error } = await supabase
            .from("proposals")
            .insert({
              user_id: user.id,
              client_name: updatedFields.client_name,
              service_requested: updatedFields.service_requested,
              project_description: updatedFields.project_description,
              tone: updatedFields.tone,
              proposal_content: updatedFields.proposal_content,
              status: updatedFields.status || "draft",
              created_at: now,
              updated_at: now,
            })
            .select();

          if (error) throw error;

          if (data && data[0]) {
            setProposals(prev => [data[0] as Proposal, ...prev]);
            setSelectedProposal(data[0]);
          }
        }
      } else {
        // DEMO STATE LOGIC
        let savedProposal: Proposal;
        let nextProposalsList = [...proposals];

        if (updatedFields.id) {
          nextProposalsList = nextProposalsList.map(p => {
            if (p.id === updatedFields.id) {
              const updated = {
                ...p,
                client_name: updatedFields.client_name!,
                service_requested: updatedFields.service_requested!,
                project_description: updatedFields.project_description!,
                tone: updatedFields.tone!,
                proposal_content: updatedFields.proposal_content!,
                status: updatedFields.status!,
                updated_at: now,
              };
              savedProposal = updated;
              return updated;
            }
            return p;
          });
        } else {
          const newId = `local-id-${Math.random().toString(36).substr(2, 9)}`;
          const fresh: Proposal = {
            id: newId,
            user_id: user.id,
            client_name: updatedFields.client_name || "Client Name",
            service_requested: updatedFields.service_requested || "Service Requested",
            project_description: updatedFields.project_description || "",
            tone: updatedFields.tone || "Professional",
            proposal_content: updatedFields.proposal_content || "",
            status: updatedFields.status || "draft",
            created_at: now,
            updated_at: now,
          };
          savedProposal = fresh;
          nextProposalsList = [fresh, ...nextProposalsList];
        }

        setProposals(nextProposalsList);
        localStorage.setItem(`proposal_gen_proposals_${user.id}`, JSON.stringify(nextProposalsList));
        setSelectedProposal(savedProposal!);
      }
    } catch (err: any) {
      console.error(err);
      setErrorBanner("Could not save to active storage structure. Details: " + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProposal = async (id: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this proposal draft? This cannot be undone.")) {
      return;
    }
    setErrorBanner(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("proposals").delete().eq("id", id);
        if (error) throw error;
        setProposals(prev => prev.filter(p => p.id !== id));
      } else {
        const nextList = proposals.filter(p => p.id !== id);
        setProposals(nextList);
        localStorage.setItem(`proposal_gen_proposals_${user.id}`, JSON.stringify(nextList));
      }
      
      // If we deleted the active editing proposal
      if (selectedProposal && selectedProposal.id === id) {
        setSelectedProposal(null);
        setCurrentView("dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setErrorBanner("Failed to delete selected proposal entry. " + (err.message || err));
    }
  };

  const handleOpenProposal = (p: Proposal) => {
    setSelectedProposal(p);
    setCurrentView("editor");
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center">
        <div className="h-10 w-10 border-4 border-slate-900 border-t-transparent animate-spin rounded-full"></div>
        <span className="mt-4 text-xs font-semibold text-slate-500 font-mono tracking-widest uppercase animate-pulse">
          Initializing Proposal Space...
        </span>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Dynamic Nav Header */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-slate-900 rounded-md"></div>
              <div>
                <span className="font-bold text-slate-900 font-sans tracking-tight text-base sm:text-lg block hover:opacity-85 cursor-pointer" onClick={() => { setSelectedProposal(null); setCurrentView("dashboard"); }}>
                  Proposal Generator
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-medium block">
                  v1.2 // 3-Person Agency Unit
                </span>
              </div>
            </div>

            {/* Right Header Status Bar */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-medium text-slate-500">
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Logged as: <strong className="text-slate-800">{user.email}</strong></span>
              </div>

              {/* Db configuration status badge */}
              {isSupabaseConfigured ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="h-3 w-3" />
                  <span className="hidden sm:inline">Database Live</span>
                </div>
              ) : (
                <div 
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200"
                  title="Running in client storage. To run Supabase, hook VITE_SUPABASE_URL and key."
                >
                  <Database className="h-3 w-3 animate-pulse" />
                  <span>Demo Mode</span>
                </div>
              )}

              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 h-8 text-xs font-semibold text-slate-650 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Error message container */}
      {errorBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-sm text-red-800">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="font-sans leading-relaxed">
              <span className="font-bold">Error/Alert:</span> {errorBanner}
              <button 
                onClick={() => setErrorBanner(null)} 
                type="button" 
                className="ml-3 font-semibold underline text-red-950 focus:outline-hidden"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Routed Area */}
      <main className="py-2">
        {currentView === "dashboard" && (
          <ProposalList
            proposals={proposals}
            onNewProposal={() => {
              setSelectedProposal(null);
              setCurrentView("new-proposal");
            }}
            onSelectProposal={handleOpenProposal}
            onDeleteProposal={handleDeleteProposal}
          />
        )}

        {currentView === "new-proposal" && (
          <ProposalForm
            onBack={() => setCurrentView("dashboard")}
            onSubmit={handleGenerateProposal}
            isGenerating={isGenerating}
          />
        )}

        {currentView === "editor" && selectedProposal && (
          <ProposalEditor
            proposal={selectedProposal}
            onBack={() => {
              setSelectedProposal(null);
              setCurrentView("dashboard");
            }}
            onSave={handleSaveProposal}
            isSaving={isSaving}
          />
        )}
      </main>
    </div>
  );
}
