import {View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerBar from '../components/elements/prayerBar';
import Location from '../components/elements/location';
const PrayerTimes = ({navigation}) => {
    return(
        <View style={styles.page}>
            <LinearGradient colors={['#67519A', '#A79A84']} style={styles.background}/>
            <Image 
            source={require('../../assets/images/Random3.png')} 
            style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 41.5,
            opacity: .1,
            }}/>
            <View style={styles.content}>
                <Text style={styles.mainText }>Mhrm. 1, 1445 AH</Text>
                <PrayerBar nextPrayer={"Magrib"} timeTillNext={'14 mins 20 sec'} size={32}/>
                <View style={styles.prayerArea}>
                    <View style={styles.prayerAndTime}>
                        <Text style={styles.text}>Fajr</Text>
                        <Text style={styles.text}>5:14 AM</Text>
                    </View>
                    <View style={styles.prayerAndTime}>
                        <Text style={styles.text}>Duhur</Text>
                        <Text style={styles.text}>1:36 PM</Text>
                    </View>
                    <View style={styles.prayerAndTime}>
                        <Text style={styles.text}>Asr</Text>
                        <Text style={styles.text}>5:18 PM</Text>
                    </View>
                    <View style={styles.prayerAndTime}>
                        <Text style={styles.text}>Maghrib</Text>
                        <Text style={styles.text}>8:36 PM</Text>
                    </View>
                    <View style={styles.prayerAndTime}>
                        <Text style={styles.text}>Isha</Text>
                        <Text style={styles.text}>9:56 PM</Text>
                    </View>
                </View>
                <Location location={'Keller, TX'}/>
            </View>
        </View>
    )
}

export default PrayerTimes;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    content: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingVertical: '20%',
        flexDirection: 'column'
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF4D2',
    },
    mainText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF4D2',
        marginVertical: '15%'

    },
    prayerAndTime:{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    prayerArea: {
        width: '100%',
        gap: 12,
        paddingHorizontal: 30,
        marginTop: '15%'
    },
})