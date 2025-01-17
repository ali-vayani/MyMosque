import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    ScrollView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SettingsModal = ({setDisplayModal, displayModal}) => {

    useEffect(() => {
        const loadSelection = async () => {
            try {
                const savedItem = await AsyncStorage.getItem('prayerTimeSettings');
                if (savedItem) {
                    setPrayerTimeSettings(JSON.parse(savedItem));
                } else {

                }
            } catch (error) {
                console.error('Failed to load selection', error);
            }
        };
        loadSelection();
    }, []);

    useEffect(() => {
        console.log('settings', prayerTimeSettings);
    }, [prayerTimeSettings])

    const [activeDropdown, setActiveDropdown] = useState(null);
    const methods = [
        { name: 'Muslim World Leauge', id: 3 },
        { name: 'Egyptian General Authority of Survey', id: 5 },
        { name: 'University of Islamic Sciences, Karachi ', id: 1 },
        { name: 'Umm Al-Qura University, Makkah', id: 4 },
        { name: 'Dubai', id: 16 },
        { name: 'Islamic Society of North America (ISNA)', id: 2 },
        { name: 'Kuwait', id: 9 },
        { name: 'Qatar', id: 10 },
        { name: 'Singapore', id: 12 },
        { name: 'Tehran', id: 7 },
        { name: 'Turkey', id: 13 }
    ]

    const school = [
        { name: 'Shafi', id: 0 },
        { name: 'Hanafi', id: 1 },
    ]
    const savedSettings = [methods, school];
    
    const saveSelection = async (item, index) => {
        try {
            //await AsyncStorage.setItem(`selectedItem-${index}`, JSON.stringify(item));
            setPrayerTimeSettings((prevSettings) =>
                prevSettings.map((setting, i) => (
                    i === index ? item : setting 
                ))
            );
        } catch (error) {
            console.error('Failed to save selection', error);
        }
    };
    

    const [selected1, setSelected1] = useState("Calculation Method");
    const [selected2, setSelected2] = useState("Madhad Asr Adjustment");
    const [prayerTimeSettings, setPrayerTimeSettings] = useState([methods[5], school[0]]);
    const closeAllDropdowns = () => {
        setActiveDropdown(null);
    };

    const Dropdown = ({ id, options, selected, setSelected, placeholder }) => {
        const isOpen = activeDropdown === id;
        return (
            <View style={[
                styles.dropdownContainer,
                { zIndex: isOpen ? 3 : 1 }
            ]}>
                <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => {
                        if (isOpen) {
                            setActiveDropdown(null);
                        } else {
                            setActiveDropdown(id);
                        }
                    }}
                >
                    <Text style={styles.dropdownButtonText}>
                        {(selected || placeholder).length > 30 
                            ? `${(selected || placeholder).substring(0, 30)}...` 
                            : selected || placeholder}
                    </Text>
                    <Ionicons 
                        name={isOpen ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#333"
                    />
                </TouchableOpacity>
                
                {isOpen && (
                    <View style={styles.dropdownList}>
                        <ScrollView>
                            {options.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        saveSelection(item, id)
                                        setActiveDropdown(null);
                                    }}
                                >
                                    <Text 
                                        style={styles.dropdownItemText}
                                        numberOfLines={1} 
                                        ellipsizeMode="tail">
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

            </View>
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={displayModal}
            onRequestClose={() => {
                setDisplayModal(false);
                closeAllDropdowns();
            }}
        >
            <Pressable 
                style={styles.modalOverlay}
                onPress={() => {
                    setDisplayModal(false);
                    closeAllDropdowns();
                }}
            >
                <Pressable 
                    style={styles.modalContent}
                    onPress={() => {}}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Settings</Text>
                        <TouchableOpacity 
                            onPress={() => {
                                setDisplayModal(false);
                                closeAllDropdowns();
                            }}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#333"/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dropdownsContainer}>
                        {prayerTimeSettings.map((settings, index) => {
                            return <Dropdown
                                key={index}
                                id={index}
                                options={savedSettings[index]}
                                selected={settings.name}
                                setSelected={(item, index) => saveSelection(item, index)}
                                placeholder={"Test"}
                            />
                        })}
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    dropdownsContainer: {
        position: 'relative',
        zIndex: 1,
    },
    dropdownContainer: {
        marginBottom: 15,
        position: 'relative',
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
        marginTop: 4,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 999,
        maxHeight: 200,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default SettingsModal;