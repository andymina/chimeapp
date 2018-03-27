import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';

export default class Home extends Component{
  render() {
    return (
        <ImageBackground source={require('../img/background.jpg')} style={{width: '100%', height: '100%'}}>
          <Text>Chime</Text>
          <Text>Location based alarms. Travel with ease.</Text>

          <TouchableOpacity>
        </ImageBackground>
    );
  }
}
