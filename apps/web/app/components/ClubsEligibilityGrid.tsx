'use client';

import { useState } from 'react';
import { Search, X, ShieldAlert, Award, ArrowRight } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  eligibility_criteria: string;
}

interface ClubsEligibilityGridProps {
  clubs: Club[];
}

export function ClubsEligibilityGrid({ clubs }: ClubsEligibilityGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search Bar */}
      <div className="relative max-w-md bg-card p-2.5 rounded-2xl border border-border shadow-sm flex items-center">
        <Search className="w-4 h-4 text-muted-foreground ml-3" />
        <input
          type="text"
          placeholder="Search clubs by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-0 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-0 transition text-foreground placeholder:text-muted-foreground w-full"
        />
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
          No clubs match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              onClick={() => setSelectedClub(club)}
              className="group bg-card rounded-2xl border border-border hover:border-primary/40 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={club.logo_url}
                    alt={club.name}
                    className="w-12 h-12 rounded-xl object-cover bg-muted border border-border group-hover:scale-105 transition-transform duration-300"
                  />
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {club.name}
                    </h3>
                    <span className="text-[11px] text-primary/80 bg-primary/5 px-2.5 py-0.5 rounded-full font-medium">
                      Eligibility Details
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {club.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                <span>View Requirements</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Eligibility Detail Modal */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedClub(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-card w-full max-w-lg rounded-2xl border border-border shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-border flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedClub.logo_url}
                  alt={selectedClub.name}
                  className="w-14 h-14 rounded-xl object-cover bg-muted border border-border"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-foreground">
                    {selectedClub.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">Club Eligibility Criteria</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClub(null)}
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* About Club */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-primary" /> About the Club
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedClub.description}
                </p>
              </div>

              {/* Eligibility Section */}
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Joining Requirements
                </h4>
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  {selectedClub.eligibility_criteria}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedClub(null)}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
