import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import { View, Text, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default MapList = ({pageLink, directions, prayerLink, marker}) => {
    const [address, setAddress] = useState(marker.vicinity || marker.formatted_address);
    const [name, setName] = useState(marker.name);


    // create function that uses address to check if masjid has a registred page
    // if masjid has registred page then return a view button else return create mosque button

    console.log(marker)
    return(
        <View className="w-[95%] my-1 h-48 bg-darkBlue flex rounded-2xl">
            <View className=" h-full flex justify-start align-start mx-2">

                <ScrollView 
                    horizontal 
                    contentContainerStyle={{ flexDirection: 'row'}}
                    showsHorizontalScrollIndicator={false}
                    className={"mt-2"}
                >
                    <View className="bg-lightBlue/50 m-1 rounded-md w-40"></View>
                    <View className="bg-lightBlue/50 m-1 rounded-md w-40"></View>
                    <View className="bg-lightBlue/50 m-1 rounded-md w-40"></View>
                    <View className="bg-lightBlue/50 m-1 rounded-md w-40"></View>
                </ScrollView>

                <Text className="text-lg text-blueText font-bold my-2">{name}</Text>

                <View className="w-full mb-3 flex flex-row gap-2">
                    <TouchableOpacity className="w-28 h-8 bg-green rounded-md flex justify-center align-center">
                        <Text className="text-sm font-bold text-blueText text-center">View Page</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="w-28 h-8 bg-blue rounded-md flex justify-center align-center" 
                        onPress={() => {
                            const address = marker.vicinity || marker.formatted_address;
                            const url = `https://www.google.com/maps/place/${encodeURIComponent(address.replace(/\s/g, '+'))}`;
                            Linking.openURL(url);
                            }}
                    >
                        <Text className="text-sm font-bold text-blueText text-center">Directions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="w-28 h-8 bg-purple rounded-md flex justify-center align-center">
                        <Text className="text-sm font-bold text-blueText text-center">Prayer Times</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
} 