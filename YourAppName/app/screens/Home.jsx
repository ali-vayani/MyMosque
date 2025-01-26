import {View, StyleSheet} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerTimesWidget from '../components/widgets/PrayerTimesWidget';
import SearchWidget from '../components/widgets/SearchWidget';
import MyMosqueWidget from '../components/widgets/MyMosquesWidget';
import { useState, useEffect  } from 'react';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import axios from 'axios';

const Home = ({navigation, route}) => {
    const { uid } = route.params;
    console.log(uid);
    //const docRef = doc(FIRESTORE_DB, "users", uid);
    const [masjidId, setMasjidId] = useState([])
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        getMasjidId()
    }, [])
    
    const getMasjidId = async () => {
        const options = {
            method: 'GET',
            url: 'http://localhost:3000/user/getUser',
            params: {userId: uid},
            headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.3.2'}
        };
        
        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
    
    return(
        <View style={styles.page}>

            <LinearGradient colors={['#67519A', '#57658E', '#679159']} style={styles.background}/>
            {/* <View style={styles.content}>
                <PrayerTimesWidget navigation={navigation} uid={uid} favMasjids={masjidId}/>
                <SearchWidget navigation={navigation} uid={uid}/>
                {masjidId ? (
                <MyMosqueWidget navigation={navigation} masjidId={masjidId} uid={uid}/>
                ) : (
                    <></>
                )}
            </View> */}
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