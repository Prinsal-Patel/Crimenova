import { useEffect, useState } from 'react';
import { Users, Clock } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('crimenova_token');
        const res = await fetch('/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch users. You might not have permission.');
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="page-container">
          <div className="flex flex-col items-center justify-center h-64 text-cyan-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
            Loading user access logs...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-container">
        <div className="page-header animate-in">
          <h1 className="page-title flex items-center gap-3">
            <Users className="text-cyan-400" size={32} />
            User Access Logs
          </h1>
          <p className="page-subtitle text-gray-400 mt-2">View system users and their recent login activity</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 mb-6 flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="glass-card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700/50">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300">User</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {user.picture ? (
                        <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-gray-700" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-cyan-600/30 text-cyan-400 flex items-center justify-center font-bold border border-cyan-600/50">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-gray-100">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'Admin' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : 
                        user.role === 'Police' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm flex items-center gap-2">
                      <Clock size={14} className="text-gray-500" />
                      {new Date(user.lastLogin).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !error && (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-400">
                      <Users size={48} className="mx-auto mb-4 opacity-20" />
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
