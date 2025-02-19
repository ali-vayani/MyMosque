export type Event = {
    id: number,
    time: string,
    timeCreated: Date,
    title: string,
    description: string,
    images: string[] | null,
}

export type Post = {
    isText: boolean,
    name: string,
    text: string,
    timeCreated: Date,
    images: string[] | null,
}

export type FirestoreTimeStamp = {
    seconds: number,
    nanoseconds: number,
}

export type PrayerTimes = {
    Fajr: string,
    Dhuhr: string,
    Asr: string,
    Maghrib: string,
    Isha: string,
    endDate: FirestoreTimeStamp,
    startDate: FirestoreTimeStamp
}

export type MosqueInfo = {
    address: string,
    bio: string,
    events: Event[],
    members: number,
    name: string,
    posts: Post[],
    prayerTimes: PrayerTimes[],
}

