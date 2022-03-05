import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import { Picker } from '@react-native-picker/picker';

const saveItem = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
}

const getItem = async (key) => {
  return await SecureStore.getItemAsync(key);
}

export default class CreateNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      category: "",
      categories: [],
      keys: [],
    };
  }
  //key do tablicy key-ów -----> "allNotes"
  //key do notatki -----> uuid
  addNote = async () => {
    let keys = await getItem("allNotes")
    if (keys) {
      keys = JSON.parse(keys)
      id = uuid.v4().toString()
      keys.push(id)
      let colors = ["#32CD32", "#DC143C", "#5FA3F9"]
      let d = new Date()
      let months = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sier", "Wrze", "Paź", "List", "Gru"]
      let dStr = d.getDate() + " " + months[d.getMonth()]
      let note = [this.state.title, this.state.content, this.state.category, colors[Math.floor(Math.random() * colors.length)], d.getTime()]
      await saveItem("allNotes", JSON.stringify(keys))
      await saveItem(id, JSON.stringify(note))
      this.setState({ content: "", title: "" })
      this.props.navigation.navigate('Notes')
    }
  }
  refresh = async () => {
    this.setState({
      categories: JSON.parse(await getItem("categories"))
    })
  }
  componentDidMount = async () => {
    let keys = await getItem("allNotes")
    if (keys) {
      this.setState({
        keys: JSON.parse(keys)
      })
    }
    else {
      await saveItem("allNotes", "[]")
    }
    this.props.navigation.addListener("focus", async () => {
      await this.refresh()
    })
    await this.refresh()
  }
  changeCat = (value) =>{
    this.setState({category:value})
  }
  render = () => {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          underlineColorAndroid="#696969"
          placeholder="TITLE..."
          onChangeText={(text) => {
            this.setState({ title: text });
          }}
          value={this.state.title}

        />
        <TextInput
          style={styles.input}
          underlineColorAndroid="#696969"
          placeholder="CONTENT..."
          onChangeText={(text) => {
            this.setState({ content: text });
          }}
          value={this.state.content}
        />
        <View style={styles.forPicker}>
          <Picker
            style={styles.picker}
            selectedValue={this.state.category}
            onValueChange={this.changeCat}>
            {
              this.state.categories.map((category,index) => {
                return <Picker.Item key={index} label={category} value={category} />
              })
            }

          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={
          async () => {
            await this.addNote()
          }
        }>
          <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
            <Text style={{ color: "#696969", fontSize: 20, fontWeight: "bold" }}>ADD</Text>
          </View>
        </TouchableOpacity>
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
  forPicker: {
    width: '80%',
    height: 50
  },
  picker: {
    flex: 1
  }
})