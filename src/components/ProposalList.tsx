import React from "react";
import { Proposal } from "../types";
import { Plus, Clock, FileText, ArrowUpRight, Search, Sparkles, Trash2, Edit3, Eye } from "lucide-react";

interface ProposalListProps {
  proposals: Proposal[];
  onNewProposal: () => void;
  onSelectProposal: (proposal: Proposal) => void;
  onDeleteProposal: (id: string) => void;
}

export default function ProposalList({
  proposals,
  onNewProposal,
  onSelectProposal,
  onDeleteProposal
}: ProposalListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredProposals = proposals.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.client_name.toLowerCase().includes(q) ||
      p.service_requested.toLowerCase().includes(q) ||
      p.project_description.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: Proposal["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Sent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        );
    }
  };

  const getToneBadge = (tone: Proposal["tone"]) => {
    switch (tone) {
      case "Premium":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Enterprise":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Friendly":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="proposal-list-component" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section with Stats */}
      <div className="md:flex md:items-center md:justify-between border-b border-slate-100 pb-6 mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-sans">
            Agency Proposals
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-sans">
            Manage, generate, and track first-draft contracts for your clients.
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <button
            onClick={onNewProposal}
            type="button"
            className="inline-flex items-center px-4 py-2 bg-slate-900 rounded-lg text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Proposal
          </button>
        </div>
      </div>

      {proposals.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by client or service description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-250 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-950 focus:border-slate-950 bg-white"
            />
          </div>
        </div>
      )}

      {/* Main content block */}
      {filteredProposals.length === 0 ? (
        <div className="text-center bg-white border border-slate-150 rounded-xl p-12 proposal-card-shadow">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-slate-50 text-slate-400 mb-4 border border-slate-100">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 font-sans">
            {searchQuery ? "No matching proposals" : "No proposals generated yet"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto font-sans leading-relaxed">
            {searchQuery
              ? "Try adjusting your keywords to find the draft or client name."
              : "Kickstart client agreements with high-quality AI proposals crafted for your small agency clients."}
          </p>
          <div className="mt-6">
            <button
              onClick={onNewProposal}
              type="button"
              className="inline-flex items-center px-4.5 py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-black transition-colors"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              Generate First Proposal
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-155 rounded-xl proposal-card-shadow overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {filteredProposals.map((proposal) => (
              <li
                key={proposal.id}
                className="hover:bg-slate-50/40 transition-colors duration-150"
              >
                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Proposal Info */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectProposal(proposal)}>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900 truncate font-sans">
                        {proposal.client_name}
                      </h4>
                      {getStatusBadge(proposal.status)}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getToneBadge(proposal.tone)}`}>
                        {proposal.tone}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-700 truncate font-sans">
                      {proposal.service_requested}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 font-sans line-clamp-1">
                      {proposal.project_description}
                    </p>

                    {/* Metadata Dates */}
                    <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-400 font-medium font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        Created: {formatDate(proposal.created_at)}
                      </span>
                      {proposal.updated_at !== proposal.created_at && (
                        <span>
                          Updated: {formatDate(proposal.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2.5 justify-end shrink-0">
                    <button
                      onClick={() => onSelectProposal(proposal)}
                      title="Edit/View Proposal"
                      className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-650 hover:text-slate-900 transition-colors cursor-pointer text-sm font-semibold"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProposal(proposal.id)}
                      title="Delete Proposal"
                      className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-slate-400 hover:text-red-650 transition-colors cursor-pointer text-sm font-semibold"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
