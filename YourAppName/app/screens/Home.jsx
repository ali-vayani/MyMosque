import {View, StyleSheet} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerTimesWidget from '../components/widgets/PrayerTimesWidget';
import SearchWidget from '../components/widgets/SearchWidget';
import MyMosqueWidget from '../components/widgets/MyMosquesWidget';
import { useState, useEffect  } from 'react';
import axios from "axios";

const Home = ({navigation, route}) => {
    const { uid } = route.params;
    const [masjidId, setMasjidId] = useState([])

    useEffect(() => {
        getMasjidId()
    }, [])
    
    const getMasjidId = () =>{
        const options = {
            method: 'GET',
            url: 'http://192.168.1.77:3000/user/getUser',
            params: {userId: uid},
            headers: {'Content-Type': 'application/json'}
        };
        
        axios.request(options).then(function (response) {
                console.log(response.data.mosquesFollowed);
                setMasjidId(response.data.mosquesFollowed);
            }).catch(function (error) {
                console.error(error);
        });

    }


    
    return(
        <View style={styles.page}>

            <LinearGradient colors={['#67519A', '#57658E', '#679159']} style={styles.background}/>
            <View style={styles.content}>
                <PrayerTimesWidget navigation={navigation} uid={uid}/>
                <SearchWidget navigation={navigation} uid={uid}/>
                <MyMosqueWidget navigation={navigation} masjidId={masjidId} uid={uid}/>
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