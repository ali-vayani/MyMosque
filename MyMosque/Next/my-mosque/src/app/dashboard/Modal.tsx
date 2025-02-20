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
    const [bio, setBio] = useState(mosqueInfo.bio);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(mosqueInfo.prayerTimes[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const prayerKey: (keyof Omit<PrayerTimes, 'startDate' | 'endDate'>)[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

    const handlePrayerTimeChange = (key: keyof Omit<PrayerTimes, 'startDate' | 'endDate'>, value: string) => {
        // Remove any existing am/pm suffix before processing
        const cleanValue = value.replace(/(\s*[ap]m\s*)/i, '').trim();
        setPrayerTimes(prev => ({
            ...prev,
            [key]: cleanValue
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            const mosqueRef = doc(FIRESTORE_DB, "mosques", uid);
            await updateDoc(mosqueRef, {
                bio: bio,
                prayerTimes: [{
                    ...prayerTimes,
                    startDate: mosqueInfo.prayerTimes[0].startDate,
                    endDate: mosqueInfo.prayerTimes[0].endDate
                }]
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update mosque information');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">  <FaPencilAlt/> </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] min-h-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
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
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Update your bio!"
                            />
                        </div>
                        <h3 className="font-semibold">Prayer Times</h3>
                        {mosqueInfo.prayerTimes && mosqueInfo.prayerTimes[0] && (
                            <div className="rounded-lg">
                                <div className="space-y-2">
                                    {prayerKey.map((key, index) => (
                                        <div key={key} className="grid grid-cols-4 items-center gap-2">
                                            <Label htmlFor={key} className="text-left">
                                                {key}
                                            </Label>
                                            <Input 
                                                id={key}
                                                value={prayerTimes[key].replace(/(\s*[ap]m\s*)/i, '').trim()}
                                                onChange={(e) => handlePrayerTimeChange(key, e.target.value)}
                                                className="col-span-1" 
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