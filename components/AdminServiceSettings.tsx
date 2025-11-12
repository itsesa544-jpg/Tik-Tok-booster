import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { Category, Service } from '../types';
import { CloseIcon } from './IconComponents';

type ModalMode = 'add' | 'edit';
const initialServiceState: Omit<Service, 'id'> = {
    serviceId: 0,
    name: '',
    details: '',
    rate: 0,
    min: 0,
    max: 0,
    category: '',
    refill: false,
    enabled: true,
};

const AdminServiceSettings: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryMode, setCategoryMode] = useState<ModalMode>('add');
    
    const [isServiceModalOpen, setServiceModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Service | Omit<Service, 'id'>>(initialServiceState);
    const [serviceMode, setServiceMode] = useState<ModalMode>('add');


    useEffect(() => {
        const categoriesRef = ref(database, 'categories');
        const servicesRef = ref(database, 'services');

        const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            setCategories(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
        });

        const unsubscribeServices = onValue(servicesRef, (snapshot) => {
            const data = snapshot.val();
            setServices(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
            setLoading(false);
        });

        return () => {
            unsubscribeCategories();
            unsubscribeServices();
        };
    }, []);

    // --- Category Handlers ---
    const openCategoryModal = (mode: ModalMode, category: Category | null = null) => {
        setCategoryMode(mode);
        setCurrentCategory(category);
        setCategoryName(category ? category.name : '');
        setCategoryModalOpen(true);
    };

    const handleCategorySubmit = async () => {
        if (!categoryName) return;
        if (categoryMode === 'add') {
            await set(push(ref(database, 'categories')), { name: categoryName });
        } else if (currentCategory) {
            await update(ref(database, `categories/${currentCategory.id}`), { name: categoryName });
        }
        setCategoryModalOpen(false);
    };

    const handleCategoryDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category? This will not delete the services within it.')) {
            await remove(ref(database, `categories/${id}`));
        }
    };
    
    // --- Service Handlers ---
    const openServiceModal = (mode: ModalMode, service: Service | null = null) => {
        setServiceMode(mode);
        setCurrentService(service ? service : { ...initialServiceState, category: categories[0]?.name || '' });
        setServiceModalOpen(true);
    };
    
    const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setCurrentService(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
        }));
    };
    
    const handleServiceSubmit = async () => {
        if (serviceMode === 'add') {
            await set(push(ref(database, 'services')), currentService);
        } else if ('id' in currentService) {
            const { id, ...serviceData } = currentService;
            await update(ref(database, `services/${id}`), serviceData);
        }
        setServiceModalOpen(false);
    };
    
    const handleServiceDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            await remove(ref(database, `services/${id}`));
        }
    };


    if (loading) return <div className="text-center p-8">Loading settings...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Categories Section */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Categories</h3>
                    <button onClick={() => openCategoryModal('add')} className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">Add New</button>
                </div>
                <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <span className="text-gray-700">{cat.name}</span>
                            <div className="space-x-2">
                                <button onClick={() => openCategoryModal('edit', cat)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                                <button onClick={() => handleCategoryDelete(cat.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Services Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Services</h3>
                    <button onClick={() => openServiceModal('add')} className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">Add New</button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Name</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Category</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Rate/1k</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.map(srv => (
                                <tr key={srv.id}>
                                    <td className="px-4 py-2 whitespace-nowrap">{srv.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{srv.category}</td>
                                    <td className="px-4 py-2">৳{srv.rate}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${srv.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {srv.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap space-x-2">
                                        <button onClick={() => openServiceModal('edit', srv)} className="text-blue-600 hover:text-blue-800">Edit</button>
                                        <button onClick={() => handleServiceDelete(srv.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Modal */}
            {isCategoryModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{categoryMode === 'add' ? 'Add' : 'Edit'} Category</h3>
                            <button onClick={() => setCategoryModalOpen(false)}><CloseIcon className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4">
                             <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                             <input type="text" id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="p-4 bg-gray-50 text-right">
                            <button onClick={handleCategorySubmit} className="px-4 py-2 bg-green-600 text-white rounded-md">Save</button>
                        </div>
                    </div>
                 </div>
            )}
            
            {/* Service Modal */}
            {isServiceModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-lg font-semibold">{serviceMode === 'add' ? 'Add' : 'Edit'} Service</h3>
                            <button onClick={() => setServiceModalOpen(false)}><CloseIcon className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="font-medium">Service Name</label>
                                <input name="name" value={currentService.name} onChange={handleServiceChange} className="mt-1 block w-full p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="font-medium">Provider Service ID</label>
                                <input type="number" name="serviceId" value={currentService.serviceId} onChange={handleServiceChange} className="mt-1 block w-full p-2 border rounded-md"/>
                            </div>
                             <div className="md:col-span-2">
                                <label className="font-medium">Details</label>
                                <textarea name="details" value={currentService.details} onChange={handleServiceChange} rows={3} className="mt-1 block w-full p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="font-medium">Category</label>
                                <select name="category" value={currentService.category} onChange={handleServiceChange} className="mt-1 block w-full p-2 border rounded-md">
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="font-medium">Rate per 1000</label>
                                <input type="number" name="rate" value={currentService.rate} onChange={handleServiceChange} className="mt-1 block w-full p-2 border rounded-md"/>
                            </div>
                             <div>
                                <label className="font-medium">Min Quantity</label>
                                <input type="number" name="min" value={currentService.min} onChange={handleServiceChange} className="mt-1 block w-full p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="font-medium">Max Quantity</label>
                                <input type="number" name="max" value={currentService.max} onChange={handleServiceChange} className="mt-1 block w-full p-2 border rounded-md"/>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="refill" checked={currentService.refill} onChange={handleServiceChange}/>
                                    <span>Refill</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="enabled" checked={currentService.enabled} onChange={handleServiceChange}/>
                                    <span>Enabled</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 text-right sticky bottom-0">
                            <button onClick={handleServiceSubmit} className="px-4 py-2 bg-green-600 text-white rounded-md">Save Service</button>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default AdminServiceSettings;
