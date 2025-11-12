import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { LoginRecord } from '../types';

const AdminPanel: React.FC = () => {
  const [logins, setLogins] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginsRef = query(ref(database, 'logins'), orderByChild('timestamp'), limitToLast(100));
    const unsubscribe = onValue(loginsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loginList: LoginRecord[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp); // Sort descending
        setLogins(loginList);
      } else {
        setLogins([]);
      }
      setLoading(false);
    }, (error) => {
        console.error(error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading Login History...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Login History</h2>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logins.length > 0 ? (
                  logins.map((login) => (
                    <tr key={login.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{login.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(login.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{login.uid}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No login history found.
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
};

export default AdminPanel;
