import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgroundOverlay.jpg"
          alt="Mosque Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0"/>
      </div>
      
      <nav className="relative z-10 flex justify-between items-center p-6">
        <h1 className="text-2xl text-text font-medium">MyMosque</h1>
        <div className="flex gap-3">
          <div className="bg-lightGold/50 px-3 py-1 rounded-sm">
            <a href="#" className="text-text hover:text-gray-200">Waitlist</a>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-sm">
            <a href="#" className="text-text hover:text-gray-200">Log In</a>
          </div>
        </div>
      </nav>
      
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">Strengthen your connection to<br />the community</h2>
          <p className="text-xl text-text mb-8">Mosque locator, prayer times, and community updates.<br />All in one app</p>
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
