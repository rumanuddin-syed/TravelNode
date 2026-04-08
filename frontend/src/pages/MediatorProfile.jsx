import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../utils/config';
import { BiSave, BiX } from 'react-icons/bi';
import { toast } from 'react-toastify';

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
        // Profile doesn't exist, initialize with defaults
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mediator Profile</h1>
            <p className="text-gray-600">{user?.username}</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold text-lg transition shadow-md"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          {/* Content */}
          <div className="p-8">
            {isEditing ? (
              // Edit Mode
              <div className="space-y-6">
                {/* Cost Per Hour - Highlighted */}
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <label className="block text-lg font-bold text-blue-900 mb-2">💰 Cost Per Hour (Rs.)</label>
                  <input
                    type="number"
                    name="costPerHour"
                    value={formData.costPerHour}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg font-semibold"
                    placeholder="Enter hourly rate"
                    step="0.01"
                    min="0"
                  />
                  <p className="text-sm text-blue-700 mt-2">This is what you will earn per hour for mediating tours</p>
                </div>

                {/* Languages - Highlighted */}
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <label className="block text-lg font-bold text-purple-900 mb-3">🗣️ Languages Known</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.languages.map((lang, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-200 text-purple-900 rounded-full font-medium"
                      >
                        <span>{lang}</span>
                        <button
                          type="button"
                          onClick={() => handleLanguageRemove(idx)}
                          className="hover:text-purple-700 font-bold text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleLanguageAdd}
                    className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold transition"
                  >
                    + Add Language
                  </button>
                </div>

                {/* Other Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Write about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Describe your experience..."
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-lg transition"
                  >
                    <BiSave className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-bold text-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-6">
                {/* Cost Per Hour Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white shadow-lg">
                  <p className="text-blue-100 text-sm font-semibold mb-1">💰 Your Hourly Rate</p>
                  <h2 className="text-5xl font-bold">Rs. {profile?.costPerHour || 0}</h2>
                  <p className="text-blue-100 text-sm mt-3">Per hour for language mediation services</p>
                </div>

                {/* Languages Card */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
                  <p className="text-purple-100 text-sm font-semibold mb-3">🗣️ Languages Known</p>
                  {profile?.languages && profile.languages.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {profile.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-full font-semibold text-lg"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-100">No languages added yet. Click Edit Profile to add them.</p>
                  )}
                </div>

                {/* Other Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                    <p className="text-gray-900">{profile?.bio || 'No bio added yet'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
                    <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                    <p className={`font-semibold ${profile?.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {profile?.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
                  <p className="text-gray-900">{profile?.experience || 'No experience added yet'}</p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold text-lg transition"
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediatorProfile;
