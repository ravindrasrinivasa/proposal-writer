import React, { useState } from "react";
import { Proposal, ToneType, parseProposalMetadata } from "../types";
import { ArrowLeft, Save, Copy, Check, Eye, Edit2, Sparkles, CheckCircle2, ChevronRight, Download, DollarSign, Calendar, Clock } from "lucide-react";

interface ProposalEditorProps {
  proposal: Partial<Proposal>;
  onBack: () => void;
  onSave: (updatedProposal: Partial<Proposal>) => Promise<void>;
  isSaving: boolean;
}

export default function ProposalEditor({ proposal, onBack, onSave, isSaving }: ProposalEditorProps) {
  const [clientName, setClientName] = useState(proposal.client_name || "");
  const [serviceRequested, setServiceRequested] = useState(proposal.service_requested || "");
  const [content, setContent] = useState(proposal.proposal_content || "");
  const [status, setStatus] = useState<Proposal["status"]>(proposal.status || "draft");
  const [tone, setTone] = useState<ToneType>((proposal.tone as ToneType) || "Professional");
  
  const [viewMode, setViewMode] = useState<"edit" | "preview">("preview"); // defaults to previewing the lovely AI output!
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Helper to parse basic Markdown for a gorgeous layout
  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-slate-400 italic font-sans">No proposal content generated yet...</p>;
    
    // Prune the YAML metadata block so it doesn't show in the document preview canvas
    const textToRender = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
    const lines = textToRender.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="text-3xl font-extrabold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2 font-sans tracking-tight">{line.slice(2)}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-xl font-bold text-slate-800 mt-6 mb-3 font-sans pb-1">{line.slice(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-lg font-semibold text-slate-800 mt-4 mb-2 font-sans">{line.slice(4)}</h3>;
      }
      
      // Bullets
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const lineContent = line.trim().substring(2);
        return (
          <ul key={idx} className="list-disc pl-6 py-0.5 font-sans text-slate-650 text-sm leading-relaxed">
            <li className="mt-1">{parseBold(lineContent)}</li>
          </ul>
        );
      }
      
      // Empty lines
      if (line.trim() === "") {
        return <div key={idx} className="h-3" />;
      }
      
      // Standard Paragraph
      return (
        <p key={idx} className="text-slate-600 text-sm leading-relaxed mb-3.5 font-sans">
          {parseBold(line)}
        </p>
      );
    });
  };

  // Helper to highlight **bold text** online
  const parseBold = (text: string): React.ReactNode => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-900">{part}</strong> : part);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProposal = async () => {
    setSaveSuccess(false);
    await onSave({
      ...proposal,
      client_name: clientName,
      service_requested: serviceRequested,
      proposal_content: content,
      status: status,
      tone: tone,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${clientName.replace(/\s+/g, "_")}_Proposal.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="proposal-editor-component" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editor Header navigation row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 font-sans">Proposals</span>
              <ChevronRight className="h-3 w-3 text-slate-350" />
              <span className="text-sm font-semibold text-slate-900 max-w-[200px] truncate font-sans">
                {clientName || "Unnamed Draft"}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
              {serviceRequested || "New Scope Proposal"}
            </h1>
          </div>
        </div>

        {/* Toolbar of Save buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied Markdown!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy to Clipboard
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
            title="Download Proposal in raw Markdown"
          >
            <Download className="h-3.5 w-3.5" />
            Download .md
          </button>

          <button
            onClick={handleSaveProposal}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-black text-xs font-bold text-white rounded-lg shadow-2xs hover:shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <span className="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></span>
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Proposal
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
          <span>Success! Proposal is saved securely to database schema structures.</span>
        </div>
      )}

      {/* 3-Column Review Cards detailing efforts, duration, cost separately */}
      {(() => {
        const meta = parseProposalMetadata(content);
        return (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Cost Column */}
            <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="p-2 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Estimated Cost</span>
                <span className="block text-sm font-extrabold text-slate-900 truncate mt-0.5">{meta.estimated_cost}</span>
                <span className="block text-[10px] text-slate-500 font-medium truncate">Model: {meta.pricing_model}</span>
              </div>
            </div>

            {/* Duration Column */}
            <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="p-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg shrink-0">
                <Calendar className="h-5 w-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Project Duration</span>
                <span className="block text-sm font-extrabold text-slate-900 truncate mt-0.5">{meta.estimated_duration}</span>
                <span className="block text-[10px] text-slate-500 font-medium truncate">Total timeline limit</span>
              </div>
            </div>

            {/* Efforts Column */}
            <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="p-2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Work Effort</span>
                <span className="block text-sm font-extrabold text-slate-900 truncate mt-0.5">{meta.estimated_efforts}</span>
                <span className="block text-[10px] text-slate-500 font-medium truncate">Labor capacity estimate</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Main Splitscreen Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: Metadata Config Controls */}
        <div className="lg:col-span-1 bg-white border border-slate-150 rounded-xl p-5 proposal-card-shadow space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2">
            Metadata Parameters
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1.5 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Service Requested
            </label>
            <input
              type="text"
              value={serviceRequested}
              onChange={(e) => setServiceRequested(e.target.value)}
              className="mt-1.5 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Proposal Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneType)}
              className="mt-1.5 block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            >
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Proposal Status
            </label>
            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
              {(["draft", "sent", "approved"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg capitalize border cursor-pointer transition-colors ${
                    status === s
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[10.5px] text-slate-400 font-sans">
              Track your proposal pipeline progress from layout drafting to sign-off.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Last Saved:</span>
            <span>{proposal.updated_at ? new Date(proposal.updated_at).toLocaleString() : "Unsaved"}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Document Editor Canvas */}
        <div className="lg:col-span-2 bg-white border border-slate-150 rounded-xl proposal-card-shadow overflow-hidden min-h-[500px] flex flex-col">
          {/* Editor Header Navigation Mode Toggle */}
          <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">
              <Sparkles className="h-3.5 w-3.5 text-slate-800" />
              Document content (Markdown)
            </span>

            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  viewMode === "edit"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Markdown
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {viewMode === "edit" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write, edit or update the proposal content here using normal characters or Markdown formatting..."
                className="w-full h-full min-h-[440px] border-0 p-0 text-slate-800 text-sm focus:ring-0 focus:outline-hidden font-mono leading-relaxed resize-none"
              />
            ) : (
              <div className="prose prose-slate max-w-none prose-sm pb-10">
                {renderMarkdown(content)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
