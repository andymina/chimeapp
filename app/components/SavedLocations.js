import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DefaultButton from './DefaultButton';

export default class GeneralSettings extends Component{
  render() {
    return (
      <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
        <View></View>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  imageBackground : {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
});