import React, { Component } from 'react';
import { Alert, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import S1 from "./components/Notes"
import S2 from "./components/CreateNote"
import S3 from "./components/AddCategory"
import S4 from "./components/EditNote"
import S5 from "./components/Settings"
import Pencil from "./components/gfx/pencil.png";
import Note from "./components/gfx/notebook.png";
import Info from "./components/gfx/information.png";
import Add from "./components/gfx/plus.png"
import Category from "./components/gfx/bookmark.png"
import Kebab from "./components/gfx/kebab.png"
import Back from "./components/gfx/back.png";


import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { render } from 'react-dom';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <View style={{
      height: '100%',
    }}>
      <View style={styles.menu}>
        <Image source={Pencil} />
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Notes"
          icon={() => <Image source={Note} />}
          onPress={() => props.navigation.navigate("Notes")}
        />
        <DrawerItem
          label="Add Note"
          icon={() => <Image source={Add} />}
          onPress={() => props.navigation.navigate("Add Note")}

        />
        <DrawerItem
          label="Add Category"
          icon={() => <Image source={Category} />}
          onPress={() => props.navigation.navigate("Add Category")}
        />
        <DrawerItem
          label="Info"
          icon={() => <Image source={Info} />}
          onPress={() => Alert.alert("Wersja aplikacje 3.0.0", "Autor: Kacper Przełożny")}
        />
      </DrawerContentScrollView>
    </View>
  );
}

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Notes" component={S1} options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: "#5FA3F9"
            },
            headerTitleAlign: "center",
            headerRight:
              () => {
                return (<TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                  <Image source={Kebab} style={{ marginRight: 15 }} />
                </TouchableOpacity>)
              }
          }
          )} />
          <Drawer.Screen name="Add Note" component={S2} options={{
            headerStyle: {
              backgroundColor: "#32CD32"
            },
            headerTitleAlign: "center",
          }} />
          <Drawer.Screen name="Add Category" component={S3} options={{
            headerStyle: {
              backgroundColor: "#DC143C"
            },
            headerTitleAlign: "center",
          }} />
          <Drawer.Screen name="Edit Note" component={S4} options={{
            headerStyle: {
              backgroundColor: "#5FA3F9"
            },
            headerTitleAlign: "center",
          }} />
          <Drawer.Screen name="Settings" component={S5} options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: "#2C3539"
            },
            headerTitleAlign: "center",
            headerTintColor: "#f5f5f5",
            headerLeft: () => {
              return (<TouchableOpacity onPress={() => navigation.navigate("Notes")}>
                <Image source={Back} style={{ marginLeft: 15 }} />
              </TouchableOpacity>)
            }
          })

          } />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}


const styles = StyleSheet.create({
  menu: {
    width: '100%',
    height: '30%',
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 75,
  },
  notesHeader: {
    backgroundColor: "red"
  },
  addNotesHeader: {
    backgroundColor: "blue"
  }
})

export default App;
