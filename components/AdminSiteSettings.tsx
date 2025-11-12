import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import { SiteSettings } from '../types';
import { CheckIcon } from './IconComponents';

const AdminSiteSettings: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings>({
        whatsappNumber: '',
        telegramUsername: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const settingsRef = ref(database, 'settings/siteInfo');
        const unsubscribe = onValue(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
                setSettings(snapshot.val());
            } else {
                // Set default values if none exist in DB
                setSettings({
                    whatsappNumber: '01792157184',
                    telegramUsername: '@YourSupportContact'
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const settingsRef = ref(database, 'settings/siteInfo');
            await set(settingsRef, settings);
            setMessage('Settings saved successfully!');
        } catch (error) {
            console.error("Save failed:", error);
            setMessage('Failed to save settings.');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading settings...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Site Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                        <input
                            type="text"
                            name="whatsappNumber"
                            id="whatsappNumber"
                            value={settings.whatsappNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., 01700000000"
                        />
                    </div>
                    <div>
                        <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700">Telegram Username</label>
                        <input
                            type="text"
                            name="telegramUsername"
                            id="telegramUsername"
                            value={settings.telegramUsername}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., @your_username"
                        />
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
                        <div className="flex items-center text-sm text-green-600">
                            <CheckIcon className="w-5 h-5 mr-2" />
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSiteSettings;
