import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, runTransaction } from 'firebase/database';
import { AppUser } from '../types';
import { DollarIcon, CloseIcon } from './IconComponents';

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList: AppUser[] = Object.values(data);
        setUsers(userList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setUsers([]);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const openModal = (user: AppUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setAmount('');
    setModalError('');
    setProcessing(false);
  };

  const closeModal = () => {
    if (processing) return;
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleBalanceUpdate = async (operation: 'add' | 'deduct') => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setModalError('Please enter a valid positive amount.');
      return;
    }
    
    if (!selectedUser) return;
    
    const confirmMessage = `Are you sure you want to ${operation} ৳${numericAmount.toFixed(2)} ${operation === 'add' ? 'to' : 'from'} ${selectedUser.email}'s balance?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setProcessing(true);
    setModalError('');
    const userRef = ref(database, `users/${selectedUser.uid}`);
    
    try {
        const { committed } = await runTransaction(userRef, (user) => {
            if (user) {
                const currentBalance = user.balance || 0;
                if (operation === 'deduct' && currentBalance < numericAmount) {
                    return; // Abort transaction
                }
                user.balance = operation === 'add' ? currentBalance + numericAmount : currentBalance - numericAmount;
            }
            return user;
        });

        if (committed) {
            closeModal();
        } else {
            setModalError('Transaction failed. User may have insufficient funds.');
        }
    } catch (e) {
        console.error('Balance update failed:', e);
        setModalError('An unexpected error occurred during the transaction.');
    } finally {
        setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading Users...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">৳{user.balance?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <button onClick={() => openModal(user)} className="text-green-600 hover:text-green-900 transition-colors">
                                <DollarIcon className="w-5 h-5" />
                                <span className="sr-only">Manage Balance</span>
                            </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
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
      
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Manage Balance</h3>
                    <button onClick={closeModal} disabled={processing}>
                        <CloseIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <p><span className="font-semibold">User:</span> {selectedUser.email}</p>
                        <p><span className="font-semibold">Current Balance:</span> ৳{selectedUser.balance?.toFixed(2) || '0.00'}</p>
                    </div>
                    {modalError && <p className="text-red-500 text-sm mb-4">{modalError}</p>}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">৳</span>
                                <input 
                                    type="number" 
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 pl-7"
                                    placeholder="e.g., 100"
                                    disabled={processing}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end items-center space-x-3">
                    <button onClick={() => handleBalanceUpdate('add')} disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-wait">
                        {processing ? 'Processing...' : 'Add Funds'}
                    </button>
                    <button onClick={() => handleBalanceUpdate('deduct')} disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-wait">
                        {processing ? 'Processing...' : 'Deduct Funds'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default AllUsers;