import React, { useState, useEffect } from 'react';
import { FundRequest, PaymentStatus } from '../types';
import { auth, database } from '../firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

const statusColors: Record<PaymentStatus, string> = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => (
  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
    {status}
  </span>
);

const PaymentHistory: React.FC = () => {
  const [history, setHistory] = useState<FundRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const fundRequestsRef = query(
      ref(database, 'fundRequests'),
      orderByChild('uid'),
      equalTo(user.uid)
    );

    const unsubscribe = onValue(fundRequestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyList: FundRequest[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setHistory(historyList);
      } else {
        setHistory([]);
      }
      setLoading(false);
    }, (error) => {
        console.error(error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading Payment History...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h2>
      
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gateway</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.length > 0 ? (
                  history.map((payment: FundRequest) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(payment.date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {payment.currency === 'BDT' ? '৳' : '$'}{payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{payment.transactionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No payment history found.
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

export default PaymentHistory;
