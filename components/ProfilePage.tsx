import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { updateProfile, updatePassword, User } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { UserIcon, LockIcon } from './IconComponents';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            setFullName(currentUser.displayName || '');
        }
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProfile(true);
        setProfileMessage({ type: '', text: '' });

        if (!user || !fullName) {
            setProfileMessage({ type: 'error', text: 'Full name cannot be empty.' });
            setLoadingProfile(false);
            return;
        }

        try {
            // Update auth profile
            await updateProfile(user, { displayName: fullName });

            // Update database record
            const userDbRef = ref(database, `users/${user.uid}`);
            await update(userDbRef, { fullName });

            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error(error);
            setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoadingProfile(false);
            setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPassword(true);
        setPasswordMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: "Passwords don't match." });
            setLoadingPassword(false);
            return;
        }

        if (newPassword.length < 6) {
             setPasswordMessage({ type: 'error', text: "Password must be at least 6 characters." });
            setLoadingPassword(false);
            return;
        }

        if (!user) {
            setPasswordMessage({ type: 'error', text: "User not found." });
            setLoadingPassword(false);
            return;
        }

        try {
            await updatePassword(user, newPassword);
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error(error);
             // Firebase often requires recent login for this action.
            if (error.code === 'auth/requires-recent-login') {
                setPasswordMessage({ type: 'error', text: 'This action is sensitive. Please log out and log back in before changing your password.' });
            } else {
                setPasswordMessage({ type: 'error', text: 'Failed to change password.' });
            }
        } finally {
            setLoadingPassword(false);
            setTimeout(() => setPasswordMessage({ type: '', text: '' }), 5000);
        }
    };

    if (!user) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            {/* Profile Information Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">My Account</h2>
                <div className="space-y-4 mb-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="text-gray-800">{user.email}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-gray-500">Joined On</p>
                        <p className="text-gray-800">{new Date(user.metadata.creationTime!).toLocaleDateString()}</p>
                    </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                     <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative mt-1">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                id="fullName"
                                className="w-full py-2.5 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                     </div>
                     {profileMessage.text && (
                        <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{profileMessage.text}</p>
                     )}
                     <div>
                        <button type="submit" disabled={loadingProfile} className="px-5 py-2.5 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 disabled:bg-green-400">
                           {loadingProfile ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Change Password</h2>
                 <form onSubmit={handlePasswordChange} className="space-y-4">
                     <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                         <div className="relative mt-1">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="password"
                                id="newPassword"
                                className="w-full py-2.5 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>
                     </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                         <div className="relative mt-1">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full py-2.5 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>
                     </div>
                     {passwordMessage.text && (
                        <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{passwordMessage.text}</p>
                     )}
                     <div>
                        <button type="submit" disabled={loadingPassword} className="px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-blue-400">
                           {loadingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default ProfilePage;
