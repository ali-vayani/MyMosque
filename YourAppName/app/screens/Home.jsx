import {View, StyleSheet} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerTimesWidget from '../components/widgets/PrayerTimesWidget';
import SearchWidget from '../components/widgets/SearchWidget';
import MyMosqueWidget from '../components/widgets/MyMosquesWidget';
import { useState, useEffect  } from 'react';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

const Home = ({navigation, route}) => {
    const { uid } = route.params;
    const docRef = doc(FIRESTORE_DB, "users", uid);
    const [masjidId, setMasjidId] = useState([])
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        getMasjidId()
    }, [])
    
    const getMasjidId = async () => {
        try{
            const docSnap = await getDoc(docRef);
            setMasjidId(docSnap.data()["favMasjids"]);
        } catch {
            setMasjidId(undefined);
        }
    }
    
    return(
        <View style={styles.page}>

            <LinearGradient colors={['#67519A', '#57658E', '#679159']} style={styles.background}/>
            <View style={styles.content}>
                <PrayerTimesWidget navigation={navigation} uid={uid}/>
                <SearchWidget navigation={navigation} uid={uid}/>
                {masjidId && masjidId.length > 0 ? (
                <MyMosqueWidget navigation={navigation} masjidId={masjidId} uid={uid}/>
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