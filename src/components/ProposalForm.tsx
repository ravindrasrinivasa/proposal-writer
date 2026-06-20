import React, { useState } from "react";
import { ToneType } from "../types";
import { Sparkles, ArrowLeft, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

interface ProposalFormProps {
  onBack: () => void;
  onSubmit: (formData: {
    clientName: string;
    serviceRequested: string;
    projectDescription: string;
    tone: ToneType;
  }) => void;
  isGenerating: boolean;
}

export default function ProposalForm({ onBack, onSubmit, isGenerating }: ProposalFormProps) {
  const [clientName, setClientName] = useState("");
  const [serviceRequested, setServiceRequested] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tone, setTone] = useState<ToneType>("Professional");

  const tones: { name: ToneType; desc: string }[] = [
    { name: "Professional", desc: "Clear, reliable, objective, and detailed. Ideal for general business." },
    { name: "Friendly", desc: "Warm, collaborative, fresh, and modern. Great for tech start-ups and design sprints." },
    { name: "Premium", desc: "Sophisticated, authoritative, elegant. Tailored for high-end digital design or boutique consulting." },
    { name: "Enterprise", desc: "Structured, formal, risk-aware, and extremely robust. Fit for corporations or public sectors." },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !serviceRequested.trim() || !projectDescription.trim()) {
      return;
    }
    onSubmit({
      clientName: clientName.trim(),
      serviceRequested: serviceRequested.trim(),
      projectDescription: projectDescription.trim(),
      tone,
    });
  };

  const loadExample = () => {
    setClientName("Acme Retail Corp");
    setServiceRequested("E-Commerce Web Replatform & Design Refresh");
    setProjectDescription(
      "Re-engineer Acme's digital store layout, migrating from legacy platform to high-performance Headless commerce. " +
      "Requires responsive checkout flow, Shopify Plus integration, 3 product categories, and clean design components " +
      "completed in 8 weeks."
    );
    setTone("Premium");
  };

  return (
    <div id="proposal-form-component" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        disabled={isGenerating}
        className="inline-flex items-center text-sm font-semibold text-slate-550 hover:text-slate-900 transition-colors mb-6 disabled:opacity-50 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back to Dashboard
      </button>

      <div className="bg-white border border-slate-150 rounded-xl p-6 sm:p-8 proposal-card-shadow">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
              Create New Proposal
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-sans">
              Provide basic client details to let Google Gemini assemble your tailored proposal.
            </p>
          </div>
          <button
            type="button"
            onClick={loadExample}
            disabled={isGenerating}
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
          >
            💡 Use Example
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Client Name */}
          <div>
            <label htmlFor="client-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Client Name
            </label>
            <input
              type="text"
              id="client-name"
              required
              disabled={isGenerating}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g., Acme Retail Corp"
              className="mt-1.5 block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* Service Title */}
          <div>
            <label htmlFor="service-title" className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Service / Project Title
            </label>
            <input
              type="text"
              id="service-title"
              required
              disabled={isGenerating}
              value={serviceRequested}
              onChange={(e) => setServiceRequested(e.target.value)}
              placeholder="e.g., Shopify Plus Migration and Rebrand"
              className="mt-1.5 block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* Project description detail */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="project-description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Project Scope / Short Description
              </label>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-500">
                AI uses this
              </span>
            </div>
            <textarea
              id="project-description"
              required
              rows={4}
              disabled={isGenerating}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Briefly describe what needs to be delivered, milestones, and client's exact requirements so Gemini can write a custom scope."
              className="mt-1.5 block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white resize-vertical disabled:bg-slate-50 disabled:text-slate-400"
            />
            <p className="mt-1.5 text-xs text-slate-400 font-sans">
              Pro tip: Mention timelines or special technical notes for high-specificity proposals.
            </p>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Proposal Tone & Style
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tones.map((t) => (
                <div
                  key={t.name}
                  onClick={() => !isGenerating && setTone(t.name)}
                  className={`border rounded-lg p-3.5 cursor-pointer transition-all ${
                    tone === t.name
                      ? "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900"
                      : "border-slate-200 hover:border-slate-350 bg-white"
                  } ${isGenerating ? "opacity-55 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{t.name}</span>
                    {tone === t.name && (
                      <CheckCircle2 className="h-4.5 w-4.5 text-slate-900 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-1.5 leading-relaxed font-sans">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Generate trigger */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center py-3 px-4 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                  Gemini is drafting your proposal...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Generate Draft Proposal
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
