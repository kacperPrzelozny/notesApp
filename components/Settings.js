import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';


const saveItem = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
}

const getItem = async (key) => {
    return await SecureStore.getItemAsync(key);
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontSize: 0,
            sorting: false,
        };
    }
    componentDidMount = async () => {
        let fontSize = await getItem("fontSize")
        if (fontSize) {
          this.setState({
            fontSize: fontSize
          })
        }
        else {
          await saveItem("fontSize", "1")
        }
        let sorting = await getItem("sorting")
        if (sorting) {
          this.setState({
            sorting: JSON.parse(sorting)
          })
        }
        else {
          await saveItem("sorting", "true")
        }
    }
    changeSortingWay = async (value) => {
        this.setState({
            sorting: value
        })
        await saveItem("sorting", JSON.stringify(value))
    }
    changeFontSize = async (value) => {
        this.setState({
            fontSize: value
        })
        await saveItem("fontSize", JSON.stringify(value))
    }
    render = () => {
        return (
            <View style={styles.container}>
                <View style={styles.forPicker}>
                    <View style={styles.left}>
                        <Text style={styles.text}>Sort by date: </Text>
                    </View>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.sorting}
                        onValueChange={this.changeSortingWay}>
                        <Picker.Item key={"1"} label={"from newest"} value={true} />
                        <Picker.Item key={"2"} label={"from oldest"} value={false} />
                    </Picker>
                </View>
                <View style={styles.forPicker}>
                    <View style={styles.left}>
                        <Text style={styles.text}>Font size: </Text>
                    </View>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.fontSize}
                        onValueChange={this.changeFontSize}>
                        <Picker.Item key={"1"} label={"1"} value={1} />
                        <Picker.Item key={"2"} label={"2"} value={2} />
                        <Picker.Item key={"3"} label={"3"} value={3} />
                    </Picker>
                </View>   
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#36454f",
        flex: 1,
    },
    text: {
        color: "whitesmoke",
        fontSize: 20
    },
    forPicker: {
        width: "100%",
        height: 50,
        alignItems: "center",
        flexDirection: "row"
    },
    left: {
        width: "50%",
        paddingLeft: 15
    },
    picker: {
        width: "50%",
        color: "whitesmoke",
        
    }
})

export default Settings;
