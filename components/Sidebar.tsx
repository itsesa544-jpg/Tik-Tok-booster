import React, { useState } from 'react';
import { 
  AddOrderIcon, 
  OrdersIcon, 
  AddFundsIcon, 
  HistoryIcon,
  CloseIcon, 
  ChevronRightIcon,
  PendingIcon,
  CompletedIcon,
  LogoutIcon,
  AdminIcon,
  UserIcon, // Added for profile page
} from './IconComponents';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  isAdmin: boolean;
}

interface NavLinkProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, text, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-left ${
        active 
        ? 'bg-green-600 text-white' 
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
    }`}>
        {icon}
        <span className="mx-4 font-medium">{text}</span>
    </button>
);

interface SubNavLinkProps {
    icon: React.ReactNode;
    text: string;
    active?: boolean;
    onClick: () => void;
}
  
const SubNavLink: React.FC<SubNavLinkProps> = ({ icon, text, active, onClick }) => (
    <button onClick={onClick} className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
        active
        ? 'bg-green-100 text-green-800'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
    }`}>
        {icon}
        <span className="mx-3 font-medium text-sm">{text}</span>
    </button>
);


const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activePage, setActivePage, onLogout, isAdmin }) => {
  const [isOrdersOpen, setOrdersOpen] = useState(false);

  const handleNavigation = (page: string) => {
    setActivePage(page);
    if (window.innerWidth < 1024) { // Close sidebar on mobile after navigation
        setIsOpen(false);
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 bg-white w-64 p-4 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 shadow-lg lg:shadow-none`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-700">TikTok Booster</h2>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col justify-between h-[calc(100%-5rem)]">
          <div>
            <NavLink 
              icon={<AddOrderIcon className="w-6 h-6"/>} 
              text="New Order" 
              active={activePage === 'New Order'}
              onClick={() => handleNavigation('New Order')}
            />
            
            <div className="my-1">
              <button 
                onClick={() => setOrdersOpen(!isOrdersOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 focus:outline-none"
                aria-expanded={isOrdersOpen}
                aria-controls="orders-submenu"
              >
                <div className="flex items-center">
                  <OrdersIcon className="w-6 h-6"/>
                  <span className="mx-4 font-medium">Orders</span>
                </div>
                <ChevronRightIcon className={`w-5 h-5 transition-transform duration-200 ${isOrdersOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOrdersOpen && (
                <div id="orders-submenu" className="pl-6 mt-1 space-y-1">
                  <SubNavLink icon={<OrdersIcon className="w-5 h-5"/>} text="All Orders" onClick={() => handleNavigation('All Orders')} active={activePage === 'All Orders'} />
                  <SubNavLink icon={<PendingIcon className="w-5 h-5"/>} text="Pending" onClick={() => handleNavigation('Pending Orders')} active={activePage === 'Pending Orders'} />
                  <SubNavLink icon={<CompletedIcon className="w-5 h-5"/>} text="Completed" onClick={() => handleNavigation('Completed Orders')} active={activePage === 'Completed Orders'} />
                </div>
              )}
            </div>

            <NavLink 
              icon={<AddFundsIcon className="w-6 h-6"/>} 
              text="Add Funds"
              active={activePage === 'Add Funds'}
              onClick={() => handleNavigation('Add Funds')}
            />

            <NavLink 
              icon={<HistoryIcon className="w-6 h-6"/>} 
              text="Payment History"
              active={activePage === 'Payment History'}
              onClick={() => handleNavigation('Payment History')}
            />

          </div>
          <div>
            <NavLink 
              icon={<UserIcon className="w-6 h-6"/>} 
              text="My Account"
              active={activePage === 'My Account'}
              onClick={() => handleNavigation('My Account')}
            />
            
            {isAdmin && (
              <div className="border-t pt-2">
                  <NavLink 
                    icon={<AdminIcon className="w-6 h-6"/>} 
                    text="Admin Panel"
                    active={activePage.startsWith('Admin')}
                    onClick={() => handleNavigation('Admin Dashboard')}
                  />
              </div>
            )}

            <button 
              onClick={onLogout} 
              className="w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-left text-gray-600 hover:bg-red-100 hover:text-red-700"
            >
              <LogoutIcon className="w-6 h-6"/>
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;