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

export type prayerTimes = {
    fajr: string,
    dhuhr: string,
    asr: string,
    maghrib: string,
    isha: string,
    endDate: Date,
    startDate: Date
}

export type MosqueInfo = {
    address: string,
    bio: string,
    events: Event[],
    members: number,
    name: string,
    posts: Post[],
    prayerTimes: prayerTimes[],
}
