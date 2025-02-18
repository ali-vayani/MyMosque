"use client";
import { useState } from "react";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        // TODO: Implement actual authentication logic
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = userCredential.user;
            const uid = user.uid  == 'aoma1dzfOsXcAoXKLL9sKJ4JVmz1' ? ' OnfodEG98Qaa3GIYKNxW ' : user.uid;
            console.log("Logged in user:", uid);
            router.push(`/dashboard?uid=${uid.trim()}`);
        } catch (error: any) {
            setError(error.message || "Failed to sign in");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen relative">
            <nav className="relative z-10 flex justify-between items-center p-6">
                <button 
                    className="text-2xl text-text font-medium"
                    onClick={() => router.push("/")}
                >
                    MyMosque
                </button>
            </nav>
            <div className="fixed inset-0 z-0 h-screen w-screen blur-[5px]">
                <Image
                src="/backgroundOverlay.jpg"
                alt="Mosque Background"
                fill
                className="object-cover"
                priority
                />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
                <div className="w-full max-w-md space-y-8 rounded-lg bg-white/80 p-8 backdrop-blur-sm">
                <div>
                    <h2 className="text-center text-3xl font-bold text-black">Welcome Back</h2>
                    <p className="mt-2 text-center text-sm text-black/70">
                        Sign in to your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="sr-only">
                            Email address
                            </label>
                            <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="relative block w-full rounded-md border-0 py-3 mb-2 px-4 text-black placeholder:text-black/50 focus:z-10 focus:ring-2 focus:ring-lightGold focus:outline-none bg-white/50"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="relative block w-full rounded-md border-0 py-3 px-4 text-black placeholder:text-black/50 focus:z-10 focus:ring-2 focus:ring-lightGold focus:outline-none bg-white/50"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <div>
                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md bg-lightGold/50 px-4 py-3 text-sm font-medium text-text hover:bg-lightGold/70 focus:outline-none focus:ring-2 focus:ring-lightGold focus:ring-offset-2"
                    >
                        Sign in
                    </button>
                    </div>

                    <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <a
                        href="#"
                        className="font-medium text-black/70 hover:text-black"
                        >
                        Forgot your password?
                        </a>
                    </div>
                    <div className="text-sm">
                        <a
                        href="https://forms.gle/zeX8wsnF8Yr5W7n58"
                        className="font-medium text-black/70 hover:text-black"
                        >
                        Join our beta
                        </a>
                    </div>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}