import { doc, getDoc } from "firebase/firestore";
import { Post, FirestoreTimeStamp, MosqueInfo } from "../post.types";
import { FIRESTORE_DB } from "../../../../firebaseConfig";
import { start } from "repl";

export async function getMosqueInfo(masjidId: string) {
    const docRef = doc(FIRESTORE_DB, "mosques", masjidId);
    if(docRef) {
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            const data = docSnap.data();
            return data as MosqueInfo;
        }
    }
}

export function convertTimes(startDate: FirestoreTimeStamp, endDate: FirestoreTimeStamp) {
    if(startDate && endDate) {
        const start = new Date(startDate.seconds * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }); 
        const end = new Date(endDate.seconds * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
        return `${start} - ${end}`;
    }

    return "No Date Found";
}