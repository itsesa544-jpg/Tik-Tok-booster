import React, { useState } from 'react';
import AdminOverview from './AdminOverview';
import AdminFundRequests from './AdminFundRequests';
import AllUsers from './AllUsers';
import AdminAllOrders from './AdminAllOrders';
import AdminPanel from './AdminPanel';
import AdminPaymentSettings from './AdminPaymentSettings'; // New import
import { 
  HistoryIcon,
  UsersGroupIcon, 
  DollarIcon, 
  ListIcon,
  LogoutIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  ChevronRightIcon,
  MenuIcon, 
  CloseIcon,
  SettingsIcon, // New import
} from './IconComponents';

// --- Footer Component ---
const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-center py-3 border-t text-sm text-gray-500">
      <p>
        &copy; {new Date().getFullYear()} Share It System. All Rights Reserved.
      </p>
    </footer>
  );
};

type AdminPage = 'Overview' | 'All Orders' | 'Fund Requests' | 'All Users' | 'Login History' | 'Payment Settings';

// --- Reusable NavLink Components ---
const NavLink: React.FC<{icon: React.ReactNode, text: string, active: boolean, onClick: () => void}> = ({ icon, text, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-left ${
        active 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}>
        {icon}
        <span className="mx-4 font-medium">{text}</span>
    </button>
);

const SubNavLink: React.FC<{icon: React.ReactNode, text: string, active: boolean, onClick: () => void}> = ({ icon, text, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center py-2 px-3 rounded-lg transition-colors duration-200 text-left ${
        active
        ? 'bg-gray-700 text-white'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}>
        {icon}
        <span className="mx-3 font-medium text-sm">{text}</span>
    </button>
);

// --- Responsive AdminHeader Component ---
const AdminHeader: React.FC<{ toggleSidebar: () => void; pageTitle: string }> = ({ toggleSidebar, pageTitle }) => (
  <header className="sticky top-0 bg-white border-b shadow-sm z-10 lg:hidden">
    <div className="flex items-center justify-start px-4 sm:px-6 py-4">
      <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none">
        <MenuIcon className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-bold text-gray-800 ml-4">{pageTitle}</h1>
    </div>
  </header>
);

// --- Responsive AdminSidebar Component ---
interface AdminSidebarProps {
  activePage: AdminPage;
  setActivePage: (page: AdminPage) => void;
  onLogout: () => void;
  onSwitchToUser: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  forceAdminView: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, setActivePage, onLogout, onSwitchToUser, isOpen, setIsOpen, forceAdminView }) => {
  const [isOrdersOpen, setOrdersOpen] = useState(false);
  const [isPaymentsOpen, setPaymentsOpen] = useState(false);
  const [isUsersOpen, setUsersOpen] = useState(false);

  const handleNavigation = (page: AdminPage) => {
    setActivePage(page);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      ></div>
      <div className={`bg-gray-900 text-white w-64 p-4 flex flex-col h-screen fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col justify-between flex-grow">
          <div>
            {!forceAdminView && (
              <>
                <button onClick={onSwitchToUser} className="w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-left text-green-400 hover:bg-green-900">
                  <ArrowLeftIcon className="w-6 h-6"/>
                  <span className="mx-4 font-medium">Back to User Panel</span>
                </button>
                <div className="border-t border-gray-700 my-4"></div>
              </>
            )}
            
            <NavLink icon={<ListIcon className="w-6 h-6"/>} text="Overview" active={activePage === 'Overview'} onClick={() => handleNavigation('Overview')} />
            
            <div className="my-1">
              <button onClick={() => setOrdersOpen(!isOrdersOpen)} className="w-full flex items-center justify-between p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 focus:outline-none">
                  <div className="flex items-center">
                      <ShoppingCartIcon className="w-6 h-6"/>
                      <span className="mx-4 font-medium">Orders</span>
                  </div>
                  <ChevronRightIcon className={`w-5 h-5 transition-transform duration-200 ${isOrdersOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOrdersOpen && (
                  <div className="pl-6 mt-1 space-y-1">
                      <SubNavLink icon={<ShoppingCartIcon className="w-5 h-5"/>} text="All Orders" active={activePage === 'All Orders'} onClick={() => handleNavigation('All Orders')} />
                  </div>
              )}
            </div>
            
            <div className="my-1">
               <button onClick={() => setPaymentsOpen(!isPaymentsOpen)} className="w-full flex items-center justify-between p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 focus:outline-none">
                  <div className="flex items-center">
                      <DollarIcon className="w-6 h-6"/>
                      <span className="mx-4 font-medium">Payments</span>
                  </div>
                  <ChevronRightIcon className={`w-5 h-5 transition-transform duration-200 ${isPaymentsOpen ? 'rotate-90' : ''}`} />
              </button>
              {isPaymentsOpen && (
                  <div className="pl-6 mt-1 space-y-1">
                      <SubNavLink icon={<DollarIcon className="w-5 h-5"/>} text="Fund Requests" active={activePage === 'Fund Requests'} onClick={() => handleNavigation('Fund Requests')} />
                      <SubNavLink icon={<SettingsIcon className="w-5 h-5"/>} text="Payment Settings" active={activePage === 'Payment Settings'} onClick={() => handleNavigation('Payment Settings')} />
                  </div>
              )}
            </div>

            <div className="my-1">
              <button onClick={() => setUsersOpen(!isUsersOpen)} className="w-full flex items-center justify-between p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 focus:outline-none">
                  <div className="flex items-center">
                      <UsersGroupIcon className="w-6 h-6"/>
                      <span className="mx-4 font-medium">Users</span>
                  </div>
                  <ChevronRightIcon className={`w-5 h-5 transition-transform duration-200 ${isUsersOpen ? 'rotate-90' : ''}`} />
              </button>
              {isUsersOpen && (
                  <div className="pl-6 mt-1 space-y-1">
                      <SubNavLink icon={<UsersGroupIcon className="w-5 h-5"/>} text="All Users" active={activePage === 'All Users'} onClick={() => handleNavigation('All Users')} />
                      <SubNavLink icon={<HistoryIcon className="w-5 h-5"/>} text="Login History" active={activePage === 'Login History'} onClick={() => handleNavigation('Login History')} />
                  </div>
              )}
            </div>
          </div>
          <div>
            <button onClick={onLogout} className="w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-left text-gray-400 hover:bg-red-800 hover:text-white">
              <LogoutIcon className="w-6 h-6"/>
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};


// --- Main AdminLayout Component ---
interface AdminLayoutProps {
  onLogout: () => void;
  onSwitchToUser: () => void;
  forceAdminView?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout, onSwitchToUser, forceAdminView = false }) => {
  const [activePage, setActivePage] = useState<AdminPage>('Overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case 'Overview': return <AdminOverview />;
      case 'All Orders': return <AdminAllOrders />;
      case 'Fund Requests': return <AdminFundRequests />;
      case 'All Users': return <AllUsers />;
      case 'Login History': return <AdminPanel />;
      case 'Payment Settings': return <AdminPaymentSettings />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="bg-gray-100">
      <AdminSidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={onLogout}
        onSwitchToUser={onSwitchToUser}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        forceAdminView={forceAdminView}
      />
      <div className="flex flex-col min-h-screen lg:ml-64">
        <AdminHeader toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} pageTitle={activePage} />
        <main className="flex-grow p-4 sm:p-6">
          <h1 className="hidden lg:block text-3xl font-bold text-gray-800 mb-6">{activePage}</h1>
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;