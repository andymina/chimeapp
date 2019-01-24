import React, { Component } from 'react';
import { Text, Button, View, StatusBar } from 'react-native';

export default class Settings extends Component{
  static navigationOptions = {
    title: 'Settings',
    headerStyle: {
      backgroundColor: '#941AB7',
    },
    headerTintColor: '#FFF',
    headerTitleStyle: {
      fontFamily: 'Microsoft Yi Baiti',
      fontSize: 30,
      textAlignVertical: "center",
      includeFontPadding: false
    }
  };

  render() {
    return (
      <View>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          translucent={true}
        />
        <Text>This is the Settings page!</Text>
      </View>
    );
  }
}
