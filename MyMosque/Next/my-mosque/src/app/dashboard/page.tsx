'use client'

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef, Suspense } from 'react';
import { FaRegCalendarAlt, FaChartBar, FaUser, FaPlusCircle } from 'react-icons/fa';
import { MosqueInfo, PrayerTimes } from "./post.types";
import { getMosqueInfo } from "./hooks/getMosqueInfo";
import Modal from "./Modal";
import CreatePost from "./CreatePost";

function DashboardContent() {
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    const [masjidInfo, setMasjidInfo] = useState<MosqueInfo | null>(null);
    const [activeTab, setActiveTab] = useState('Home');
    const [trailingDots, setTrailingDots] = useState("...");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const prayerKey: (keyof Omit<PrayerTimes, 'startDate' | 'endDate'>)[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]
    const [hideModal, setHideModal] = useState(true);

    useEffect(() => {
        const getInfo = async (uid: string) => {
            const mosqueInfo = await getMosqueInfo(uid);
            if(mosqueInfo)
                setMasjidInfo(mosqueInfo);
        }
        if(uid && localStorage.getItem("authenticated") == "true") {
            getInfo(uid)
        }

        intervalRef.current = setInterval(() => {
            setTrailingDots((prevDots) => {
                if (prevDots === "...") {
                    return "";
                } else {
                    return prevDots +".";
                }
            });
        }, 500);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [uid])

    const renderContent = () => {
        if(activeTab === "Home")
            return (
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
                    <div className="bg-white rounded-lg shadow p-4 relative">
                        <div className="flex justify-between flex-row-reverse items-center">
                            <button 
                                className="text-gray-600 hover:text-gray-800"
                                onClick={() => setHideModal(!hideModal)}
                            >
                                {masjidInfo && uid && <Modal mosqueInfo={masjidInfo} uid={uid}/>}
                            </button>
                            {masjidInfo && masjidInfo.name ? <h2 className="text-2xl font-bold mb-4">{masjidInfo.name}</h2> : <h2 className="text-2xl font-bold mb-4"></h2>}
                        </div>
                        {masjidInfo ? (
                            <div className="space-x-1 flex flex-row">
                                <div className="rounded-lg flex flex-col gap-1 justify-start w-2/3">
                                    <div className="bg-lightGold/10 p-2 rounded-lg flex items-center flex-1">
                                        <p className="text-gray-600 text-sm">
                                            <span className="text-black font-bold">Bio - </span>
                                            {masjidInfo.bio.split("<br>").map((line, index) => (
                                                <React.Fragment key={index}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </p>
                                    </div>
                                    <div className="bg-lightGold/10 p-2 rounded-lg flex items-center flex-1">
                                        <p className="text-gray-600 text-sm"><span className="text-black font-bold">Address -</span> {masjidInfo.address}</p>
                                    </div>
                                    <div className="bg-lightGold/10 p-2 rounded-lg flex flex-1 items-center">
                                        <p className="text-gray-600 text-sm"><span className="text-black font-bold">Members -</span> {masjidInfo.members}</p>
                                    </div>
                                </div>
                                {masjidInfo.prayerTimes && masjidInfo.prayerTimes[0] && (
                                    <div className="bg-lightGold/10 p-4 rounded-lg flex-1">
                                        <h3 className="font-semibold mb-2">Prayer Times</h3>
                                        <div className="space-y-2">
                                            {prayerKey.map((key, index) => (
                                                <p key={index} className="text-sm text-gray-600">
                                                    {key}: {masjidInfo.prayerTimes[0][key]}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Loading mosque information...</p>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 overflow-auto">
                        <h2 className="text-2xl font-bold mb-4">Dev Updates</h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-lightGold p-4 bg-lightGold/10">
                                <h3 className="font-semibold">1.1 soon</h3>
                                <p className="text-sm text-gray-600">1.1 Is almost on its way. It&apos;ll contain bug fixes, a new admin portal, and more.</p>
                            </div>
                            <div className="border-l-4 border-lightGold p-4 bg-lightGold/10">
                                <h3 className="font-semibold">1.0 Launch</h3>
                                <p className="text-sm text-gray-600">We just launched our first version of MyMosque. Stay tuned for more.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Calendar</h2>
                            <p className="text-gray-600 text-lg">
                                in the kitchen{trailingDots}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Analytics</h2>
                            <p className="text-gray-600 text-lg">
                            in the kitchen{trailingDots}
                            </p>
                        </div>
                    </div>
                </div>
            );
        else 
            return (
                <div>
                    {uid && masjidInfo && <CreatePost uid={uid} name={masjidInfo.name}/>}
                </div>
            )
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="hidden lg:block w-64 bg-white shadow-lg flex-shrink-0">
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
                        <FaPlusCircle className="text-gray-600 mr-3" />
                        <span className="text-gray-800">Posts and Events</span>
                    </div>
                    <div
                        className={`flex items-center px-6 py-4 cursor-pointer ${activeTab === 'Calander' ? 'bg-lightGold/20 border-r-4 border-lightGold' : 'hover:cursor-default'}`}
                        onClick={() => setActiveTab('Create New Post')}
                    >
                        <FaRegCalendarAlt className="text-gray-600/50 mr-3" />
                        <span className="text-gray-800/50">Calendar</span>
                    </div>
                    <div
                        className={`flex items-center px-6 py-4 cursor-pointer ${activeTab === 'Analytics' ? 'bg-lightGold/20 border-r-4 border-lightGold' : 'hover:cursor-default'}`}
                    >
                        <FaChartBar className="text-gray-600/50 mr-3" />
                        <span className="text-gray-800/50">Analytics</span>
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col min-h-screen">
                <div className="lg:hidden flex items-center justify-center h-screen bg-white">
                    <p className="text-xl text-gray-600 text-center px-4">Please view on larger screen</p>
                </div>
                <div className="hidden lg:flex flex-col flex-1">
                    <header className="bg-white shadow flex-shrink-0">
                        <div className="px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                        </div>
                    </header>
                    <main className="p-6 flex-grow">
                        {renderContent()}
                    </main>
                    <footer className="bg-white shadow flex-shrink-0">
                        <div className="px-6 py-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} MyMosque. All rights reserved.</p>
                            <a href="mailto:contact@mymosque.app" className="text-sm text-gray-600 hover:text-gray-800">contact@mymosque.app</a>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}