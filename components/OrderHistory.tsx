import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { auth, database } from '../firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

const statusColors: Record<OrderStatus, string> = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Partial: 'bg-purple-100 text-purple-800',
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
        {status}
    </span>
);

interface OrderHistoryProps {
  filterStatus?: OrderStatus | 'All';
  pageTitle: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ filterStatus = 'All', pageTitle }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
        setLoading(false);
        return;
    }

    const ordersRef = query(ref(database, 'orders'), orderByChild('uid'), equalTo(user.uid));

    const unsubscribe = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const allOrders: Order[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            if (filterStatus !== 'All' && filterStatus) {
                setOrders(allOrders.filter(order => order.status === filterStatus));
            } else {
                setOrders(allOrders);
            }
        } else {
            setOrders([]);
        }
        setLoading(false);
    }, (error) => {
        console.error(error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [filterStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading Order History...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{pageTitle}</h2>
       <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                 {orders.length > 0 ? (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{order.displayId || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs"><a href={order.link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{order.link}</a></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">৳{order.charge.toFixed(4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                 ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                      You have no orders here.
                    </td>
                  </tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;