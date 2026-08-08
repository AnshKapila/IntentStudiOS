import React, { useState, useEffect } from 'react';
import { Camera, Save, User, Mail, Briefcase, MapPin, Building } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('intent_studios_profile_v1');
    return saved ? JSON.parse(saved) : {
      fullName: 'Ansh Kapila',
      role: 'Founder',
      email: 'ansh@sondero.ai',
      location: 'Berlin, Germany',
      company: 'Sondero AI Operating System',
      bio: 'Leading the development of premium enterprise AI solutions.',
      avatarUrl: ''
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);

  useEffect(() => {
    localStorage.setItem('intent_studios_profile_v1', JSON.stringify(profileData));
  }, [profileData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData(prev => ({ ...prev, avatarUrl: reader.result as string }));
        if (!isEditing) {
          setProfileData(prev => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-cream)] text-[var(--text-main)] relative z-0 pb-20">
      {/* Header Banner */}
      <div className="h-48 bg-[var(--brand-primary)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] opacity-90"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative -mt-16">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-8">
          
          {/* Avatar & Top Info */}
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-[var(--bg-cream)] flex items-center justify-center relative">
                {editedData.avatarUrl ? (
                  <img src={editedData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-[var(--border-light)]" />
                )}
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-white text-xs font-medium">Change</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.fullName}
                  onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
                  className="text-3xl font-[family-name:--font-serif] font-bold text-[var(--brand-primary)] bg-transparent border-b border-[var(--brand-secondary)] focus:outline-none focus:border-[var(--accent-orange)] w-full max-w-sm"
                />
              ) : (
                <h1 className="text-3xl font-[family-name:--font-serif] font-bold text-[var(--brand-primary)]">{profileData.fullName}</h1>
              )}
              
              <div className="mt-2 flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.role}
                    onChange={(e) => setEditedData({...editedData, role: e.target.value})}
                    className="text-[var(--accent-orange)] font-[family-name:--font-inter] uppercase tracking-widest text-sm bg-transparent border-b border-[var(--brand-secondary)] focus:outline-none focus:border-[var(--accent-orange)] w-64"
                  />
                ) : (
                  <span className="text-[var(--accent-orange)] font-[family-name:--font-inter] uppercase tracking-widest text-sm font-medium">{profileData.role}</span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex gap-3">
              {isEditing ? (
                <>
                  <button onClick={handleCancel} className="px-4 py-2 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-cream)] transition-colors text-sm font-medium">Cancel</button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-secondary)] transition-colors text-sm font-medium">
                    <Save className="w-4 h-4" /> Save Profile
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-5 py-2 rounded-md bg-[var(--bg-cream)] text-[var(--brand-primary)] hover:bg-[var(--border-light)] transition-colors text-sm font-medium border border-[var(--border-light)]">
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <hr className="my-8 border-[var(--border-light)]" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-lg font-[family-name:--font-serif] text-[var(--brand-primary)] font-semibold border-b border-[var(--border-light)] pb-2">Contact & Details</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-cream)] flex items-center justify-center text-[var(--brand-secondary)] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Email Address</p>
                  {isEditing ? (
                    <input type="email" value={editedData.email} onChange={(e) => setEditedData({...editedData, email: e.target.value})} className="w-full bg-[var(--bg-cream)] border border-[var(--border-light)] rounded px-3 py-1.5 focus:outline-none focus:border-[var(--brand-secondary)] text-sm" />
                  ) : (
                    <p className="text-sm font-medium">{profileData.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-cream)] flex items-center justify-center text-[var(--brand-secondary)] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Location</p>
                  {isEditing ? (
                    <input type="text" value={editedData.location} onChange={(e) => setEditedData({...editedData, location: e.target.value})} className="w-full bg-[var(--bg-cream)] border border-[var(--border-light)] rounded px-3 py-1.5 focus:outline-none focus:border-[var(--brand-secondary)] text-sm" />
                  ) : (
                    <p className="text-sm font-medium">{profileData.location}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-cream)] flex items-center justify-center text-[var(--brand-secondary)] shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Company</p>
                  {isEditing ? (
                    <input type="text" value={editedData.company} onChange={(e) => setEditedData({...editedData, company: e.target.value})} className="w-full bg-[var(--bg-cream)] border border-[var(--border-light)] rounded px-3 py-1.5 focus:outline-none focus:border-[var(--brand-secondary)] text-sm" />
                  ) : (
                    <p className="text-sm font-medium">{profileData.company}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-[family-name:--font-serif] text-[var(--brand-primary)] font-semibold border-b border-[var(--border-light)] pb-2">Biography</h3>
              <div>
                {isEditing ? (
                  <textarea
                    value={editedData.bio}
                    onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                    rows={6}
                    className="w-full bg-[var(--bg-cream)] border border-[var(--border-light)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--brand-secondary)] text-sm leading-relaxed resize-none"
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {profileData.bio || "No biography provided."}
                  </p>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
