import React from 'react';
import { MenuIcon } from './IconComponents';

interface HeaderProps {
  toggleSidebar: () => void;
  balance: number;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, balance }) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b shadow-sm">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden" aria-label="Toggle sidebar">
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="relative text-lg font-semibold ml-2 text-gray-700">TikTok Booster</div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center space-x-2 text-sm font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
            <span>Balance: ৳ {balance.toFixed(2)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;