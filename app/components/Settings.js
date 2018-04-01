import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, Slider } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DefaultButton from './DefaultButton';

export default class Settings extends Component{
  render() {
    return (
      <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
          <DefaultButton buttonStyling={style.button} content='Alarm Sound ' run={() => {this.props.navigation.navigate('AlarmSettingsScreen')}}/>
          <DefaultButton buttonStyling={style.button} content='Position Radius' run={() => {this.props.navigation.navigate('GeneralSettingsScreen')}}/>
          <DefaultButton buttonStyling={style.button} content='GPS Options' run={() => {this.props.navigation.navigate('GeneralSettingsScreen')}}/>
          <DefaultButton buttonStyling={style.button} content='Saved Locations' run={() => {this.props.navigation.navigate('GeneralSettingsScreen')}}/>
          <DefaultButton buttonStyling={style.button} content='Contact Us' run={() => {this.props.navigation.navigate('GeneralSettingsScreen')}}/>
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
  },
  button: {
    width: 250,
    padding: 20,
  }
});