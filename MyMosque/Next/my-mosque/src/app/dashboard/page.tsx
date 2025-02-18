'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { FaHome, FaNewspaper, FaChartBar, FaUser, FaPlusCircle } from 'react-icons/fa';
import getMosqueInfo from "./hooks/getMosqueInfo";

export default function Dashboard() {
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    const [activeTab, setActiveTab] = useState('Home');

    useEffect(() => {
        const getInfo = async (uid: string) => {
            const mosqueInfo = await getMosqueInfo(uid);
            console.log(mosqueInfo);
        }
        if(uid) {
            getInfo(uid)
        }
    })

    const renderContent = () => {
        switch(activeTab) {
            case 'Posts':
                return <div className="p-6"><h2 className="text-2xl font-bold mb-4">Posts</h2><p>Your posts will appear here</p></div>;
            case 'Create New Post':
                return <div className="p-6"><h2 className="text-2xl font-bold mb-4">Create New Post</h2><p>Create post form will appear here</p></div>;
            case 'Analytics':
                return <div className="p-6"><h2 className="text-2xl font-bold mb-4">Analytics</h2><p>Analytics data will appear here</p></div>;
            case 'Home':
                return <div className="p-6"><h2 className="text-2xl font-bold mb-4">Profile</h2><p>Profile information will appear here</p></div>;
            default:
                return <div className="p-6"><h2 className="text-2xl font-bold mb-4">Welcome</h2><p>Select an option from the sidebar</p></div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800">MyMosque</h1>
                </div>
                <nav className="mt-6">
                    <div
                        className={`flex items-center px-6 py-4 cursor-pointer ${activeTab === 'Home' ? 'bg-lightGold/20 border-r-4 border-lightGold' : 'hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('Home')}
                    >
                        <FaUser className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Home</span>
                    </div>
                    <div
                        className={`flex items-center px-6 py-4 cursor-pointer ${activeTab === 'Posts' ? 'bg-lightGold/20 border-r-4 border-lightGold' : 'hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('Posts')}
                    >
                        <FaNewspaper className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Posts</span>
                    </div>
                    <div
                        className={`flex items-center px-6 py-4 cursor-pointer ${activeTab === 'Create New Post' ? 'bg-lightGold/20 border-r-4 border-lightGold' : 'hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('Create New Post')}
                    >
                        <FaPlusCircle className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Create New Post</span>
                    </div>
                    <div
                        className={`flex items-center px-6 py-4 cursor-pointer ${activeTab === 'Analytics' ? 'bg-lightGold/20 border-r-4 border-lightGold' : 'hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('Analytics')}
                    >
                        <FaChartBar className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Analytics</span>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <header className="bg-white shadow">
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    </div>
                </header>
                <main className="p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}