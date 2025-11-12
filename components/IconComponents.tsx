import React from 'react';

// Used in Header
export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// Used in Header
export const DeviceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
);

// Used in Sidebar
export const AddOrderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
);

// Used in Sidebar
export const OrdersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
);

// Used in Sidebar
export const AddFundsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

// Used in Sidebar
export const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 4v6h6"></path>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
);

// Used in Sidebar and Dashboard
export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// Used in Sidebar
export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

// Used in Sidebar
export const PendingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

// Used in Sidebar
export const CompletedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

// Used for copying text in AddFunds and Header
export const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

// Used to show success state (e.g., after copying)
export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

// WhatsApp Icon for Header
export const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M16.003 4.438a11.572 11.572 0 0 0-11.558 11.58 11.54 11.54 0 0 0 2.11 6.64l-2.07 7.548 7.72-2.022a11.53 11.53 0 0 0 3.798.57h.002a11.57 11.57 0 0 0 11.57-11.572 11.572 11.572 0 0 0-11.57-12.744zm6.83 8.94c-.378-.19-.83-.377-1.18-.532-.35-.155-.702-.27-1.054-.363-.42-.11-.78-.15-1.025-.15-.35 0-.663.037-.938.11l-.227.073c-.227.073-.455.18-.683.322-.227.142-.417.29-.572.443-.155.153-.29.31-.41.47-.118.16-.227.31-.326.455l-.11.148c-.082.11-.155.208-.22.29-.063.08-.12.148-.17.19-.05.044-.1.08-.14.11-.043.03-.09.06-.14.08-.05.022-.09.03-.13.03s-.09-.015-.14-.044c-.05-.03-.1-.06-.15-.09s-.1-.073-.14-.11l-.11-.08c-.06-.05-.14-.1-.23-.15-.09-.05-.2-.11-.32-.18-.12-.07-.26-.14-.42-.22l-.17-.082c-.17-.082-.36-.16-.57-.24-.21-.08-.44-.16-.68-.23l-.19-.055c-.21-.055-.42-.082-.63-.082-.18 0-.36.02-.54.06-.18.042-.35.1-.52.17s-.31.15-.45.23c-.14.08-.26.17-.37.26-.11.09-.2.18-.28.27s-.14.18-.19.26l-.08.11c-.05.07-.09.14-.12.2-.03.06-.05.12-.06.17-.01.05-.01.1-.01.14 0 .09.02.19.05.29.03.1.08.2.14.3.06.1.13.19.22.28.09.09.18.17.28.25.1.08.2.15.3.2l.14.09c.11.07.24.14.37.2.13.06.27.12.42.17.15.05.3.09.45.12.15.03.3.05.45.05.11 0 .22-.01.33-.02.11-.01.23-.04.34-.06.11-.02.23-.05.34-.09.11-.04.22-.08.33-.13.11-.05.22-.1.33-.15.11-.05.22-.1.32-.15.1-.05.18-.09.26-.13.08-.04.15-.07.2-.1l.1-.06c.07-.04.15-.09.24-.13.09-.04.18-.08.28-.11.1-.03.2-.05.3-.06.1-.01.19-.01.27-.01.19 0 .39.03.59.08.2.05.4.12.59.2.19.08.38.16.55.25.17.09.32.18.47.27.15.09.28.18.4.26.12.08.22.15.32.22.1.07.18.13.25.18.07.05.12.09.16.12.04.03.06.05.08.06.02.01.03.02.04.02.04 0 .1-.01.15-.04.05-.03.1-.06.15-.1.05-.04.1-.08.14-.13.04-.05.08-.1.1-.15.02-.05.04-.1.05-.15.01-.05.01-.1.01-.14 0-.05-.01-.1-.02-.15s-.02-.1-.04-.14c-.02-.04-.04-.08-.06-.11-.02-.03-.04-.06-.07-.09-.03-.03-.05-.06-.08-.08-.03-.02-.06-.04-.08-.06-.02-.02-.05-.04-.08-.06-.03-.02-.06-.04-.09-.05l-.11-.05c-.08-.04-.18-.08-.28-.12-.1-.04-.2-.08-.3-.11-.1-.03-.2-.06-.29-.08-.09-.02-.18-.04-.26-.05-.1-.01-.19-.02-.28-.02-.23 0-.47.04-.7.11-.23.07-.46.17-.68.29-.22.12-.42.25-.6.39zm-2.83 3.63c-.04.08-.07.15-.09.21-.02.06-.04.12-.05.17-.01.05-.01.1-.01.14 0 .11.02.22.05.32.03.1.09.2.16.29.07.09.16.17.26.25.1.08.2.15.32.22.12.07.24.13.37.18.13.05.27.1.41.14.14.04.28.07.43.09.15.02.3.03.45.03.36 0 .71-.05 1.04-.15.33-.1.65-.24.93-.43.28-.19.53-.41.74-.66.21-.25.38-.53.51-.83.13-.3.2-.62.2-.95 0-.17-.03-.34-.08-.51-.05-.17-.13-.33-.23-.48-.1-.15-.22-.29-.36-.42-.14-.13-.3-.24-.48-.34-.18-.1-.38-.18-.59-.24-.21-.06-.44-.1-.67-.1-.28 0-.55.05-.81.14-.26.09-.5.21-.72.36-.22.15-.42.31-.59.5-.17.19-.31.39-.42.61z"/>
    </svg>
);

// Used in Sidebar
export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

// Used in Sidebar
export const AdminIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

// Used in Admin Overview/Dashboard
export const UsersGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

export const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

export const DollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

export const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

// Used in Login/Signup pages
export const EmailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

export const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

// Used in Dashboard
export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

// Used in AddFunds
export const BikashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#D82A7D" />
        <path d="M10.06 14.44l1.79-1.8-1.55-.26.24-1.2h3.29l-3.3 3.31zm3.89-4.88l-1.8 1.8 1.55.26-.24 1.2h-3.3l3.3-3.31z" fill="white" />
    </svg>
);

export const NagadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#F58220" />
        <path d="M16.5 13.5h-9a1 1 0 01-1-1V8.5a1 1 0 011-1h1.75l3-3h2.5l-3 3H16.5a1 1 0 011 1v4a1 1 0 01-1 1zm-4.25-3.5h-1v-1h1v1z" fill="white" />
    </svg>
);

export const BinanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#F3BA2F"/>
        <path d="M12 5.25l3.75 3.75-1.5 1.5-2.25-2.25-2.25 2.25L8.25 9 12 5.25zm0 13.5l-3.75-3.75 1.5-1.5 2.25 2.25 2.25-2.25 1.5 1.5L12 18.75zm-3.75-6l1.5-1.5-1.5-1.5-1.5 1.5 1.5 1.5zm7.5 0l-1.5-1.5 1.5-1.5 1.5 1.5-1.5 1.5z" fill="white"/>
    </svg>
);

export const BybitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#F7A600"/>
        <path d="M12 5.5l-4.5 9h9L12 5.5zM8.5 16.5l3.5-3.5 3.5 3.5h-7z" fill="white"/>
    </svg>
);

export const QrCodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
        <line x1="14" y1="14" x2="14.01" y2="14"></line>
        <line x1="17" y1="14" x2="17.01" y2="14"></line>
        <line x1="14" y1="17" x2="14.01" y2="17"></line>
        <line x1="17" y1="17" x2="17.01" y2="17"></line>
        <line x1="20" y1="14" x2="20.01" y2="14"></line>
        <line x1="20" y1="17" x2="20.01" y2="17"></line>
        <line x1="14" y1="20" x2="14.01" y2="20"></line>
        <line x1="17" y1="20" x2="17.01" y2="20"></line>
        <line x1="20" y1="20" x2="20.01" y2="20"></line>
    </svg>
);

export const PasteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
);

// New Gift Icon for referral bonus
export const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="20 12 20 22 4 22 4 12"></polyline>
        <rect x="2" y="7" width="20" height="5"></rect>
        <line x1="12" y1="22" x2="12" y2="7"></line>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C9.81 2 12 4.19 12 7z"></path>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C14.19 2 12 4.19 12 7z"></path>
    </svg>
);

// New Share Icon
export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
);

// New icons for ShareSystem
export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

export const TelegramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 5.37a1.67 1.67 0 0 0-2.18-1.23L3 10.43a1.67 1.67 0 0 0 .1 3.12l4.1 1.28 9.49-5.97c.52-.33.95-.14.53.19L8.74 15.84l-.27 4.22a1.67 1.67 0 0 0 2.76 1.37l2.17-2.1 4.28 3.17a1.67 1.67 0 0 0 2.53-1.42V6.75a1.67 1.67 0 0 0-.96-1.38z"/>
    </svg>
);

// New icon for Admin Panel
export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);