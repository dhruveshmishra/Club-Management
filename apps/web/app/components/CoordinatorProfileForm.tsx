'use client';

import { useState } from 'react';
import { updateCoordinatorProfileAction } from '../actions/profile';
import { User, BookOpen, Phone, ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface CoordinatorProfile {
  name: string;
  college: string;
  phone: string;
  photo_url: string;
}

interface CoordinatorProfileFormProps {
  profile: CoordinatorProfile;
}

export function CoordinatorProfileForm({ profile }: CoordinatorProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    college: profile.college,
    phone: profile.phone,
    photoUrl: profile.photo_url,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('college', formData.college);
    submissionData.append('phone', formData.phone);
    submissionData.append('photoUrl', formData.photoUrl);

    try {
      const res = await updateCoordinatorProfileAction(submissionData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card p-8 rounded-3xl border border-border shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-foreground">Edit Your Profile</h3>
        <p className="text-xs text-muted-foreground mt-1">Keep your coordinator credentials up-to-date.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Your coordinator profile has been updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3 text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Full Name
          </label>
          <div className="relative flex items-center bg-background border border-input rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition">
            <User className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              className="w-full bg-transparent border-0 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-0 text-foreground"
            />
          </div>
        </div>

        {/* College Name */}
        <div className="space-y-2">
          <label htmlFor="college" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            College / School Name
          </label>
          <div className="relative flex items-center bg-background border border-input rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition">
            <BookOpen className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              id="college"
              name="college"
              required
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. School of Engineering"
              className="w-full bg-transparent border-0 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-0 text-foreground"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Phone Number
          </label>
          <div className="relative flex items-center bg-background border border-input rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition">
            <Phone className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 019-2834"
              className="w-full bg-transparent border-0 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-0 text-foreground"
            />
          </div>
        </div>

        {/* Photo URL */}
        <div className="space-y-2">
          <label htmlFor="photoUrl" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Profile Photo URL
          </label>
          <div className="relative flex items-center bg-background border border-input rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition">
            <ImageIcon className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="url"
              id="photoUrl"
              name="photoUrl"
              required
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="e.g. https://example.com/avatar.jpg"
              className="w-full bg-transparent border-0 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-0 text-foreground"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Profile...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}
