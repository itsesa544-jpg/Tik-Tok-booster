import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, update, set } from 'firebase/database';
import { PaymentMethodDetails } from '../types';
import { CheckIcon } from './IconComponents';

const initialMethodsData = {
    'bkash': { name: 'bKash', account: '01700000000', accountName: 'John Doe', type: 'Personal', note: 'Send money is not available.', logoUrl: '', qrCodeUrl: '', category: 'local', enabled: true },
    'nagad': { name: 'Nagad', account: '01800000000', accountName: 'Jane Smith', type: 'Personal', note: 'Only Cash-in is allowed.', logoUrl: '', qrCodeUrl: '', category: 'local', enabled: true },
    'binance': { name: 'Binance', account: 'YOUR_TRC20_ADDRESS', accountName: 'USDT', type: 'TRC20 Address', note: '', logoUrl: '', qrCodeUrl: '', category: 'crypto', enabled: true },
    'bybit': { name: 'Bybit', account: 'YOUR_BYBIT_UID', accountName: 'USDT', type: 'TRC20 Address', note: '', logoUrl: '', qrCodeUrl: '', category: 'crypto', enabled: true },
};


const PaymentMethodEditor: React.FC<{ methodData: PaymentMethodDetails }> = ({ methodData }) => {
    const [method, setMethod] = useState<PaymentMethodDetails>(methodData);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        setMethod(methodData);
    }, [methodData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setMethod(prev => ({ ...prev, [name]: checked }));
        } else {
            setMethod(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const { id, ...dataToSave } = method;
            const methodRef = ref(database, `paymentMethods/${id}`);
            await update(methodRef, dataToSave);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            console.error("Save failed:", error);
            setMessage({ type: 'error', text: 'Failed to save settings.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{method.name} Settings</h3>
            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label htmlFor={`enabled-${method.id}`} className="font-medium text-gray-700">Enable Method</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="enabled" 
                            id={`enabled-${method.id}`} 
                            checked={method.enabled} 
                            onChange={handleChange}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                         <label htmlFor={`enabled-${method.id}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                </div>

                <div>
                    <label htmlFor={`accountName-${method.id}`} className="block text-sm font-medium text-gray-700">Account Name</label>
                    <input type="text" name="accountName" id={`accountName-${method.id}`} value={method.accountName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                </div>
                 <div>
                    <label htmlFor={`account-${method.id}`} className="block text-sm font-medium text-gray-700">Account Number / Address</label>
                    <input type="text" name="account" id={`account-${method.id}`} value={method.account} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                </div>
                <div>
                    <label htmlFor={`type-${method.id}`} className="block text-sm font-medium text-gray-700">Account Type</label>
                    <input type="text" name="type" id={`type-${method.id}`} value={method.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                </div>
                 <div>
                    <label htmlFor={`logoUrl-${method.id}`} className="block text-sm font-medium text-gray-700">Logo Image URL</label>
                    <input type="text" name="logoUrl" id={`logoUrl-${method.id}`} value={method.logoUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="https://example.com/logo.png"/>
                </div>
                <div>
                    <label htmlFor={`qrCodeUrl-${method.id}`} className="block text-sm font-medium text-gray-700">QR Code Image URL</label>
                    <input type="text" name="qrCodeUrl" id={`qrCodeUrl-${method.id}`} value={method.qrCodeUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="https://example.com/image.png"/>
                </div>
                <div>
                    <label htmlFor={`note-${method.id}`} className="block text-sm font-medium text-gray-700">Note for User (Optional)</label>
                    <textarea name="note" id={`note-${method.id}`} value={method.note} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="e.g., Only send money is allowed"></textarea>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <button 
                    onClick={handleSave} 
                    disabled={saving} 
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-wait"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
                {message && (
                    <div className={`flex items-center text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.type === 'success' && <CheckIcon className="w-5 h-5 mr-2" />}
                        {message.text}
                    </div>
                )}
            </div>
             <style>{`
                .toggle-checkbox:checked { right: 0; border-color: #10B981; }
                .toggle-checkbox:checked + .toggle-label { background-color: #10B981; }
            `}</style>
        </div>
    );
};

const AdminPaymentSettings: React.FC = () => {
    const [methods, setMethods] = useState<PaymentMethodDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const methodsRef = ref(database, 'paymentMethods');
        const unsubscribe = onValue(methodsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const methodsList: PaymentMethodDetails[] = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a,b) => a.category > b.category ? 1 : -1); // Group by category
                setMethods(methodsList);
            } else {
                // If no data exists in Firebase, populate it with the initial structure
                set(methodsRef, initialMethodsData).then(() => {
                    // Data will be re-fetched by onValue listener after set
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading payment settings...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {methods.map(method => (
                    <PaymentMethodEditor key={method.id} methodData={method} />
                ))}
            </div>
        </div>
    );
};

export default AdminPaymentSettings;