import React, { useState, useEffect } from 'react';
import { Service, Category, Order } from '../types';
import { ChevronDownIcon } from './IconComponents';
import { auth, database } from '../firebase';
import { ref, set, push, runTransaction, onValue } from 'firebase/database';

// SMM Provider API configuration
const SMM_API_URL = 'https://www.smmservices24.com/api/v2';
const SMM_API_KEY = '';

const NewOrderForm: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [servicesForCategory, setServicesForCategory] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [charge, setCharge] = useState(0.00);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    const categoriesRef = ref(database, 'categories');
    const servicesRef = ref(database, 'services');

    const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const catList: Category[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setCategories(catList);
        if (catList.length > 0) {
          setSelectedCategory(current => current || catList[0].name);
        }
      } else {
        setCategories([]);
      }
    });

    const unsubscribeServices = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const serviceList: Service[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setServices(serviceList.filter(s => s.enabled)); // Only use enabled services
      } else {
        setServices([]);
      }
      setLoadingData(false);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeServices();
    };
  }, []);
  

  useEffect(() => {
    const filteredServices = services.filter(s => s.category === selectedCategory);
    setServicesForCategory(filteredServices);
    setSelectedService(null);
    setQuantity(0);
    setCharge(0);
  }, [selectedCategory, services]);

  useEffect(() => {
    if (selectedService) {
        const initialQuantity = selectedService.min;
        setQuantity(initialQuantity);
        const newCharge = (selectedService.rate / 1000) * initialQuantity;
        setCharge(newCharge);
    }
  }, [selectedService]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value);
    setIsCategoryModalOpen(false);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = servicesForCategory.find(s => s.id === e.target.value) || null;
    setSelectedService(service);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10) || 0;
    setQuantity(newQuantity);
    if (selectedService) {
        const newCharge = (selectedService.rate / 1000) * newQuantity;
        setCharge(newCharge);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedService || !link || !quantity) {
      setError('Please fill all the required fields.');
      return;
    }
    if (quantity < selectedService.min || quantity > selectedService.max) {
      setError(`Quantity must be between ${selectedService.min} and ${selectedService.max}.`);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to place an order.');
      return;
    }
    
    setSubmitting(true);
    const userRef = ref(database, `users/${user.uid}`);
    let chargeDeducted = false;

    try {
      // Step 1: Deduct balance from user's account
      const transactionResult = await runTransaction(userRef, (userData) => {
        if (userData) {
          if ((userData.balance || 0) >= charge) {
            userData.balance -= charge;
          } else {
            return; // Abort transaction if balance is insufficient
          }
        }
        return userData;
      });

      if (!transactionResult.committed) {
        setError('Your balance is too low to place this order.');
        setSubmitting(false);
        return;
      }
      chargeDeducted = true;

      // Step 2: Place order with SMM provider
      const apiParams = new URLSearchParams({
        key: SMM_API_KEY,
        action: 'add',
        service: selectedService.serviceId.toString(),
        link,
        quantity: quantity.toString(),
      });
      
      const response = await fetch(SMM_API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: apiParams.toString(),
      });

      const apiResult = await response.json();

      if (apiResult.error) {
        throw new Error(`Provider error: ${apiResult.error}`);
      }

      if (!apiResult.order) {
        throw new Error('SMM provider returned an invalid response.');
      }

      // Step 3: API call successful, save order to our database
      const ordersRef = ref(database, 'orders');
      const newOrderRef = push(ordersRef);
      const displayId = Math.floor(100000 + Math.random() * 900000).toString();
      const newOrder: Omit<Order, 'id'> = {
        displayId,
        uid: user.uid,
        userEmail: user.email || 'N/A',
        serviceId: selectedService.serviceId,
        serviceName: selectedService.name,
        link,
        quantity,
        charge,
        createdAt: new Date().toISOString(),
        status: 'Pending',
        providerOrderId: apiResult.order, // Save provider order ID
      };
      await set(newOrderRef, newOrder);

      setSuccess(`অর্ডার সফল হয়েছে! আপনার অর্ডার আইডি: ${displayId}`);
      // Reset form
      if (categories.length > 0) {
        setSelectedCategory(categories[0].name);
      }
      setLink('');

    } catch (err: any) {
      console.error("Order submission failed: ", err);
      let userErrorMessage = 'একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'; // An unknown error occurred. Please try again.
    
      if (err.message) {
          if (err.message.includes('Provider error:')) {
              const providerError = err.message.replace('Provider error:', '').trim();
              userErrorMessage = `সার্ভিস প্রোভাইডারের কাছ থেকে একটি ত্রুটি এসেছে: "${providerError}"। অনুগ্রহ করে আপনার লিঙ্কটি পরীক্ষা করুন অথবা অন্য একটি সার্ভিস চেষ্টা করুন।`;
          } else if (err.message.toLowerCase().includes('failed to fetch')) {
              userErrorMessage = 'সার্ভিস প্রোভাইডারের সাথে সংযোগ স্থাপন করা সম্ভব হচ্ছে না। আপনার ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।';
          }
      }

      // If charge was deducted but something failed afterwards, refund the user
      if (chargeDeducted) {
        await runTransaction(userRef, (userData) => {
          if (userData) {
            userData.balance = (userData.balance || 0) + charge;
          }
          return userData;
        });
        userErrorMessage += ' আপনার অ্যাকাউন্টে টাকা ফেরত দেওয়া হয়েছে।';
      }
      setError(userErrorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
      return (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="animate-pulse">Loading services...</p>
          </div>
      );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">New Order</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full flex items-center justify-between text-left bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-3"
            aria-haspopup="listbox"
            aria-expanded={isCategoryModalOpen}
          >
            <span>{selectedCategory || 'Select a category'}</span>
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {isCategoryModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={() => setIsCategoryModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 max-h-[70vh] overflow-y-auto">
                {categories.map(cat => (
                  <label 
                    key={cat.id} 
                    htmlFor={`cat-modal-${cat.id}`} 
                    className="flex items-center justify-between p-4 cursor-pointer transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <span className={`font-medium ${selectedCategory === cat.name ? 'text-green-700' : 'text-gray-800'}`}>{cat.name}</span>
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        id={`cat-modal-${cat.id}`}
                        name="category-modal" 
                        value={cat.name} 
                        checked={selectedCategory === cat.name}
                        onChange={handleCategoryChange}
                        className="sr-only peer"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedCategory === cat.name ? 'border-green-600' : 'border-gray-400'}`}>
                        {selectedCategory === cat.name && (
                          <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">Service</label>
          <div className="relative">
            <select id="service" value={selectedService?.id || ''} onChange={handleServiceChange} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3" disabled={!selectedCategory}>
              <option value="">Select a service</option>
              {servicesForCategory.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ৳{service.rate}/1000
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
          </div>
        </div>
        
        {selectedService && (
             <div className="p-4 bg-gray-50 rounded-lg border text-sm text-gray-600">
                <h4 className="font-semibold text-gray-800 mb-2">Service Details</h4>
                <p>{selectedService.details}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <p><span className="font-medium">Min:</span> {selectedService.min}</p>
                    <p><span className="font-medium">Max:</span> {selectedService.max}</p>
                    <p><span className="font-medium">Rate:</span> ৳{selectedService.rate}/1k</p>
                    {selectedService.refill && <span className="text-green-600 font-semibold">Refill Available</span>}
                </div>
            </div>
        )}

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">Link</label>
          <input type="text" id="link" value={link} onChange={e => setLink(e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3" placeholder="e.g., https://www.tiktok.com/@user/video/12345"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} min={selectedService?.min} max={selectedService?.max} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3" placeholder="Enter quantity" />
            </div>
            <div>
                 <label htmlFor="charge" className="block text-sm font-medium text-gray-700 mb-2">Charge</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">৳</span>
                    <input type="text" id="charge" value={charge.toFixed(4)} readOnly className="w-full bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3 pl-7 font-bold" />
                 </div>
            </div>
        </div>

        <div>
          <button type="submit" disabled={submitting || !selectedService} className="w-full px-5 py-3 text-base font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 transition-transform transform hover:scale-105 disabled:bg-green-400 disabled:cursor-not-allowed">
            {submitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrderForm;