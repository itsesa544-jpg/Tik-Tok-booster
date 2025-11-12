import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
// Fix: Import `get` to resolve `Cannot find name 'get'` error.
import { ref, onValue, query, orderByChild, limitToLast, get } from 'firebase/database';
import { Order, OrderStatus, FundRequest, PaymentStatus } from '../types';
import { UsersGroupIcon, ShoppingCartIcon, DollarIcon, ListIcon } from './IconComponents';

// --- Reusable Components ---
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, loading, iconBgColor }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            {loading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
            ) : (
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor}`}>
            {icon}
        </div>
    </div>
);

const orderStatusColors: Record<OrderStatus, string> = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Partial: 'bg-purple-100 text-purple-800',
};
const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${orderStatusColors[status]}`}>
        {status}
    </span>
);

const paymentStatusColors: Record<PaymentStatus, string> = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
};
const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => (
  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[status]}`}>
    {status}
  </span>
);


// --- Main Overview Component ---
const AdminOverview: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [recentRequests, setRecentRequests] = useState<FundRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const usersRef = ref(database, 'users');
        const ordersRef = ref(database, 'orders');
        const fundsRef = ref(database, 'fundRequests');

        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            if (isMounted && snapshot.exists()) {
                setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
            }
        });

        const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
            if (isMounted && snapshot.exists()) {
                const ordersData: Record<string, Order> = snapshot.val();
                const ordersList = Object.values(ordersData);
                const totalOrders = ordersList.length;
                const pendingOrders = ordersList.filter(o => o.status === 'Pending').length;
                const totalRevenue = ordersList
                    .filter(o => o.status === 'Completed' || o.status === 'Partial')
                    .reduce((sum, o) => sum + o.charge, 0);

                setStats(prev => ({ ...prev, totalOrders, pendingOrders, totalRevenue }));
            }
        });
        
        // Fetch recent 5 orders
        const recentOrdersQuery = query(ordersRef, orderByChild('createdAt'), limitToLast(5));
        const unsubscribeRecentOrders = onValue(recentOrdersQuery, (snapshot) => {
            if(isMounted && snapshot.exists()){
                const ordersData = snapshot.val();
                const ordersList: Order[] = Object.keys(ordersData).map(key => ({ id: key, ...ordersData[key]})).reverse();
                setRecentOrders(ordersList);
            }
        });

        // Fetch recent 5 fund requests
        const recentFundsQuery = query(fundsRef, orderByChild('date'), limitToLast(5));
        const unsubscribeRecentFunds = onValue(recentFundsQuery, (snapshot) => {
             if(isMounted && snapshot.exists()){
                const fundsData = snapshot.val();
                const fundsList: FundRequest[] = Object.keys(fundsData).map(key => ({ id: key, ...fundsData[key]})).reverse();
                setRecentRequests(fundsList);
            }
        });

        // Combine loading state management
        Promise.all([get(usersRef), get(ordersRef)]).finally(() => {
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
            unsubscribeUsers();
            unsubscribeOrders();
            unsubscribeRecentOrders();
            unsubscribeRecentFunds();
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} loading={loading} icon={<UsersGroupIcon className="w-6 h-6 text-white" />} iconBgColor="bg-blue-500" />
                <StatCard title="Total Orders" value={stats.totalOrders} loading={loading} icon={<ShoppingCartIcon className="w-6 h-6 text-white" />} iconBgColor="bg-green-500" />
                <StatCard title="Total Revenue" value={`৳${stats.totalRevenue.toFixed(2)}`} loading={loading} icon={<DollarIcon className="w-6 h-6 text-white" />} iconBgColor="bg-indigo-500" />
                <StatCard title="Pending Orders" value={stats.pendingOrders} loading={loading} icon={<ListIcon className="w-6 h-6 text-white" />} iconBgColor="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Table */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">Order ID</th>
                                <th scope="col" className="px-4 py-3">User</th>
                                <th scope="col" className="px-4 py-3">Charge</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? Array.from({length: 5}).map((_, i) => (
                                <tr key={i} className="border-b"><td colSpan={4} className="px-4 py-4"><div className="h-5 bg-gray-200 rounded animate-pulse"></div></td></tr>
                            )) : recentOrders.length > 0 ? recentOrders.map(order => (
                                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap font-mono">{order.displayId || 'N/A'}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{order.userEmail}</td>
                                    <td className="px-4 py-3">৳{order.charge.toFixed(2)}</td>
                                    <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="text-center py-4">No recent orders.</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
              </div>

              {/* Recent Fund Requests Table */}
               <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Fund Requests</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">User</th>
                                <th scope="col" className="px-4 py-3">Amount</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? Array.from({length: 5}).map((_, i) => (
                                <tr key={i} className="border-b"><td colSpan={3} className="px-4 py-4"><div className="h-5 bg-gray-200 rounded animate-pulse"></div></td></tr>
                            )) : recentRequests.length > 0 ? recentRequests.map(req => (
                                <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{req.userEmail}</td>
                                    <td className="px-4 py-3">৳{req.amount.toFixed(2)}</td>
                                    <td className="px-4 py-3"><PaymentStatusBadge status={req.status} /></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3} className="text-center py-4">No recent fund requests.</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
              </div>
            </div>
        </div>
    );
};

export default AdminOverview;