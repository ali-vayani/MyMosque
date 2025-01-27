import { useRouter, useLocalSearchParams } from "expo-router";
import MyMosqueWidget from "../../../components/widgets/MyMosquesWidget";

export default function Feed () {
    const router = useRouter();
    const { masjidId, uid } = useLocalSearchParams();
    const parsedMasjidId = JSON.parse(masjidId);
    return (
        <MyMosqueWidget masjidId={parsedMasjidId} uid={uid} fullscreen={true}/>
    )
}