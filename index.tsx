import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { auth } from './firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

const AppContainer: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle referral links on initial load
  useEffect(() => {
    // This effect should only run if the user is not logged in.
    if (!user && !loading) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('ref')) {
        setIsLoginView(false); // Switch to signup view
        setSignupSuccess(false); // Ensure no success message is shown
      }
    }
  }, [user, loading]);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Logout failed", error));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (isLoginView) {
      return (
        <LoginPage 
            onSwitchToSignup={() => {
                setSignupSuccess(false);
                setIsLoginView(false);
            }} 
            signupSuccess={signupSuccess}
            clearSignupSuccess={() => setSignupSuccess(false)}
        />
      );
    }
    return <SignupPage onSwitchToLogin={() => {
        setSignupSuccess(true);
        setIsLoginView(true);
    }} />;
  }

  return <App onLogout={handleLogout} />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppContainer />
  </React.StrictMode>
);