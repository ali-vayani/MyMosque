import {View, StyleSheet} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerTimesWidget from '../../components/widgets/PrayerTimesWidget';
import SearchWidget from '../../components/widgets/SearchWidget';
import MyMosqueWidget from '../../components/widgets/MyMosquesWidget';
import { useState, useEffect  } from 'react';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FIREBASE_APP, FIRESTORE_DB } from '../../firebaseConfig';


const Home = () => {
    const { uid } = useLocalSearchParams();
    const docRef = doc(FIRESTORE_DB, "users", uid);
    const [masjidId, setMasjidId] = useState([])
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        getMasjidId()
    }, [])
    
    const getMasjidId = async () => {
        try {
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            if (data && data.favMasjids && data.favMasjids.length > 0) {
                setMasjidId(data.favMasjids);
            } else {
                setMasjidId([]);
            }
        } catch (error) {
            console.error('Error fetching masjid IDs:', error);
            setMasjidId([]);
        }
    }
    
    return(
        <View style={styles.page}>

            <LinearGradient colors={['#67519A', '#57658E', '#679159']} style={styles.background}/>
            <View style={styles.content}>
                <PrayerTimesWidget uid={uid} favMasjids={masjidId}/>
                <SearchWidget uid={uid}/>
                {masjidId ? (
                <MyMosqueWidget masjidId={masjidId} uid={uid}/>
                ) : (
                    <></>
                )}
            </View>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        alignItems: 'center'

    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex:-2,
    },
    content: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        marginVertical: '2%',
    },
    
})