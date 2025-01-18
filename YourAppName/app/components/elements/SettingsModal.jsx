import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SettingsModal = ({setDisplayModal, displayModal}) => {
    // Track which dropdown is open
    const [activeDropdown, setActiveDropdown] = useState(null);
    
    const [selected1, setSelected1] = useState('');
    const [selected2, setSelected2] = useState('');
    const [selected3, setSelected3] = useState('');

    const options1 = ['Option 1A', 'Option 1B', 'Option 1C'];
    const options2 = ['Option 2A', 'Option 2B', 'Option 2C'];
    const options3 = ['Option 3A', 'Option 3B', 'Option 3C'];

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
                                    setActiveDropdown(null);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
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
                        <Dropdown 
                            id={1}
                            options={options1}
                            selected={selected1}
                            setSelected={setSelected1}
                            placeholder="Select option 1"
                        />
                        
                        <Dropdown 
                            id={2}
                            options={options2}
                            selected={selected2}
                            setSelected={setSelected2}
                            placeholder="Select option 2"
                        />
                        
                        <Dropdown 
                            id={3}
                            options={options3}
                            selected={selected3}
                            setSelected={setSelected3}
                            placeholder="Select option 3"
                        />
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