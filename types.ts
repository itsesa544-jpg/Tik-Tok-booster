// Fix: Define and export interfaces for Category and Service.
export interface Category {
  name: string;
}

export interface Service {
  id: number;
  name: string;
  details: string[];
  rate: number;
  min: number;
  max: number;
  category: string;
  refill?: boolean;
}

export type PaymentStatus = 'Pending' | 'Completed' | 'Cancelled';

// Renamed from Payment to better reflect its purpose
export interface FundRequest {
  id: string; // Firebase key
  uid: string;
  userEmail: string;
  date: string; // ISO String
  amount: number;
  currency: 'BDT' | 'USD';
  method: string; // Now a string to accommodate dynamic methods
  transactionId: string;
  status: PaymentStatus;
}

// New type for orders
export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Partial';

export interface Order {
  id: string; // Firebase key
  displayId: string; // New 6-digit user-facing ID
  uid: string;
  userEmail: string;
  serviceId: number;
  serviceName: string;
  link: string;
  quantity: number;
  charge: number;
  createdAt: string; // ISO String
  status: OrderStatus;
  providerOrderId?: number;
}


// Added for Admin Panel functionality
export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  createdAt: string;
  role: 'user' | 'admin';
  balance?: number;
  referredBy?: string;
}

export interface LoginRecord {
  id: string;
  uid: string;
  email: string;
  timestamp: number;
}

// New interface for dynamic payment methods
export interface PaymentMethodDetails {
  id: string; // Firebase key e.g., 'bkash'
  name: string; // e.g., 'bKash'
  account: string;
  accountName: string;
  type: string; // 'Personal', 'TRC20 Address'
  note?: string;
  logoUrl?: string; // URL for a custom logo image
  qrCodeUrl?: string;
  category: 'local' | 'crypto';
  enabled: boolean;
}