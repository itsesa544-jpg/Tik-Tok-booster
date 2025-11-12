import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Category, Service } from '../types';
import { ChevronDownIcon } from './IconComponents';

const ServicesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const categoriesRef = ref(database, 'categories');
        const servicesRef = ref(database, 'services');

        const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            const catList: Category[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setCategories(catList);
            // Open the first category by default if it's not already set
            if (catList.length > 0 && openCategory === null) {
                setOpenCategory(catList[0].id);
            }
        });

        const unsubscribeServices = onValue(servicesRef, (snapshot) => {
            const data = snapshot.val();
            const serviceList: Service[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setServices(serviceList.filter(s => s.enabled)); // Only show enabled services
            setLoading(false);
        });

        return () => {
            unsubscribeCategories();
            unsubscribeServices();
        };
    }, [openCategory]);

    const toggleCategory = (categoryId: string) => {
        setOpenCategory(openCategory === categoryId ? null : categoryId);
    };

    const filteredServices = services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceId.toString().includes(searchTerm)
    );
    
    // Create a map of categories to services for efficient rendering
    const servicesByCategory: { [key: string]: Service[] } = filteredServices.reduce((acc, service) => {
        const categoryName = service.category;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(service);
        return acc;
    }, {} as { [key: string]: Service[] });


    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="animate-pulse">Loading services...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Services</h2>
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search for a service by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                     <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                <div className="space-y-2">
                    {categories.map(category => {
                        const categoryServices = servicesByCategory[category.name] || [];
                        
                        // Hide category if search term exists and no services in this category match
                        if (searchTerm && categoryServices.length === 0) return null;
                        
                        // Hide category if it has no services (and no search is active)
                        if (!searchTerm && services.filter(s => s.category === category.name).length === 0) return null;

                        return (
                            <div key={category.id} className="border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition"
                                    aria-expanded={openCategory === category.id}
                                >
                                    <h3 className="font-semibold text-lg text-gray-700">{category.name}</h3>
                                    <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} />
                                </button>
                                {openCategory === category.id && (
                                    <div className="p-0 sm:p-2 bg-white">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 hidden sm:table-header-group">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate / 1k</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min-Max</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {categoryServices.map(service => (
                                                        <tr key={service.id} className="flex flex-col sm:table-row py-2 sm:py-0 border-b sm:border-none">
                                                            <td className="px-6 py-1 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-500"><span className="sm:hidden font-bold">ID: </span>{service.serviceId}</td>
                                                            <td className="px-6 py-1 sm:py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{service.name}</td>
                                                            <td className="px-6 py-1 sm:py-4 whitespace-nowrap text-sm text-green-700 font-bold"><span className="sm:hidden font-bold text-gray-500">Rate: </span>৳{service.rate}</td>
                                                            <td className="px-6 py-1 sm:py-4 whitespace-nowrap text-sm text-gray-500"><span className="sm:hidden font-bold">Limits: </span>{service.min} - {service.max}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                     {filteredServices.length === 0 && searchTerm && (
                        <p className="text-center text-gray-500 py-4">No services found matching your search.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
