import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';


const saveItem = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
}

const getItem = async (key) => {
    return await SecureStore.getItemAsync(key);
}

const deleteItem = async (key) => {
    await SecureStore.deleteItemAsync(key);
}

export default class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keys: []
        };
    }
    handleLongPress = async () => {
        Alert.alert(
            "Delete?",
            "Are you sure you want to delete?",
            [
                {
                    text: "CANCEL",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        this.setState({
                            keys: JSON.parse(await getItem("allNotes"))
                        })
                        await deleteItem(this.props.id)

                        let keys = this.state.keys
                        keys = keys.filter(key => {
                            return key != this.props.id
                        })
                        await saveItem("allNotes", JSON.stringify(keys))
                        await this.props.refresh()
                        this.props.filter('')

                    }
                },
            ]
        );
    }
    render = () => {
        let d = new Date(this.props.date)
        let months = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sier", "Wrze", "Paź", "List", "Gru"]
        let dStr = d.getDate() + " " + months[d.getMonth()]
        return (
            <View style={
                {
                    width: "50%",
                    padding: 10
                }
            }>
                <TouchableOpacity style={{
                    flex: 1
                }}
                    onLongPress={this.handleLongPress}
                    onPress={()=>{
                        this.props.navigate('Edit Note', {title: this.props.title, content: this.props.content, category: this.props.category, color: this.props.color, date: this.props.date, key: this.props.id})
                    }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: this.props.color,
                        borderRadius: 15,
                        paddingTop: 15,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingBottom: 30
                    }}>
                        <View style={{
                            width: '100%',
                            flexDirection: "row",
                            marginBottom: 10
                        }}>
                            <View style={{
                                borderRadius: 5,
                                backgroundColor: "#696969",
                                padding: 5,
                                height: 40
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: this.props.fontSize,
                                    color: this.props.color
                                }}>{this.props.category}</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                paddingTop: 5
                            }}>
                                <Text style={{
                                    textAlign: 'right',
                                    fontSize: 16
                                }}>{dStr}</Text>
                            </View>
                        </View>
                        <Text style={{
                            fontSize: this.props.fontSize + 4,
                            fontWeight: "bold"
                        }}>{this.props.title}</Text>
                        <Text style={{
                            fontSize: this.props.fontSize,
                        }}>{this.props.content}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
