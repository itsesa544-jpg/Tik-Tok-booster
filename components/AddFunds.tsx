import React, { useState, useEffect } from 'react';
import { BikashIcon, NagadIcon, BinanceIcon, BybitIcon, QrCodeIcon, CopyIcon, CheckIcon, PasteIcon, TelegramIcon, DollarIcon } from './IconComponents';
import { auth, database } from '../firebase';
import { ref, set, push, onValue } from 'firebase/database';
import { FundRequest, PaymentMethodDetails } from '../types';

const iconMap: { [key: string]: React.ReactNode } = {
  'bKash': <BikashIcon className="w-12 h-12" />,
  'Nagad': <NagadIcon className="w-12 h-12" />,
  'Binance': <BinanceIcon className="w-12 h-12" />,
  'Bybit': <BybitIcon className="w-12 h-12" />,
};

interface PaymentCardProps {
  method: PaymentMethodDetails;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ method }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(method.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center text-center bg-gray-50 h-full shadow-sm">
      <div className="w-16 h-16 mb-3 flex items-center justify-center">
        {method.logoUrl ? (
          <img src={method.logoUrl} alt={`${method.name} Logo`} className="object-contain max-w-full max-h-full" />
        ) : (
          iconMap[method.name] || <DollarIcon className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{method.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{method.accountName} ({method.type})</p>
      
      <div className="w-36 h-36 bg-white my-2 flex items-center justify-center border rounded-md overflow-hidden">
        {method.qrCodeUrl ? (
          <img src={method.qrCodeUrl} alt={`${method.name} QR Code`} className="object-contain w-full h-full" />
        ) : (
          <div className="text-center text-gray-400 text-xs p-2">
            QR Code not available
          </div>
        )}
      </div>
      
      <div className="relative w-full my-2">
        <input type="text" value={method.account} readOnly className="w-full bg-white border text-center rounded-md p-2 pr-10 text-sm font-mono"/>
        <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600">
          {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
      {method.note && <p className="text-xs text-red-600 mt-2">{method.note}</p>}
    </div>
  );
};

const TELEGRAM_USERNAME = '@YourSupportContact';
const TELEGRAM_LINK = `https://t.me/YourSupportContact`;

const TelegramContact: React.FC = () => {
    // This component remains the same
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(TELEGRAM_USERNAME);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center">
                    <TelegramIcon className="h-10 w-10 mr-4 text-blue-600" />
                    <div>
                        <h3 className="font-bold text-gray-800">Need Payment Support? Contact us on Telegram</h3>
                        <p className="text-gray-600 text-lg font-mono tracking-wider">{TELEGRAM_USERNAME}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                        Chat Now
                    </a>
                    <button onClick={handleCopy} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 flex items-center">
                        {copied ? ( <><CheckIcon className="h-5 w-5 mr-2 text-green-600" />Copied</> ) : ( <><CopyIcon className="h-5 w-5 mr-2" />Copy</> )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddFunds: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'local' | 'crypto'>('local');
  
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const methodsRef = ref(database, 'paymentMethods');
    const unsubscribe = onValue(methodsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const methodsList: PaymentMethodDetails[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        const enabledMethods = methodsList.filter(m => m.enabled);
        setPaymentMethods(enabledMethods);
        if (enabledMethods.length > 0) {
            // Set default selected method for the form
            setSelectedMethod(enabledMethods[0].name);
        }
      } else {
        setPaymentMethods([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if(!amount || !transactionId || !selectedMethod) {
      setError('Please fill out all fields.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to add funds.');
      return;
    }

    setSubmitting(true);
    try {
      const fundRequestsRef = ref(database, 'fundRequests');
      const newRequestRef = push(fundRequestsRef);

      const newFundRequest: Omit<FundRequest, 'id'> = {
        uid: user.uid,
        userEmail: user.email || 'N/A',
        date: new Date().toISOString(),
        amount: parsedAmount,
        currency: paymentMethods.find(m => m.name === selectedMethod)?.category === 'local' ? 'BDT' : 'USD',
        method: selectedMethod,
        transactionId: transactionId.trim(),
        status: 'Pending',
      };

      await set(newRequestRef, newFundRequest);

      setSuccess('Your payment request has been submitted successfully. It will be reviewed by an admin shortly.');
      setAmount('');
      setTransactionId('');

    } catch (err) {
      console.error("Fund request submission failed: ", err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const localMethods = paymentMethods.filter(m => m.category === 'local');
  const cryptoMethods = paymentMethods.filter(m => m.category === 'crypto');

  const renderPaymentMethods = (methods: PaymentMethodDetails[]) => {
    if (methods.length === 0) {
      return <p className="text-center text-gray-500 col-span-1 md:col-span-2">No payment methods available in this category.</p>
    }
    return methods.map(method => <PaymentCard key={method.id} method={method} />);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Methods</h2>
        <p className="text-gray-600 mb-6">Send money to any of the following accounts and submit the transaction details below.</p>
        
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('local')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'local' ? 'border-b-2 border-green-600 text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              দেশি পেমেন্ট (BDT)
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'crypto' ? 'border-b-2 border-green-600 text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ক্রিপ্টো পেমেন্ট (USDT)
            </button>
          </div>
        </div>

        {loading ? (
            <div className="text-center py-8">Loading payment methods...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTab === 'local' ? renderPaymentMethods(localMethods) : renderPaymentMethods(cryptoMethods)}
            </div>
        )}
        
        <TelegramContact />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Payment Details</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
                id="paymentMethod"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3"
            >
                {paymentMethods.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input 
              type="number" 
              id="amount" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3" 
              placeholder="e.g., 500 BDT or 10 USDT"
              required
            />
          </div>
          <div>
            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">Transaction ID / Hash</label>
             <div className="relative">
                <input 
                  type="text" 
                  id="transactionId" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3 pr-12" 
                  placeholder="Enter the TrxID or Hash"
                  required
                />
                 <button type="button" onClick={async () => setTransactionId(await navigator.clipboard.readText())} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600">
                    <PasteIcon className="w-5 h-5"/>
                </button>
             </div>
          </div>
           <div>
            <button type="submit" disabled={submitting || paymentMethods.length === 0} className="w-full px-5 py-3 text-base font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 transition-transform transform hover:scale-105 disabled:bg-green-400 disabled:cursor-not-allowed">
                {submitting ? 'Submitting...' : 'Submit Payment'}
            </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default AddFunds;