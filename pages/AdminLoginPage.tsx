import React, { useState } from 'react';
import { LockIcon } from '../components/IconComponents';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // In a real application, this should not be hardcoded.
  // It should be fetched from a secure configuration source.
  const ADMIN_PASSWORD = 'adminpanel123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay for better UX
    setTimeout(() => {
        if (password === ADMIN_PASSWORD) {
            onSuccess();
        } else {
            setError('Incorrect password. Please try again.');
            setLoading(false);
        }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
          <p className="mt-2 text-gray-600">Enter the password to continue</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
               <LockIcon className="w-5 h-5 text-gray-400" />
             </span>
             <input
               type="password"
               placeholder="Admin Password"
               className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               disabled={loading}
             />
          </div>
          {error && <p className="text-red-500 text-sm text-center -mt-2">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
            >
              {loading ? 'Verifying...' : 'Enter Admin Panel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;