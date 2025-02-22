'use client'

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIRESTORE_DB } from '../../../firebaseConfig';
import { Event, Post } from './post.types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface postProps {
    uid: string;
    name: string;
}

export default function CreatePost({uid, name}: postProps) {
    const [isEvent, setIsEvent] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({name: name});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                images: files
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const docRef = doc(FIRESTORE_DB, 'mosques', uid);
            const uniqueId = Date.now().toString();
            const imageUrls: string[] = [];

            if (formData.images) {
                const files = formData.images as File[];
                for (const file of files) {
                    const imageRef = ref(FIREBASE_STORAGE, `images/mosques/${uid}/${uniqueId}/${file.name}`);
                    await uploadBytes(imageRef, file);
                    const url = await getDownloadURL(imageRef);
                    imageUrls.push(url);
                }
            }

            if (isEvent) {
                const eventData: Event = {
                    id: uniqueId,
                    time: formData.time as string,
                    timeCreated: new Date(),
                    title: formData.title as string,
                    description: formData.description as string,
                    images: imageUrls
                };
                
                // Extract date from the event time for organizing events by date
                const eventDate = formData.time ? new Date(formData.time).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                
                // Update the events object with the new event under the corresponding date
                await updateDoc(docRef, {
                    [`events.${eventDate}`]: arrayUnion(eventData)
                });
            } else {
                const postData: Post = {
                    id: uniqueId,
                    isText: imageUrls.length > 0 ? false : true,
                    name: formData.name as string,
                    text: formData.text as string,
                    timeCreated: new Date(),
                    images: imageUrls
                };
                await updateDoc(docRef, {
                    posts: arrayUnion(postData)
                });
            }

            // Reset form
            setFormData({ images: null });
        } catch (error) {
            console.error('Error submitting:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                    Create {isEvent ? 'Event' : 'Announcement'}
                </h2>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="post-type">Event</Label>
                    <Switch
                        id="post-type"
                        checked={isEvent}
                        onCheckedChange={setIsEvent}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {isEvent ? (
                    <>
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                name="time"
                                type="datetime-local"
                                value={formData.time || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                        <Label htmlFor="images">Images (required)</Label>
                            <Input
                                id="images"
                                name="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                required
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <Label htmlFor="text">Content</Label>
                            <Textarea
                                id="text"
                                name="text"
                                value={formData.text || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="images">Images (optional)</Label>
                            <Input
                                id="images"
                                name="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </div>
                    </>
                    
                )}


                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : `Create ${isEvent ? 'Event' : 'Post'}`}
                </Button>
            </form>
        </div>
    );
}