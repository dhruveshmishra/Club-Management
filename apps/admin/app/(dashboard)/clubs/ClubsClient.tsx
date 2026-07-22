"use client";

import { useState, useRef, useEffect } from 'react';
import { createClubAction, updateClubAction, deleteClubAction } from '../../actions/admin';
import { Pencil, Trash2, Plus, X, Save } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  eligibility_criteria: string;
}

interface ClubsClientProps {
  initialClubs: Club[];
}

export default function ClubsClient({ initialClubs }: ClubsClientProps) {
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  
  // Controlled fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Populate or reset form fields when editing state changes
  useEffect(() => {
    setLogoFile(null);
    setFileInputKey(prev => prev + 1);
    if (editingClub) {
      setName(editingClub.name);
      setDescription(editingClub.description);
      setEligibilityCriteria(editingClub.eligibility_criteria);
      nameInputRef.current?.focus();
    } else {
      setName('');
      setDescription('');
      setEligibilityCriteria('');
    }
  }, [editingClub]);

  const handleCancel = () => {
    setEditingClub(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (logoFile) {
      formData.append('logoFile', logoFile);
    }
    formData.append('eligibilityCriteria', eligibilityCriteria);

    if (editingClub) {
      const res = await updateClubAction(editingClub.id, formData);
      if (res && 'error' in res) {
        alert(res.error);
      } else {
        setEditingClub(null);
      }
    } else {
      const res = await createClubAction(formData);
      if (res && 'error' in res) {
        alert(res.error);
      } else {
        setName('');
        setDescription('');
        setLogoFile(null);
        setFileInputKey(prev => prev + 1);
        setEligibilityCriteria('');
      }
    }
  };

  const handleDelete = async (clubId: string) => {
    if (confirm('Are you sure you want to delete this club?')) {
      const res = await deleteClubAction(clubId);
      if (res && 'error' in res) {
        alert(res.error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Create / Edit Club Form */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {editingClub ? (
            <>
              <Pencil className="w-4 h-4 text-blue-600" />
              <span>Edit Club: {editingClub.name}</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-slate-700" />
              <span>Add New Club</span>
            </>
          )}
        </h2>
        <div className="glass-panel p-6 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Club Name</label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Coding Society"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="What is the club's focus?"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Club Logo</label>
              {editingClub ? (
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  {editingClub.logo_url && (
                    <img src={editingClub.logo_url} alt="Current logo" className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] text-slate-400 font-semibold mb-1">Replace Logo (Optional)</span>
                    <input
                      key={fileInputKey}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition file:cursor-pointer cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition file:cursor-pointer cursor-pointer font-medium"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Eligibility Criteria</label>
              <textarea
                value={eligibilityCriteria}
                onChange={(e) => setEligibilityCriteria(e.target.value)}
                required
                placeholder="e.g. GPA > 3.0, Engineering students only"
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>

            <div className="flex gap-3">
              {editingClub && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
              >
                {editingClub ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Update Club
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Create Club
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Clubs Directory */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Clubs Directory ({initialClubs.length})</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {initialClubs.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-200 text-sm">
              No clubs found. Add a club to get started.
            </div>
          ) : (
            initialClubs.map((club) => (
              <div key={club.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-44">
                <div className="flex items-center gap-3">
                  <img src={club.logo_url} alt={club.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{club.name}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{club.description}</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between">
                  <div className="text-[9px] text-slate-500 line-clamp-1 max-w-[120px] font-medium">
                    Eligible: {club.eligibility_criteria}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingClub(club)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-semibold transition flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(club.id)}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg text-[10px] font-semibold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

