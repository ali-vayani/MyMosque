import {View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerBar from '../components/elements/prayerBar';
import Location from '../components/elements/location';
const Mosque = ({navigation}) => {
    return(
        <View style={styles.page}>
            <LinearGradient colors={['#679159', '#A79A84']} style={styles.background}/>
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
                <Image style={styles.image}>
                    <Text style={styles.mainText}>Watauga Masjid</Text>
                    <Text style={styles.minorText}>6005 Chapman Rd, Watauga, TX 76148 · 20 min drive </Text>
                </Image>
                <View style={styles.contentBlock}>
                    <Text style={styles.mainText}>Announcments</Text>
                    <View>
                        <View style={styles.userIcon}></View> 
                        <View style={styles.userInfo}>
                            <Text style={styles.minorText}>Name</Text>
                            <Text style={styles.minorMinorText}>July 20th</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.contentBlock}>
                    <Text style={styles.mainText}>Info</Text>
                    <View style={styles.info}>
                        <Text style={styles.minorText}>Website: wataugamasjid.com</Text>
                        <View style={styles.divideBar}></View>

                        <Text style={styles.minorText}>Website: wataugamasjid.com</Text>
                        <View style={styles.divideBar}></View>

                        <Text style={styles.minorText}>Website: wataugamasjid.com</Text>
                    </View>
                </View>
            </View>

        </View>
    )
}

export default Mosque;

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
        flexDirection: 'column'
    },
    minorText: {
        fontSize: 14,
        fontWeight: 500,
        color: '#FFF4D2',
    },
    mainText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF4D2',
    },
    mainText: {
        fontSize: 10,
        fontWeight: 500,
        color: '#FFF4D2',
    },
    image: {
        width: '100%',
        height: '25$',
        alignItems: 'flex-end',
        flexDirection: 'column',
        marginBottom: 25
    },
    contentBlock:{
        width: '100%',
        height: '27%',
        backgound: 'rgba(255, 244, 210, .1)',
        flexDirection: 'column',
        marginBottom: 20
    },
    userIcon: {
        background: 'rgb(255, 244, 210)',
        borderRadius: 15,
        width: 35,
        height: 35, 
    },
    userInfo: {
        flexDirection: 'column',
        width: '15%',
        height: 35,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,    
    },
    divideBar:{
        height: 3,
        wdith: '90%',
        background: 'rgb(255, 244, 210)',
        marginVertical: '7%'
    },
    info:{
        marginHorizontal: '5%',
        flexDirection: 'column',

    }
    
})