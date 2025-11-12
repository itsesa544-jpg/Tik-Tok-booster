import React, { useState, useEffect } from 'react';
import { UserIcon, EmailIcon, LockIcon } from '../components/IconComponents';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { ref, set, runTransaction } from 'firebase/database';
import { AppUser } from '../types';


interface SignupPageProps {
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referrerId, setReferrerId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get('ref');
    if (refId) {
      setReferrerId(refId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase auth profile with display name
      await updateProfile(user, { displayName: fullName });

      // Prepare user data
      const userData: Omit<AppUser, 'balance'> & { balance: number; referredBy?: string } = {
        fullName: fullName,
        email: email,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        role: 'user', // Assign default role
        balance: 2, // Welcome bonus for all new users
      };

      // Add referrer ID and award bonuses if it exists
      if (referrerId) {
        userData.referredBy = referrerId;

        // Award bonus to the referrer
        const referrerRef = ref(database, `users/${referrerId}`);
        await runTransaction(referrerRef, (referrerData) => {
            if (referrerData) {
                referrerData.balance = (referrerData.balance || 0) + 2;
            }
            return referrerData;
        }).catch(err => {
            // Log if transaction fails, but don't block signup
            console.error("Failed to award referrer bonus:", err);
        });
      }
      
      // Save user info to Realtime Database
      await set(ref(database, 'users/' + user.uid), userData);

      await signOut(auth); // Sign out user immediately
      onSwitchToLogin(); // Redirect to login page

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।');
      } else if (err.code === 'auth/weak-password') {
        setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      } else {
        setError('একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        
        <div className="p-4 mb-2 text-center bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-l-4 border-green-500">
            <h1 className="text-xl font-bold text-green-800">🎬 “আপনার TikTok আইডিকে দিন নতুন উচ্চতা!”</h1>
            <p className="mt-2 text-sm text-gray-700">
            ✨ এখনই TikTok Booster-এ যোগ দিন — আপনার ভিডিওতে রিয়েল ভিউ, লাইক, কমেন্ট ও শেয়ার বাড়ান সহজে! 🔥 আপনার প্রোফাইলকে করুন আরও জনপ্রিয়, আর উপভোগ করুন ভাইরাল হওয়ার আসল অভিজ্ঞতা!
            </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="mt-3 text-gray-600">
             🚀 এখনই যোগ দিন TikTok Booster পরিবারে! <br/>
             রেফার করে ইনকাম করুন, সার্ভিস অর্ডার দিন, আর আপনার টিকটক প্রোফাইলকে দিন নতুন উচ্চতা!
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <UserIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="আপনার সম্পূর্ণ নাম লিখুন"
              className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <EmailIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="email"
              placeholder="আপনার ইমেইল দিন"
              className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="password"
              placeholder="একটি নতুন পাসওয়ার্ড দিন"
              className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
           <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="password"
              placeholder="পাসওয়ার্ডটি আবার দিন"
              className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="text-xs text-center text-gray-500 space-y-1 pt-2">
            <p>✅ অ্যাকাউন্ট তৈরি করলেই আপনি পাবেন ওয়েলকাম বোনাস!</p>
            <p>🔒 নিরাপত্তার জন্য আপনার তথ্য গোপন রাখা হবে।</p>
            <p>🔑 সুরক্ষিত থাকতে, অন্য কোনো ওয়েবসাইটে ব্যবহার করেননি এমন একটি নতুন পাসওয়ার্ড দিন।</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center -mt-2">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
            </button>
          </div>
        </form>
        <div className="text-center text-gray-600">
          <p>
            আগেই অ্যাকাউন্ট আছে?{' '}
            <button onClick={onSwitchToLogin} className="font-medium text-green-600 hover:underline">
              লগইন করুন
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;