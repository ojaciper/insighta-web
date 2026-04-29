import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaVenusMars, FaBirthdayCake, FaGlobe, FaCalendarAlt } from 'react-icons/fa';
import { apiClient } from '../services/api';
import { Profile } from '../types';
import toast from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';

export function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get<{ status: string; data: Profile }>(`/api/profiles/${id}`);
      setProfile(response.data);
    } catch (error) {
      toast.error('Profile not found');
      navigate('/profiles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ThreeDots color="#6d28d9" height={80} width={80} />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const infoCards = [
    { label: 'Gender', value: profile.gender, icon: FaVenusMars, color: profile.gender === 'male' ? 'text-blue-600' : 'text-pink-600' },
    { label: 'Age', value: `${profile.age} years`, icon: FaBirthdayCake, color: 'text-green-600' },
    { label: 'Country', value: `${profile.country_name} (${profile.country_id})`, icon: FaGlobe, color: 'text-purple-600' },
    { label: 'Created', value: new Date(profile.created_at).toLocaleDateString(), icon: FaCalendarAlt, color: 'text-orange-600' },
  ];

  return (
    <div>
      <button
        onClick={() => navigate('/profiles')}
        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
      >
        <FaArrowLeft />
        <span>Back to Profiles</span>
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
          <p className="text-purple-100 mt-1">Profile ID: {profile.id}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {infoCards.map((card, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <card.icon className={card.color} size={20} />
                  <span className="text-gray-500 text-sm">{card.label}</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confidence Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Gender Probability</span>
                  <span className="text-lg font-bold text-purple-600">
                    {(profile.gender_probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${profile.gender_probability * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Country Probability</span>
                  <span className="text-lg font-bold text-purple-600">
                    {(profile.country_probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${profile.country_probability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Age Group</dt>
                  <dd className="text-lg font-medium text-gray-800">{profile.age_group}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Created At</dt>
                  <dd className="text-lg font-medium text-gray-800">
                    {new Date(profile.created_at).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}