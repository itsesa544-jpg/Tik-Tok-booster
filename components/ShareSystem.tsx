import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { CopyIcon, CheckIcon, FacebookIcon, WhatsAppIcon, TelegramIcon, ShareIcon, GiftIcon } from './IconComponents';
import { AppUser } from '../types';

const ShareSystem: React.FC = () => {
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [userName, setUserName] = useState('');
  const [referredUsers, setReferredUsers] = useState<AppUser[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);

  useEffect(() => {
    // Check for Web Share API support on component mount
    if (navigator.share) {
      setCanShare(true);
    }
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || 'User');
      // Construct the base URL from the current window location
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setReferralLink(`${baseUrl}/?ref=${user.uid}`);

      // Fetch referred users
      const referralsQuery = query(ref(database, 'users'), orderByChild('referredBy'), equalTo(user.uid));
      const unsubscribe = onValue(referralsQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const usersList: AppUser[] = Object.values(data);
          setReferredUsers(usersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else {
          setReferredUsers([]);
        }
        setLoadingReferrals(false);
      });
      return () => unsubscribe();
    }
  }, []);

  if (!referralLink) {
    return null; // Don't render if the user is not logged in or link isn't generated yet
  }

  const shareText = "Join TikTok Booster and get started with your social media marketing!";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share & Earn on TikTok Booster',
          text: shareText,
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // This is a fallback, but the button should ideally not be rendered if navigator.share is not available.
      alert('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Share & Earn, {userName}!</h2>
      <p className="text-gray-600 mb-4">
        Share your referral link with friends. When they sign up and add funds, you'll receive a bonus!
      </p>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="w-full flex-grow bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:outline-none p-3 font-mono"
        />
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto px-4 py-3 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 flex items-center justify-center transition-all duration-200"
        >
          {copied ? (
            <>
              <CheckIcon className="h-5 w-5 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="h-5 w-5 mr-2" />
              Copy Link
            </>
          )}
        </button>
      </div>
      
      {/* Conditional rendering for share options */}
      {canShare ? (
        <button
          onClick={handleNativeShare}
          className="w-full px-5 py-3 text-base font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 transition-transform transform hover:scale-105 flex items-center justify-center"
        >
          <ShareIcon className="w-5 h-5 mr-3" />
          Share Referral Link
        </button>
      ) : (
        <div className="mt-4 flex items-center justify-center sm:justify-start space-x-3">
          <p className="text-sm font-medium text-gray-600">Share on:</p>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110" aria-label="Share on Facebook">
            <FacebookIcon className="w-8 h-8"/>
          </a>
           <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 transition-transform transform hover:scale-110" aria-label="Share on WhatsApp">
            <WhatsAppIcon className="w-8 h-8"/>
          </a>
           <a href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-110" aria-label="Share on Telegram">
            <TelegramIcon className="w-8 h-8"/>
          </a>
        </div>
      )}

      <div className="mt-6 p-4 bg-green-50 border-2 border-dashed border-green-400 rounded-lg text-center flex flex-col items-center gap-2">
          <GiftIcon className="w-8 h-8 text-green-600" />
          <p className="text-green-800 font-medium text-sm">
              আপনার বন্ধুকে আপনার ব্যক্তিগত শেয়ার লিংক/কোড দিয়ে রেজিস্টার করান; রেজিস্ট্রেশন সফল হলে আপনাকে ৳২ এবং রেফার করা বন্ধুকে ৳2 হবে — তৎক্ষণাত ওয়ালেটে যোগ হবে।
          </p>
      </div>

      {/* New referrals table section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Referrals</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus Earned</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingReferrals ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Loading referrals...
                      </td>
                    </tr>
                  ) : referredUsers.length > 0 ? (
                    referredUsers.map((user) => (
                      <tr key={user.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">৳2.00</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        You have not referred anyone yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSystem;