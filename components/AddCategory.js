import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';

const saveItem = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
}

const getItem = async (key) => {
    return await SecureStore.getItemAsync(key);
}

export default class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: "",
            categoryToDelete: "",
            categories: [],
        };
    }
    addCategory = async () => {
        let categories = this.state.categories
        if(!categories.includes(this.state.category)){
            categories.push(this.state.category)
            await saveItem("categories", JSON.stringify(categories))
            this.setState({ category: "", categories: categories })
            Alert.alert("Category added successfully")
        }
        else{
            Alert.alert("Category is already added")
        }
    }
    deleteCategory = async () => {
        let categories = this.state.categories
        let category = this.state.categoryToDelete
        let filteredCategories = categories.filter(cat => {
            console.log(cat)
            return cat != category
        })
        await saveItem("categories", JSON.stringify(filteredCategories))
        this.setState({categories: filteredCategories })
    }
    componentDidMount = async () => {
        let categories = await getItem("categories")
        if (categories) {
            this.setState({
                categories: JSON.parse(categories)
            })
        }
        else {
            await saveItem("categories", "[]")
        }
    }
    changeCat = (value) => {
        this.setState({ categoryToDelete: value })
    }
    render = () => {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="#696969"
                    placeholder="CATEGORY..."
                    onChangeText={(text) => {
                        this.setState({ category: text })
                    }}
                    value={this.state.category}
                />
                <TouchableOpacity style={styles.button} onPress={
                    async () => {
                        await this.addCategory()
                    }
                }>
                    <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: "#696969", fontSize: 20, fontWeight: "bold" }}>ADD</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ width: "80%", height: 200, alignItems: "center", justifyContent: "center", backgroundColor: "#aaaaaa", margin: 40, borderRadius: 10 }}>
                    <Text style={{ color: "#fff", fontSize: 20, marginBottom: 5 }}>Pick category to delete</Text>
                    <View style={{ width: "80%", height: 50 }}>
                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.categoryToDelete}
                            onValueChange={this.changeCat}>
                            {
                                this.state.categories.map((category, index) => {
                                    return <Picker.Item key={index} label={category} value={category} />
                                })
                            }

                        </Picker>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={
                        async () => {
                            await this.deleteCategory()
                        }
                    }>
                        <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
                            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>DELETE</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    input: {
        width: '80%',
        height: 50,
    },
    button: {
        width: '30%',
        height: 50,
    },
    picker: {
        flex: 1,
        backgroundColor: 'white'
    }
})