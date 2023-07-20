import {View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIRESTORE_DB } from '../../firebaseConfig'
import { addDoc, collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import Ionicons from '@expo/vector-icons/Ionicons'
import {Entypo} from '@expo/vector-icons'
import { async } from '@firebase/util'


const List = ({navigation} ) => {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState('');

    useEffect(() => {
        const todoRef = collection(FIRESTORE_DB, 'todos');

        const subscriber= onSnapshot(todoRef, {
            next: (snapshot) => {
                const todos = [];
                snapshot.docs.forEach(doc => {
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                setTodos(todos)
            },
        });
        return() => subscriber();
    }, [])

    const addTodo = async () => {
        const doc = addDoc(collection(FIRESTORE_DB, 'todos'), {title: todo, done: false})
        setTodo('')
    }


    const renderTodo = ({ item }) => {
        const ref = doc(FIRESTORE_DB, `todos/${item.id}`)

        const toggleDone =async () => {
            updateDoc(ref, {done: !item.done})
        }

        const deleteItem = async () => {
            deleteDoc(ref);
        }

        return(
            //<Text key={item.id}>{item.title}</Text>
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                    {item.done && <Ionicons name='md-checkmark-circle' color="green" size={28}/>}
                    {!item.done && <Entypo name="circle" size={24} color="black"/>}
                    <Text style={styles.todoText} key={item.id}>{item.title}</Text>
                </TouchableOpacity>
                <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem}/>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder='Add new todo' onChangeText={(text) => setTodo(text)} value={todo}/>
                <Button onPress={addTodo} title="Add Todo" disabled={todo === ''} />
            </View>
            {todos.length > 0 && (
                <View>
                    <FlatList
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(todo) => todo.id}
                    />
                </View>
            )}

        </View>
    )
}

export default List

const styles = StyleSheet.create({
    container:{
        marginHorizontal: 20,
    },
    form:{
        marginVertical: 20,
        flexDirection:'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius:4,
        padding:10,
        backgroundColor:'#f7f7f7'
    }, 
    todoContainer: {
        flexDirection: 'row',
        alignItems:'center',
        backgroundColor: '#f7f7f7',
        padding:10,
        marginVertical:4,

    },
    todoText: {
        flex: 1,
        paddingHorizontal: 10,
    },
    todo:{
        flexDirection: 'row',
        alignItems:'center',
        flex:1,
    }
})