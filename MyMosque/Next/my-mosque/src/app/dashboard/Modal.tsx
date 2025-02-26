'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FaPencilAlt } from 'react-icons/fa';
import { MosqueInfo, PrayerTimes } from "./post.types";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";

interface ModalProps {
    mosqueInfo: MosqueInfo;
    uid: string;
}

export default function Modal({ mosqueInfo, uid }: ModalProps) {
    const [open, setOpen] = useState(false);
    const [bio, setBio] = useState(mosqueInfo.bio || null);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(() => {
        if (!mosqueInfo.prayerTimes) return {
            Fajr: '',
            Dhuhr: '',
            Asr: '',
            Maghrib: '',
            Isha: '',
            endDate: { seconds: 0, nanoseconds: 0 },
            startDate: { seconds: 0, nanoseconds: 0 }
        };

        const times = { ...mosqueInfo.prayerTimes[0] };
        for (const prayer of Object.keys(times)) {
            if (prayer !== 'Maghrib' && prayer !== 'endDate' && prayer !== 'startDate') {
                const time = times[prayer as keyof PrayerTimes];
                if (typeof time === 'string' && time.includes(':')) {
                    const [hours, minutes] = time.split(':').map(Number);
                    const displayHours = hours % 12 || 12;
                    times[prayer as keyof PrayerTimes] = `${displayHours}:${minutes.toString().padStart(2, '0')}` as any;
                }
            }
        }
        return times;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [invalidPrayers, setInvalidPrayers] = useState<Set<string>>(new Set());

    const prayerKey: (keyof Omit<PrayerTimes, 'startDate' | 'endDate'>)[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

    const validatePrayerTime = (prayer: string, time: string): boolean => {
        if (prayer === "Maghrib") {
            return time.startsWith('+') && !isNaN(parseInt(time.substring(1)));
        }
        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timePattern.test(time);
    };

    const handlePrayerTimeChange = (key: keyof Omit<PrayerTimes, 'startDate' | 'endDate'>, value: string) => {
        const cleanValue = value.replace(/(\s*[ap]m\s*)/i, '').trim();
        setPrayerTimes(prev => ({
            ...prev,
            [key]: cleanValue as PrayerTimes[typeof key]
        }));

        const isValid = validatePrayerTime(key, cleanValue);
        setInvalidPrayers(prev => {
            const newSet = new Set(prev);
            if (isValid) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    useEffect(() => {
        const updatedTimes: Partial<PrayerTimes> = {};
        let hasUpdates = false;

        for(const prayer in prayerTimes) {
            if(prayer !== 'endDate' && prayer !== 'startDate') {
                const time = prayerTimes[prayer as keyof PrayerTimes];
                if(typeof time === 'string') {
                    if(prayer === "Maghrib") {
                        if (!time.startsWith('+')) {
                            const minutes = parseInt(time);
                            if (!isNaN(minutes)) {
                                updatedTimes[prayer as keyof PrayerTimes] = `+${minutes}` as any;
                                hasUpdates = true;
                            }
                        }
                    } else {
                        if (!time.includes(':')) {
                            const timeValue = time.replace(/[^0-9]/g, '');
                            if (timeValue.length >= 3) {
                                const hours = timeValue.slice(0, 2);
                                const minutes = timeValue.slice(2, 4).padEnd(2, '0');
                                updatedTimes[prayer as keyof PrayerTimes] = `${hours}:${minutes}` as any;
                                hasUpdates = true;
                            }
                        }
                    }
                }
            }
        }

        if (hasUpdates) {
            setPrayerTimes(prev => ({
                ...prev,
                ...updatedTimes
            }));
        }
    }, [prayerTimes]);

    const handleSubmit = async () => {
        const invalidTimes = new Set<string>();
        for (const prayer of prayerKey) {
            if (!validatePrayerTime(prayer, prayerTimes[prayer])) {
                invalidTimes.add(prayer);
            }
        }

        if (invalidTimes.size > 0) {
            setInvalidPrayers(invalidTimes);
            setError('Please correct the prayer time format before submitting');
            return;
        }

        // Convert prayer times to military time before submission
        const convertedPrayerTimes = { ...prayerTimes };
        for (const prayer of prayerKey) {
            if (prayer !== 'Maghrib') {
                const time = prayerTimes[prayer];
                if (time.includes(':')) {
                    const [hours, minutes] = time.split(':').map(Number);
                    let militaryHours = hours;

                    // Convert to military time based on prayer name
                    if (prayer === 'Fajr') {
                        // Fajr is always AM
                        if (hours === 12) militaryHours = 0;
                    } else {
                        // Other prayers are PM
                        if (hours !== 12) militaryHours += 12;
                    }

                    convertedPrayerTimes[prayer] = `${militaryHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                }
            }
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const mosqueRef = doc(FIRESTORE_DB, "mosques", uid);
            await updateDoc(mosqueRef, {
                bio: bio,
                prayerTimes: [{
                    ...convertedPrayerTimes,
                    startDate: mosqueInfo.prayerTimes[0].startDate,
                    endDate: mosqueInfo.prayerTimes[0].endDate
                }]
            });
            setOpen(false); // Close the dialog after successful update
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update mosque information');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">  <FaPencilAlt/> </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] min-h-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-2 flex">
                    <div className="gap-4 py-4 flex flex-col items-right w-full">
                        <h3 className="font-semibold">General Info</h3>
                        <div className="flex gap-4 w-full">
                            <Label htmlFor="Bio" className="text-left">
                                Bio
                            </Label>
                            <Textarea 
                                value={bio ? bio : ""}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Update your bio!"
                            />
                        </div>
                        <h3 className="font-semibold">Prayer Times</h3>
                        {mosqueInfo.prayerTimes && mosqueInfo.prayerTimes[0] && (
                            <div className="rounded-lg">
                                <div className="space-y-2">
                                    {prayerKey.map((key) => (
                                        <div key={key} className="grid grid-cols-4 items-center gap-2">
                                            <Label htmlFor={key} className="text-left">
                                                {key}
                                            </Label>
                                            <Input 
                                                id={key}
                                                value={prayerTimes[key]}
                                                onChange={(e) => handlePrayerTimeChange(key, e.target.value)}
                                                className={`col-span-1 ${invalidPrayers.has(key) ? 'border-red-500 focus:ring-red-500' : ''}`}
                                            />
                                            <p className="text-sm text-gray-600">{key === "Fajr" ? "am" : "pm"}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {error && (
                            <p className="text-sm text-red-500 mt-2">{error}</p>
                        )}
                    </div>
                </div>
                
                <DialogFooter>
                    <Button 
                        type="submit" 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}