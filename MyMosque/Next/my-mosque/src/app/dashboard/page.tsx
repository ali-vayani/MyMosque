'use client'

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from 'react';
import { FaRegCalendarAlt, FaChartBar, FaUser, FaPlusCircle, FaPencilAlt } from 'react-icons/fa';
import { MosqueInfo, PrayerTimes } from "./post.types";
import { getMosqueInfo, convertTimes } from "./hooks/getMosqueInfo";

export default function Dashboard() {
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    const [masjidInfo, setMasjidInfo] = useState<MosqueInfo | null>(null);
    const [activeTab, setActiveTab] = useState('Home');
    const [trailingDots, setTrailingDots] = useState("...");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const prayerKey: (keyof Omit<PrayerTimes, 'startDate' | 'endDate'>)[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

    useEffect(() => {
        const getInfo = async (uid: string) => {
            const mosqueInfo = await getMosqueInfo(uid);
            if(mosqueInfo)
                setMasjidInfo(mosqueInfo);
        }
        if(uid) {
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
    })

    const renderContent = () => {
        return (
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
                <div className="bg-white rounded-lg shadow p-4 relative">
                    <div className="flex justify-between flex-row-reverse items-center">
                        <button className="text-gray-600 hover:text-gray-800">
                            <FaPencilAlt className="w-4 h-4" />
                        </button>
                        
                        {masjidInfo && masjidInfo.name ? <h2 className="text-2xl font-bold mb-4">{masjidInfo.name}</h2> : <h2 className="text-2xl font-bold mb-4"></h2>}
                    </div>
                    {masjidInfo ? (
                        <div className="space-y-4">
                            <div className="bg-lightGold/10 p-4 rounded-lg">
                                <p className="text-gray-600 text-sm mt-1">
                                    {masjidInfo.bio.split("<br>").map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">{masjidInfo.address}</p>
                                <p className="text-gray-600 text-sm mt-1">Members: {masjidInfo.members}</p>
                            </div>
                            {masjidInfo.prayerTimes && masjidInfo.prayerTimes[0] && (
                                <div className="bg-lightGold/10 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">Prayer Times {convertTimes(masjidInfo.prayerTimes[0].startDate, masjidInfo.prayerTimes[0].endDate)}</h3>
                                    <div className="space-y-2">
                                        {prayerKey.map((key, index) => (
                                            <p key={index} className="text-sm">
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

                {/* Top Right - Posts and Events */}
                <div className="bg-white rounded-lg shadow p-4 overflow-auto">
                    <h2 className="text-2xl font-bold mb-4">Dev Updates</h2>
                    <div className="space-y-4">
                        <div className="border-l-4 border-lightGold p-4 bg-lightGold/10">
                            <h3 className="font-semibold">Community Iftar</h3>
                            <p className="text-sm text-gray-600">Join us this Saturday for community iftar...</p>
                        </div>
                        <div className="border-l-4 border-lightGold p-4 bg-lightGold/10">
                            <h3 className="font-semibold">Quran Study Circle</h3>
                            <p className="text-sm text-gray-600">Weekly study circle every Sunday after Maghrib...</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Left - Calendar */}
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Calendar</h2>
                        <p className="text-gray-600 text-lg">
                            in the kitchen{trailingDots}
                        </p>
                    </div>
                </div>

                {/* Bottom Right - Analytics */}
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
                        // onClick={() => setActiveTab('Analytics')}
                    >
                        <FaChartBar className="text-gray-600/50 mr-3" />
                        <span className="text-gray-800/50">Analytics</span>
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