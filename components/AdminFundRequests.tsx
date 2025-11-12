import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, query, orderByChild, equalTo, update, runTransaction } from 'firebase/database';
import { FundRequest, PaymentStatus } from '../types';

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

const AdminFundRequests: React.FC = () => {
  const [requests, setRequests] = useState<FundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const requestsRef = query(ref(database, 'fundRequests'), orderByChild('status'), equalTo('Pending'));
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const requestList: FundRequest[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setRequests(requestList);
      } else {
        setRequests([]);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleApprove = async (request: FundRequest) => {
    if (window.confirm(`Are you sure you want to approve ৳${request.amount} for ${request.userEmail}?`)) {
        setProcessingId(request.id);
        const userRef = ref(database, `users/${request.uid}`);
        
        try {
            const { committed } = await runTransaction(userRef, (user) => {
                if (user) {
                    user.balance = (user.balance || 0) + request.amount;
                } else {
                    // Abort if user does not exist
                    return;
                }
                return user;
            });
            
            if (committed) {
                const requestRef = ref(database, `fundRequests/${request.id}`);
                await update(requestRef, { status: 'Completed' });
            } else {
                 alert("Approval failed: Could not update the user's balance. The user may not exist.");
            }

        } catch (error) {
            console.error("Failed to approve transaction: ", error);
            alert("An error occurred. Please try again.");
        } finally {
            setProcessingId(null);
        }
    }
  };

  const handleReject = async (requestId: string) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
        setProcessingId(requestId);
        try {
            const requestRef = ref(database, `fundRequests/${requestId}`);
            await update(requestRef, { status: 'Cancelled' });
        } catch(error) {
            console.error("Failed to reject transaction: ", error);
            alert("An error occurred. Please try again.");
        } finally {
            setProcessingId(null);
        }
    }
  };


  if (loading) {
    return <div className="text-center p-8">Loading requests...</div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Fund Requests</h2>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trx ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                   <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">৳{req.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{req.transactionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(req.date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-2">
                        <button onClick={() => handleApprove(req)} disabled={processingId === req.id} className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400">Approve</button>
                        <button onClick={() => handleReject(req.id)} disabled={processingId === req.id} className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-400">Reject</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No pending fund requests.
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

export default AdminFundRequests;