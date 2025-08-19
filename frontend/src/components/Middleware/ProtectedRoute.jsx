
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    // Only check payment for premium-required routes
    const premiumRoutes = ['/profile', '/resume-upload', '/my-applications', '/my-jobs', '/success'];
    if (premiumRoutes.includes(location.pathname)) {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id') || user?.session_id;
      let url = 'http://localhost:4000/payment/verify-payment';
      if (sessionId) {
        url += `/${sessionId}`;
      }
      fetch(url, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setAllowed(data.paid))
        .catch(() => setAllowed(false));
    } else {
      setAllowed(true);
    }
  }, [location, user]);

  if (allowed === null) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-4"></div>
        <span className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Checking payment...</span>
      </div>
    </div>
  );
  if (!allowed) return <Navigate to="/plane" replace />;
  return children;
};

export default ProtectedRoute;