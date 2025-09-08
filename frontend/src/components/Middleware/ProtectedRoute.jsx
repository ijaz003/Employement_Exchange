import useAxios from '../../hooks/useAxios';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const axios = useAxios();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    // Only check payment for premium-required routes
    const premiumRoutes = ['/profile', '/resume-upload', '/my-applications', '/my-jobs', '/success', "/post-job"];
    // Add application route (dynamic)
    const isApplicationRoute = location.pathname.startsWith('/application/');
    const requiresPremium = premiumRoutes.includes(location.pathname) || isApplicationRoute;
    // Check if user already has premium
    const isPaid = user?.isPremium || user?.plan === 'premium';
    if (requiresPremium) {
      if (isPaid) {
        setAllowed(true);
      } else {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id') || user?.session_id;
        let url = '/payment/verify-payment';
        if (sessionId) {
          url += `?session_id=${sessionId}`;
        }
        axios.get(url)
          .then(res => setAllowed(res.data.paid))
          .catch(() => setAllowed(false));
      }
    } else {
      setAllowed(true);
    }
  }, [location, user]);

  if (allowed === null) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-4"></div>
        <span className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Checking payment status...</span>
      </div>
    </div>
  );
  if (!allowed) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <span className="text-xl text-red-600 dark:text-red-400 font-bold mb-4">Access requires a paid plan.</span>
        <span className="text-lg text-gray-700 dark:text-gray-300 mb-4">Please purchase a premium plan to continue.</span>
        <a href="/plane" className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition">Go to Buy Plan</a>
      </div>
    </div>
  );
  return children;
};

export default ProtectedRoute;