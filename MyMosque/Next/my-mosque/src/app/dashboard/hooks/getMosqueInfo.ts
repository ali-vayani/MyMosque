import { doc, getDoc } from "firebase/firestore";
import { Post, Event, MosqueInfo } from "../post.types";
import { FIRESTORE_DB } from "../../../../firebaseConfig";

export default async function getMosqueInfo(masjidId: string) {
    const docRef = doc(FIRESTORE_DB, "mosques", masjidId);
    if(docRef) {
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            const data = docSnap.data();
            return data as MosqueInfo;
        }
    }
}