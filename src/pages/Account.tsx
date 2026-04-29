import { useAuth } from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaIdCard, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa';

export function Account() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const details = [
    { label: 'Username', value: `@${user.username}`, icon: FaUser, color: 'text-blue-600' },
    { label: 'Email', value: user.email || 'Not provided', icon: FaEnvelope, color: 'text-green-600' },
    { label: 'Role', value: user.role.toUpperCase(), icon: FaShieldAlt, color: 'text-purple-600' },
    { label: 'User ID', value: user.id, icon: FaIdCard, color: 'text-gray-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <FaUser className="text-white text-3xl" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              <p className="text-purple-100">{user.role === 'admin' ? 'Administrator' : 'Analyst'}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.map((detail, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <detail.icon className={detail.color} size={18} />
                  <span className="text-sm text-gray-500">{detail.label}</span>
                </div>
                <p className="text-gray-800 font-medium">{detail.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                Status: {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}