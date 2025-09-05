import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Role = 'admin' | 'staff' | 'customer';

const ProtectedRoute: React.FC<{ allowed: Role[] }> = ({ allowed }) => {
  const { token, user, role } = useAuth();
  if (!token) return <Navigate to="/auth/login" replace />;
  if (!user || !role) return <Navigate to="/auth/login" replace />;
  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;


