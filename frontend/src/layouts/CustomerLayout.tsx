import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;


