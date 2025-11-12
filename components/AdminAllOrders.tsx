import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import { Order, OrderStatus } from '../types';

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

const AdminAllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allOrders: Order[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(allOrders);
      } else {
        setOrders([]);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(order =>
          order.displayId?.includes(searchQuery.trim())
        )
      );
    }
  }, [searchQuery, orders]);
  
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      await update(orderRef, { status: newStatus });
      // The local state will be updated by the onValue listener, no need to setOrders here.
    } catch (error) {
        alert('Failed to update status. Please try again.');
        console.error('Order status update failed:', error);
    } finally {
        setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading All Orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                 {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order.id} className={`${updatingId === order.id ? 'opacity-50' : ''} hover:bg-gray-50`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{order.displayId || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs"><a href={order.link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{order.link}</a></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">৳{order.charge.toFixed(4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          disabled={updatingId === order.id}
                          className="w-full p-1.5 text-xs border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>Partial</option>
                            <option>Cancelled</option>
                        </select>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                 ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                      No orders found.
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

export default AdminAllOrders;