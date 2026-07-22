"use client";

import { useState } from 'react';
import { deleteUserAction } from '../../../actions/admin';
import { User, Mail, School, Calendar, Phone, Clock, X, BadgeAlert, Award, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Coordinator {
  user_id: string;
  name: string;
  status: string;
  photo_url: string;
  proof_of_occupation_url: string;
  phone: string;
  college: string;
  occupation: string;
  profiles?: {
    email: string;
  };
  clubs?: {
    name: string;
  };
}

interface CoordinatorsClientProps {
  initialCoordinators: Coordinator[];
  activePost: string;
  postLabels: Record<string, string>;
  groupedCounts: Record<string, number>;
}

export default function CoordinatorsClient({
  initialCoordinators,
  activePost,
  postLabels,
  groupedCounts,
}: CoordinatorsClientProps) {
  const [activeCoord, setActiveCoord] = useState<Coordinator | null>(null);

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this coordinator profile?')) {
      const res = await deleteUserAction(userId);
      if (res && 'error' in res) {
        alert(res.error);
      }
    }
  };

  // Filter for the active post
  const activeCoords = initialCoordinators.filter(c => c.occupation === activePost);

  return (
    <div className="space-y-6">
      {/* Post Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        {Object.entries(postLabels).map(([postKey, label]) => {
          const count = groupedCounts[postKey] || 0;
          const isSelected = postKey === activePost;
          return (
            <Link
              key={postKey}
              href={`/users/coordinators?activePost=${postKey}`}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Main List */}
      <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-slate-100">
        {activeCoords.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm space-y-2">
            <span className="text-3xl block">🤝</span>
            <p>No coordinators currently hold the position of <strong>{postLabels[activePost]}</strong>.</p>
          </div>
        ) : (
          activeCoords.map((coord) => (
            <div key={coord.user_id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={coord.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt={coord.name}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800 text-sm">{coord.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                      coord.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : coord.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {coord.status}
                    </span>
                  </div>
                  <p className="text-slate-500">📧 {coord.profiles?.email}</p>
                  <div className="flex flex-wrap gap-2 pt-0.5 text-slate-400 text-[10px] font-medium">
                    <span className="text-blue-600">🏫 {coord.clubs?.name || 'No Club'}</span>
                    <span>&bull;</span>
                    <span>📞 {coord.phone}</span>
                    <span>&bull;</span>
                    <span>College: {coord.college}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveCoord(coord)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl font-semibold transition"
                >
                  View Details
                </button>
                <a
                  href={coord.proof_of_occupation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-semibold transition flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Proof
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(coord.user_id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Brief Coordinator Profile Modal Overlay */}
      {activeCoord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative transform scale-100 transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setActiveCoord(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={activeCoord.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt={activeCoord.name}
                  className="w-14 h-14 rounded-full object-cover bg-white/20 border-2 border-white shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold truncate max-w-[250px]">{activeCoord.name}</h3>
                  <span className="text-xs text-blue-100 font-semibold px-2 py-0.5 bg-white/10 rounded-full flex items-center gap-1 w-max">
                    <Award className="w-3 h-3" />
                    {postLabels[activeCoord.occupation]} Brief
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-slate-700">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-semibold text-slate-500">Status</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  activeCoord.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : activeCoord.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {activeCoord.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs border-b border-slate-100 pb-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Email Address</span>
                  <span className="font-medium text-slate-700 truncate block">{activeCoord.profiles?.email || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs border-b border-slate-100 pb-3">
                <School className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">College</span>
                  <span className="font-medium text-slate-700 truncate block">{activeCoord.college || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs border-b border-slate-100 pb-3">
                <Award className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Assigned Club</span>
                  <span className="font-medium text-blue-600 block">{activeCoord.clubs?.name || 'No Club assigned'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs border-b border-slate-100 pb-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Phone Number</span>
                  <span className="font-medium text-slate-700 block">{activeCoord.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs pb-1">
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Occupation Proof</span>
                  <a
                    href={activeCoord.proof_of_occupation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-bold mt-0.5 inline-block"
                  >
                    View Official Document ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveCoord(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
