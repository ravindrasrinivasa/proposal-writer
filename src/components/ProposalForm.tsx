import React, { useState } from "react";
import { ToneType } from "../types";
import { Sparkles, ArrowLeft, HelpCircle, FileText, CheckCircle2, DollarSign, Calendar, Clock, Award } from "lucide-react";

interface ProposalFormProps {
  onBack: () => void;
  onSubmit: (formData: {
    clientName: string;
    serviceRequested: string;
    projectDescription: string;
    tone: ToneType;
    pricingModel: string;
    estimatedCost: string;
    estimatedDuration: string;
    estimatedEfforts: string;
    currency: string;
  }) => void;
  isGenerating: boolean;
}

export default function ProposalForm({ onBack, onSubmit, isGenerating }: ProposalFormProps) {
  const [clientName, setClientName] = useState("");
  const [serviceRequested, setServiceRequested] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tone, setTone] = useState<ToneType>("Professional");

  // New Budget / Delivery Specification State
  const [pricingModel, setPricingModel] = useState("Fixed Price");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [currency, setCurrency] = useState("$");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("weeks");
  const [estimatedEfforts, setEstimatedEfforts] = useState("");
  const [effortsUnit, setEffortsUnit] = useState("hours");

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
      pricingModel,
      estimatedCost: estimatedCost.trim() ? `${estimatedCost.trim()}` : "Not specified",
      estimatedDuration: estimatedDuration.trim() ? `${estimatedDuration.trim()} ${durationUnit}` : "Not specified",
      estimatedEfforts: estimatedEfforts.trim() ? `${estimatedEfforts.trim()} ${effortsUnit}` : "Not specified",
      currency,
    });
  };

  const loadExample = () => {
    setClientName("Acme Retail Corp");
    setServiceRequested("E-Commerce Web Replatform & Design Refresh");
    setProjectDescription(
      "Re-engineer Acme's digital store layout, migrating from legacy platform to high-performance Headless commerce. " +
      "Requires responsive checkout flow, Shopify Plus integration, 3 product categories, and clean design components " +
      "completed."
    );
    setTone("Premium");
    setPricingModel("Fixed Price");
    setEstimatedCost("15,000");
    setCurrency("$");
    setEstimatedDuration("8");
    setDurationUnit("weeks");
    setEstimatedEfforts("240");
    setEffortsUnit("hours");
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
              Provide basic client details and budget criteria to let Google Gemini assemble your tailored proposal.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              rows={3}
              disabled={isGenerating}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Briefly describe what needs to be delivered, milestones, and client's exact requirements so Gemini can write a custom scope."
              className="mt-1.5 block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white resize-vertical disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* BUDGET AND DELIVERY CONSTRAINTS SECTION */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono border-b border-slate-200/60 pb-2">
              <Award className="h-4 w-4 text-slate-700" />
              <span>Budget & Delivery Specifications (Active Review Criteria)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cost / Budget & Currency */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                  Budget / Cost Estimate
                </label>
                <div className="relative mt-1 flex rounded-md">
                  <select
                    disabled={isGenerating}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="inline-flex items-center rounded-l-md border border-r-0 border-slate-200 bg-white px-2.5 text-xs text-slate-600 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="A$">A$ (AUD)</option>
                    <option value="C$">C$ (CAD)</option>
                  </select>
                  <input
                    type="text"
                    disabled={isGenerating}
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="e.g., 12,500"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                  Estimated Duration
                </label>
                <div className="relative mt-1 flex rounded-md">
                  <input
                    type="number"
                    min="1"
                    disabled={isGenerating}
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="e.g., 6"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white text-slate-900"
                  />
                  <select
                    disabled={isGenerating}
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="inline-flex items-center rounded-r-md border border-l-0 border-slate-200 bg-white px-2 text-xs text-slate-600 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              {/* Estimated Efforts */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                  Estimated Efforts / Labor
                </label>
                <div className="relative mt-1 flex rounded-md">
                  <input
                    type="number"
                    min="1"
                    disabled={isGenerating}
                    value={estimatedEfforts}
                    onChange={(e) => setEstimatedEfforts(e.target.value)}
                    placeholder="e.g., 180"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white text-slate-900"
                  />
                  <select
                    disabled={isGenerating}
                    value={effortsUnit}
                    onChange={(e) => setEffortsUnit(e.target.value)}
                    className="inline-flex items-center rounded-r-md border border-l-0 border-slate-200 bg-white px-2 text-xs text-slate-600 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Pricing Model selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">
                  Pricing Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Fixed Price", "Hourly Rate", "Monthly Retainer", "Time & Materials"].map((model) => (
                    <button
                      key={model}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => setPricingModel(model)}
                      className={`py-1.5 px-2 text-xs rounded-lg border font-medium transition-colors ${
                        pricingModel === model
                          ? "bg-slate-900 border-slate-900 text-white font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-55"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-end text-[11px] text-slate-400 font-sans leading-relaxed">
                <p>These values will be embedded as metadata inside the generated draft, and used by Gemini to structure exact pricing pages and delivery schedules.</p>
              </div>
            </div>
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
