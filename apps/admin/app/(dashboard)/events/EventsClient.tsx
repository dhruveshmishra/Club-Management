"use client";

import { useState } from 'react';
import { deleteEventAction } from '../../actions/admin';
import { Calendar, Users, Trophy, MapPin, X, Info, Trash2, Clock } from 'lucide-react';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const datePart = (dateStr.includes('T') ? dateStr.split('T')[0] : dateStr) || '';
  const parts = datePart.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0] || '';
  const month = parts[1] || '';
  const day = parts[2] || '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
};

interface Event {
  id: string;
  title: string;
  description: string;
  mode: string;
  status: string;
  prize_pool: number;
  team_size: number;
  start_date: string;
  end_date: string;
  clubs?: {
    name: string;
  };
}

interface EventsClientProps {
  initialEvents: Event[];
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  const handleDelete = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const res = await deleteEventAction(eventId);
      if (res && 'error' in res) {
        alert(res.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-slate-100">
        {initialEvents.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No events have been created yet on the platform.
          </div>
        ) : (
          initialEvents.map((evt) => (
            <div key={evt.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50/50 transition text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {evt.clubs?.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${
                    evt.status === 'upcoming'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : evt.status === 'ongoing'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {evt.status}
                  </span>
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] font-medium">{evt.mode}</span>
                </div>
                
                <h3 className="font-bold text-slate-800 text-sm">{evt.title}</h3>
                <p className="text-slate-500 max-w-2xl line-clamp-1">{evt.description}</p>
                
                <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-slate-400" />
                    Prize Pool: <strong className="text-slate-700">${evt.prize_pool}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    Team Size: <strong className="text-slate-700">{evt.team_size}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Dates: <strong className="text-slate-700">{formatDate(evt.start_date)} - {formatDate(evt.end_date)}</strong>
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEvent(evt)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl font-semibold transition flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(evt.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-semibold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Brief Event Details Modal Overlay */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative transform scale-100 transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setActiveEvent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="mt-2 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-white/20 rounded-full inline-block">
                  {activeEvent.clubs?.name} Event Brief
                </span>
                <h3 className="text-xl font-bold truncate pr-6 mt-1.5">{activeEvent.title}</h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-slate-700">
              {/* Event Description */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">About the Event</span>
                <p className="text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto pr-1">
                  {activeEvent.description || 'No description provided.'}
                </p>
              </div>

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4">
                <div className="flex items-center gap-3 text-xs">
                  <Trophy className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="block text-[9px] text-slate-400 font-semibold uppercase">Prize Pool</span>
                    <span className="font-bold text-slate-700">${activeEvent.prize_pool}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <Users className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="block text-[9px] text-slate-400 font-semibold uppercase">Team Size Limit</span>
                    <span className="font-bold text-slate-700">{activeEvent.team_size} Student(s)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="block text-[9px] text-slate-400 font-semibold uppercase">Event Mode</span>
                    <span className="font-bold text-slate-700 capitalize">{activeEvent.mode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="block text-[9px] text-slate-400 font-semibold uppercase">Oversight Status</span>
                    <span className="font-bold text-slate-700 capitalize">{activeEvent.status}</span>
                  </div>
                </div>
              </div>

              {/* Event Dates */}
              <div className="flex items-center gap-3 text-xs">
                <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Event Schedule</span>
                  <span className="font-medium text-slate-700">
                    {formatDate(activeEvent.start_date)} &ndash; {formatDate(activeEvent.end_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveEvent(null)}
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
