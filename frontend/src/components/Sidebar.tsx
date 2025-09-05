import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiCreditCard, FiTool, FiBell } from 'react-icons/fi';

const navByRole: Record<string, Array<{ to: string; label: string; icon: React.ReactNode }>> = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: <FiHome /> },
    { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
    { to: '/admin/packages', label: 'Packages', icon: <FiCreditCard /> },
    { to: '/admin/payments', label: 'Payments', icon: <FiCreditCard /> },
    { to: '/admin/equipment', label: 'Equipment', icon: <FiTool /> },
    { to: '/admin/announcements', label: 'Announcements', icon: <FiBell /> }
  ],
  staff: [
    { to: '/staff', label: 'Dashboard', icon: <FiHome /> },
    { to: '/staff/members', label: 'Members', icon: <FiUsers /> },
    { to: '/staff/payments', label: 'Payments', icon: <FiCreditCard /> },
    { to: '/staff/alerts', label: 'Alerts', icon: <FiBell /> }
  ]
};

const Sidebar: React.FC<{ role: 'admin' | 'staff' }> = ({ role }) => {
  const items = navByRole[role] || [];
  const { pathname } = useLocation();
  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 hidden md:block">
      <div className="p-4 font-bold text-xl">LidarFit</div>
      <nav className="mt-2">
        {items.map(item => (
          <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 ${pathname === item.to ? 'bg-gray-100 font-semibold' : ''}`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;


