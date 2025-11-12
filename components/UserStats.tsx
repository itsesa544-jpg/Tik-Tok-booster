import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { Order } from '../types';
import { CompletedIcon, DollarIcon, PendingIcon } from './IconComponents';

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


const UserStats: React.FC = () => {
    const [stats, setStats] = useState({
        activeOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const ordersRef = query(ref(database, 'orders'), orderByChild('uid'), equalTo(user.uid));

        const unsubscribe = onValue(ordersRef, (snapshot) => {
            if (snapshot.exists()) {
                const ordersData: Record<string, Order> = snapshot.val();
                const ordersList = Object.values(ordersData);

                const activeOrders = ordersList.filter(o => o.status === 'Pending' || o.status === 'In Progress').length;
                const completedOrders = ordersList.filter(o => o.status === 'Completed').length;
                const totalSpent = ordersList.reduce((sum, o) => sum + o.charge, 0);

                setStats({ activeOrders, completedOrders, totalSpent });
            } else {
                setStats({ activeOrders: 0, completedOrders: 0, totalSpent: 0 });
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
                title="Active Orders"
                value={stats.activeOrders}
                loading={loading}
                icon={<PendingIcon className="w-6 h-6 text-white" />}
                iconBgColor="bg-yellow-500"
            />
            <StatCard
                title="Completed Orders"
                value={stats.completedOrders}
                loading={loading}
                icon={<CompletedIcon className="w-6 h-6 text-white" />}
                iconBgColor="bg-green-500"
            />
            <StatCard
                title="Total Spent"
                value={`৳${stats.totalSpent.toFixed(2)}`}
                loading={loading}
                icon={<DollarIcon className="w-6 h-6 text-white" />}
                iconBgColor="bg-indigo-500"
            />
        </div>
    );
};

export default UserStats;
