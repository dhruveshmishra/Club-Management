"use client";

import { useState } from 'react';
import { deleteUserAction } from '../../../actions/admin';
import { User, Mail, School, Calendar, Phone, Clock, X } from 'lucide-react';

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

interface Student {
  user_id: string;
  name: string;
  college: string;
  year: number;
  phone: string;
  created_at: string;
  profiles?: {
    email: string;
  };
}

interface StudentsClientProps {
  initialStudents: Student[];
  query: string;
}

export default function StudentsClient({ initialStudents, query }: StudentsClientProps) {
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this student profile?')) {
      const res = await deleteUserAction(userId);
      if (res && 'error' in res) {
        alert(res.error);
      }
    }
  };

  // Filter students based on search query
  const filteredStudents = initialStudents.filter((student) => {
    if (!query) return true;
    const nameMatch = student.name?.toLowerCase().includes(query.toLowerCase());
    const emailMatch = student.profiles?.email?.toLowerCase().includes(query.toLowerCase());
    const collegeMatch = student.college?.toLowerCase().includes(query.toLowerCase());
    return nameMatch || emailMatch || collegeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Main List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm space-y-2">
            <span className="text-3xl block">👥</span>
            <p>No student profiles found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Academic Year</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.user_id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">
                      {student.name}
                    </td>
                    <td className="p-4 text-slate-700">
                      {student.profiles?.email}
                    </td>
                    <td className="p-4 text-slate-600">
                      {student.college}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold">
                        Year {student.year}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      {student.phone}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2 h-full py-3">
                      <button
                        type="button"
                        onClick={() => setActiveStudent(student)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl font-semibold transition"
                      >
                        View Brief
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(student.user_id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-semibold transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Brief Profile Modal Overlay */}
      {activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative transform scale-100 transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setActiveStudent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl shrink-0 font-bold uppercase">
                  {activeStudent.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold truncate max-w-[250px]">{activeStudent.name}</h3>
                  <span className="text-xs text-blue-100 font-semibold px-2 py-0.5 bg-white/10 rounded-full">
                    Student Profile Brief
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-slate-700">
              <div className="flex items-center gap-3 text-xs border-b border-slate-100 pb-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Email Address</span>
                  <span className="font-medium text-slate-700 truncate block">{activeStudent.profiles?.email || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs border-b border-slate-100 pb-3">
                <School className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">College</span>
                  <span className="font-medium text-slate-700 truncate block">{activeStudent.college || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs border-b border-slate-100 pb-3">
                <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Academic Year</span>
                  <span className="font-medium text-slate-700 block">Year {activeStudent.year}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs border-b border-slate-100 pb-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Phone Number</span>
                  <span className="font-medium text-slate-700 block">{activeStudent.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs pb-1">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Joined Date</span>
                  <span className="font-medium text-slate-700 block">
                    {activeStudent.created_at ? formatDate(activeStudent.created_at) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStudent(null)}
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
