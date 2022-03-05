import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { FlatList } from 'react-native-gesture-handler';
import Note from "./Note"

const getItem = async (key) => {
  let result = await SecureStore.getItemAsync(key);
  if (result)
    return result;
}

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: [],
      notes: [],
      fontSize: '',
      sorting: '',
      filter: "",
      filteredNotes: []
    };
  }
  refresh = async () => {
    this.setState({
      keys: JSON.parse(await getItem("allNotes")),
      fontSize: (await getItem("fontSize")*3) + 16,
      sorting: await getItem("sorting")
    })
    var notes = await Promise.all(this.state.keys.map(async (key) => {
      let note = JSON.parse(await getItem(key))
      note.push(key)
      return note
    }));
    if (this.state.sorting == "true") {
      notes.sort((a, b) => {
        return b[4] - a[4]
      })
    }
    else{
      notes.sort((a,b)=>{
        return a[4] - b[4]
      })
    }
    this.setState({ notes: notes })
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
    this.props.navigation.addListener("focus", async () => {
      await this.refresh()
      this.filter('')
    })
    await this.refresh()
    this.filter('')
  }
  filter = (text) => {
    let t = text.toLowerCase()
    this.setState({ filter: text })
    let filteredNotes = this.state.notes.filter(note => {
      let title = note[0].toLowerCase()
      let content = note[1].toLowerCase()
      let category = note[2].toLowerCase()
      return title.includes(t) || content.includes(t) || category.includes(t)
    })
    this.setState({ filteredNotes: filteredNotes })
  }
  render = () => {
    return (
      <View style={{
        flex: 1
      }}>
        <View style={{
          width: '100%',
          height: 50,
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10
        }}>
          <TextInput style={{
            width: '80%',
            height: 50,
            fontSize: 20,
          }}
            underlineColorAndroid="#696969"
            placeholder="FILTER..."
            onChangeText={(text) => {
              this.filter(text)
            }}
            value={this.state.filter}>

          </TextInput>
        </View>
        <FlatList
          numColumns={2}
          data={
            this.state.filteredNotes
          }
          renderItem={({ item }) => <Note title={item[0]} content={item[1]} category={item[2]} color={item[3]} date={item[4]} key={item[5]} id={item[5]} refresh={this.refresh} filter={this.filter} navigate={this.props.navigation.navigate} fontSize={this.state.fontSize}/>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
