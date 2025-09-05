import React from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminPackages from '../pages/admin/Packages';
import StaffDashboard from '../pages/staff/Dashboard';
import CustomerDashboard from '../pages/customer/Dashboard';
import ProtectedRoute from './ProtectedRoute';

export type Role = 'admin' | 'staff' | 'customer' | null;

const getUserRole = (): Role => {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user?.role ?? null;
  } catch {
    return null;
  }
};

// Note: Runtime protection is handled by ProtectedRoute using AuthContext.

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Toaster position="top-right" />
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: (() => {
          const role = getUserRole();
          if (role === 'admin') return <Navigate to="/admin" replace />;
          if (role === 'staff') return <Navigate to="/staff" replace />;
          if (role === 'customer') return <Navigate to="/customer" replace />;
          return <Navigate to="/auth/login" replace />;
        })()
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> }
        ]
      },
      {
        path: 'admin',
        element: (<ProtectedRoute allowed={['admin']} />),
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: 'users', element: <AdminUsers /> },
              { path: 'packages', element: <AdminPackages /> }
            ]
          }
        ]
      },
      {
        path: 'staff',
        element: (<ProtectedRoute allowed={['admin', 'staff']} />),
        children: [
          {
            element: <StaffLayout />,
            children: [
              { index: true, element: <StaffDashboard /> }
            ]
          }
        ]
      },
      {
        path: 'customer',
        element: (<ProtectedRoute allowed={['customer', 'admin', 'staff']} />),
        children: [
          {
            element: <CustomerLayout />,
            children: [
              { index: true, element: <CustomerDashboard /> }
            ]
          }
        ]
      }
    ]
  }
], {
  future: {
    v7_startTransition: true
  }
});


