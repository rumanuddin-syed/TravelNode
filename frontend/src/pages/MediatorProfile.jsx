import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../utils/config';
import { BiSave } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { FiDollarSign, FiMessageCircle, FiPhone, FiInfo, FiEdit2, FiX } from 'react-icons/fi';

const MediatorProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bio: '',
    costPerHour: 0,
    languages: [],
    phone: '',
    experience: '',
    certifications: [],
    isAvailable: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user && user._id) {
      fetchMediatorProfile();
    }
  }, [user]);

  const fetchMediatorProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator-profile/profile/${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        setProfile(result.data);
        setFormData({
          bio: result.data.bio || '',
          costPerHour: result.data.costPerHour || 0,
          languages: result.data.languages || [],
          phone: result.data.phone || '',
          experience: result.data.experience || '',
          certifications: result.data.certifications || [],
          isAvailable: result.data.isAvailable !== undefined ? result.data.isAvailable : true,
        });
      } else {
        setProfile({
          userId: user._id,
          bio: '',
          costPerHour: 0,
          languages: [],
          phone: '',
          experience: '',
          certifications: [],
          isAvailable: true,
          rating: 0,
          totalBookings: 0,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleLanguageAdd = () => {
    const newLanguage = prompt('Enter language name:');
    if (newLanguage && newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()],
      });
    }
  };

  const handleLanguageRemove = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/mediator-profile/profile/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        setProfile(result.data);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating profile');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );

  return (
    <section className="bg-background min-h-screen py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <span className="section-overline">Settings</span>
            <h2 className="text-display-sm text-text-primary mt-1">Mediator Profile</h2>
            <p className="text-body-sm text-text-secondary mt-1">{user?.username}</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-outline group"
            >
              <FiEdit2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Edit Profile
            </button>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="p-6 md:p-10">
            {isEditing ? (
              <div className="space-y-8 animate-fade-in">
                {/* Cost Per Hour */}
                <div className="bg-sky-50 p-6 md:p-8 rounded-2xl border border-sky-100">
                  <label className="flex items-center gap-2 text-body-lg font-bold text-sky-900 mb-3">
                    <FiDollarSign className="text-cta" /> Cost Per Hour (₹)
                  </label>
                  <input
                    type="number"
                    name="costPerHour"
                    value={formData.costPerHour}
                    onChange={handleInputChange}
                    className="form-input !py-4 !text-lg !font-bold"
                    placeholder="Enter hourly rate"
                    step="50"
                    min="0"
                  />
                  <p className="text-caption text-sky-700 mt-2 ml-1">
                    This is your base earning rate per hour.
                  </p>
                </div>

                {/* Languages */}
                <div className="bg-forest-50 p-6 md:p-8 rounded-2xl border border-border-light">
                  <label className="flex items-center gap-2 text-body-lg font-bold text-primary mb-4">
                    <FiMessageCircle className="text-accent" /> Languages Known
                  </label>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {formData.languages.map((lang, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary border border-border-default rounded-full text-sm font-semibold shadow-sm"
                      >
                        <span>{lang}</span>
                        <button
                          type="button"
                          onClick={() => handleLanguageRemove(idx)}
                          className="w-5 h-5 rounded-full bg-forest-50 text-text-muted hover:text-danger hover:bg-red-50 flex items-center justify-center transition-colors"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleLanguageAdd}
                    className="btn px-4 py-2.5 bg-white border border-border-default text-primary hover:border-accent shadow-sm"
                  >
                    + Add Language
                  </button>
                </div>

                {/* Info Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="form-label text-text-secondary">Bio <span className="font-normal text-text-muted">(Required)</span></label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Write a short description about yourself and your mediation style..."
                    />
                  </div>

                  <div>
                    <label className="form-label text-text-secondary">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input !pl-11"
                        placeholder="Enter your contact number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-text-secondary">Experience Details</label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="3"
                      placeholder="E.g., 5 years guiding in Paris..."
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="isAvailable" 
                      name="isAvailable"
                      checked={formData.isAvailable} 
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <label htmlFor="isAvailable" className="text-body-sm font-medium text-text-primary cursor-pointer">
                      I am currently available for new bookings
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border-light">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 btn-cta group"
                  >
                    <BiSave className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                {/* Highlight Cards */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="bg-gradient-sky rounded-2xl p-6 text-white shadow-elevated relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                    <p className="text-sky-50 text-body-sm font-semibold mb-2 flex items-center gap-1.5 opacity-90"><FiDollarSign /> Hourly Rate</p>
                    <h2 className="text-display-md font-bold mb-1">₹{profile?.costPerHour || 0}</h2>
                    <p className="text-sky-50 text-caption opacity-90">Per hour for mediation services</p>
                  </div>
                  
                  <div className="bg-gradient-forest rounded-2xl p-6 text-white shadow-elevated relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                    <p className="text-forest-100 text-body-sm font-semibold mb-2 flex items-center gap-1.5 opacity-90"><FiMessageCircle /> Languages</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {profile?.languages && profile.languages.length > 0 ? (
                        profile.languages.map((lang, idx) => (
                          <span key={idx} className="badge bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                            {lang}
                          </span>
                        ))
                      ) : (
                        <span className="text-forest-200 text-caption italic">No languages added</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-4">
                  <div>
                    <h3 className="text-caption font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FiInfo /> Bio
                    </h3>
                    <p className="text-body-sm text-text-primary leading-relaxed bg-forest-50 p-4 rounded-xl min-h-[100px]">
                      {profile?.bio || <span className="text-text-muted italic">No bio provided</span>}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-caption font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FiPhone /> Contact
                      </h3>
                      <p className="text-body-sm font-medium text-text-primary">{profile?.phone || <span className="text-text-muted italic">Not provided</span>}</p>
                    </div>

                    <div>
                      <h3 className="text-caption font-bold text-text-muted uppercase tracking-wider mb-2">Availability</h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                        profile?.isAvailable ? 'bg-forest-100 text-forest-800' : 'bg-red-50 text-danger'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${profile?.isAvailable ? 'bg-success' : 'bg-danger'}`} />
                        {profile?.isAvailable ? 'Accepting Bookings' : 'Unavailable'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-caption font-bold text-text-muted uppercase tracking-wider mb-2">Experience</h3>
                  <p className="text-body-sm text-text-primary leading-relaxed bg-forest-50 p-4 rounded-xl min-h-[80px]">
                    {profile?.experience || <span className="text-text-muted italic">No experience added yet</span>}
                  </p>
                </div>

                <div className="pt-8 border-t border-border-light text-center">
                  <button onClick={() => setIsEditing(true)} className="btn-cta-lg w-full sm:w-auto min-w-[250px]">
                    Update Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediatorProfile;
