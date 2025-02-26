'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 h-screen w-screen blur-[5px]">
        <Image
          src="/backgroundOverlay.jpg"
          alt="Mosque Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <nav className="relative z-10 flex justify-between items-center p-6">
        <h1 className="text-2xl text-text font-medium">MyMosque</h1>
        <div className="flex gap-3">
          <div className="bg-lightGold/50 px-3 py-1 rounded-sm hover:bg-lightGold/70">
            <a href="https://forms.gle/zeX8wsnF8Yr5W7n58" className="text-text">Beta</a>
          </div>
          <button 
            className="bg-white/20 px-3 py-1 rounded-sm hover:bg-white/40 text-text"
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        </div>
      </nav>
      
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">Strengthen your connection to<br />your community</h2>
          <p className="text-xl text-text mb-8">Community updates, share prayer times, and strengthen bonds.<br />All in one app.</p>
          <div className="flex justify-center">
            <button className="bg-lightGold/50 px-8 py-3 rounded-full text-text hover:bg-lightGold/70 transition-colors">
              <a href="https://forms.gle/zeX8wsnF8Yr5W7n58">Join our beta</a>
            </button>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl w-[850px] mt-16">
          <div className="relative h-[500px] w-full">
            <Image
              src="/prayer_mockup.png"
              alt="Prayer Times Feature"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative h-[500px] w-full">
            <Image
              src="/map_mockup.png"
              alt="Mosque Map Feature"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative h-[500px] w-full">
            <Image
              src="/mosquePage_mockup.png"
              alt="Mosque Page Feature"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
