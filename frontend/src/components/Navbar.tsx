import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4">
      <div className="font-semibold">Dashboard</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500">user@example.com</span>
        <button className="px-3 py-1 border rounded">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;


