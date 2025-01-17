import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SettingsModal = ({setDisplayModal, displayModal}) => {
    const [dropdown1Open, setDropdown1Open] = useState(false);
    const [dropdown2Open, setDropdown2Open] = useState(false);
    const [dropdown3Open, setDropdown3Open] = useState(false);
    
    const [selected1, setSelected1] = useState('');
    const [selected2, setSelected2] = useState('');
    const [selected3, setSelected3] = useState('');

    const options1 = ['Option 1A', 'Option 1B', 'Option 1C'];
    const options2 = ['Option 2A', 'Option 2B', 'Option 2C'];
    const options3 = ['Option 3A', 'Option 3B', 'Option 3C'];

const Dropdown = ({ options, isOpen, setIsOpen, selected, setSelected, placeholder }) => (
    <View style={styles.dropdownContainer}>
        <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setIsOpen(!isOpen)}
        >
            <Text style={styles.dropdownButtonText}>
            {selected || placeholder}
            </Text>
            <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#333"
            />
        </TouchableOpacity>
        
        {isOpen && (
            <View style={styles.dropdownList}>
            {options.map((item, index) => (
                <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                    setSelected(item);
                    setIsOpen(false);
                }}
                >
                <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
            ))}
            </View>
        )}
        </View>
    );

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={displayModal}
                onRequestClose={() => setModalVisetDisplayModalsible(false)}
            >
            <Pressable 
            style={styles.modalOverlay}
            onPress={() => setDisplayModal(false)}
            >
            <Pressable 
                style={styles.modalContent}
                onPress={e => e.stopPropagation()}
            >
                <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Settings</Text>
                <TouchableOpacity 
                    onPress={() => setDisplayModal(false)}
                    style={styles.closeButton}
                >
                    <Ionicons name="close" size={24} color="#333"/>
                </TouchableOpacity>
                </View>

                <ScrollView style={styles.dropdownsContainer}>
                <Dropdown 
                    options={options1}
                    isOpen={dropdown1Open}
                    setIsOpen={setDropdown1Open}
                    selected={selected1}
                    setSelected={setSelected1}
                    placeholder="Select option 1"
                />
                
                <Dropdown 
                    options={options2}
                    isOpen={dropdown2Open}
                    setIsOpen={setDropdown2Open}
                    selected={selected2}
                    setSelected={setSelected2}
                    placeholder="Select option 2"
                />
                
                <Dropdown 
                    options={options3}
                    isOpen={dropdown3Open}
                    setIsOpen={setDropdown3Open}
                    selected={selected3}
                    setSelected={setSelected3}
                    placeholder="Select option 3"
                />
                </ScrollView>
            </Pressable>
            </Pressable>
        </Modal>
    </View>
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
        flexGrow: 0,
    },
    dropdownContainer: {
        marginBottom: 15,
        zIndex: 1,
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