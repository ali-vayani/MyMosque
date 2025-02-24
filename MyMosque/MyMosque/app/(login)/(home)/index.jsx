import {View, StyleSheet, Text} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerTimesWidget from '../../../components/widgets/PrayerTimesWidget';
import SearchWidget from '../../../components/widgets/SearchWidget';
import MyMosqueWidget from '../../../components/widgets/MyMosquesWidget';
import { useState, useEffect  } from 'react';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FIREBASE_APP, FIRESTORE_DB } from '../../../firebaseConfig';
import getLocalPrayerTimes from '../../../functions/getLocalPrayerTimes';
import getUserLocation from '../../../functions/getUserLocation';
import getLocalMosques from '../../../functions/getLocalMosques';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch';
let now = new Date();
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    now = Date.now();
    const currentDate = new Date(now);
    console.log(`Got background fetch call at date: ${currentDate.toISOString()}`);
    
    // Update the last fetch time in the app
    if (global.setLastFetchTime) {
        global.setLastFetchTime(currentDate.toLocaleTimeString());
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
});

const Home = () => {
    const { uid } = useLocalSearchParams();
    const [locationData, setLocationDate] = useState();
    const [locMosques, setLocMosques] = useState();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const docRef = uid ? doc(FIRESTORE_DB, "users", uid) : null;
    const [masjidId, setMasjidId] = useState(["OnfodEG98Qaa3GIYKNxW"])

    async function registerBackgroundFetchAsync() {
        return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 10,
            stopOnTerminate: false, // android only,
            startOnBoot: true, // android only
        });
    }

    useEffect(() => {
        const initializeApp = async () => {
            await getAppData();
            await registerBackgroundFetchAsync();
            
            // Make setLastFetchTime available globally for the background task
            global.setLastFetchTime = setLastFetchTime;

            // Update current time every second
            const timer = setInterval(() => {
                setCurrentTime(new Date().toLocaleTimeString());
            }, 1000);

            return () => {
                clearInterval(timer);
                global.setLastFetchTime = null;
            };
        };
        initializeApp();
    }, []);
    
    // gets info for app to run
    const getAppData = async () => {
        const userLoc = await getUserLocation();
        const locData = await getLocalPrayerTimes(userLoc, uid);
        setLocMosques(await getLocalMosques(userLoc.latitude, userLoc.longitude));
        setLocationDate(locData);
        if(docRef && uid) {
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            if (data && data.favMasjids && data.favMasjids.length > 0) {
                setMasjidId(data.favMasjids);
            } else {
                setMasjidId(["OnfodEG98Qaa3GIYKNxW"]);
            }
        } else {
            setMasjidId(["OnfodEG98Qaa3GIYKNxW"]);
        }
    }
    
    return(
        <View style={styles.page}>
            <LinearGradient colors={['#67519A', '#57658E', '#679159']} style={styles.background}/>
            <View style={styles.content}>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>Current Time: {currentTime}</Text>
                    {lastFetchTime && (
                        <Text style={styles.fetchText}>Last Background Fetch: {lastFetchTime}</Text>
                    )}
                </View>
                {locationData && <PrayerTimesWidget uid={uid} favMasjids={masjidId} locationData={locationData}/>}
                {locMosques && <SearchWidget uid={uid} locMosques={locMosques}/>}
                {masjidId && locationData ? (
                <MyMosqueWidget masjidId={masjidId} uid={uid} fullscreen={false} locData={locationData}/>
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
    timeContainer: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        zIndex: 100,
    },
    timeText: {
        color: '#F2EFFB',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fetchText: {
        color: '#F2EFFB',
        fontSize: 14,
        marginTop: 4,
    }
})