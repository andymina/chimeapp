import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, Slider } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DefaultButton from './DefaultButton';

export default class Settings extends Component{
  render() {
    return (
      <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
          <DefaultButton buttonStyling={style.button} textStyling={style.text} capitalized content='Alarm Sound' run={() => {this.props.navigation.navigate('AlarmSoundScreen')}}/>
          <DefaultButton buttonStyling={style.button} textStyling={style.text} capitalized content='Radius Size' run={() => {this.props.navigation.navigate('RadiusSizeScreen')}}/>
          <DefaultButton buttonStyling={style.button} textStyling={style.text} capitalized content='GPS Options' run={() => {this.props.navigation.navigate('GeneralSettingsScreen')}}/>
          <DefaultButton buttonStyling={style.button} textStyling={style.text} capitalized content='Saved Locations' run={() => {this.props.navigation.navigate('SavedLocationsScreen')}}/>
          <DefaultButton buttonStyling={style.button} textStyling={style.text} capitalized content='Contact Us' run={() => {this.props.navigation.navigate('GeneralSettingsScreen')}}/>
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
    marginLeft: 15,
    marginRight: 15
  },
  text: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'Microsoft Yi Baiti',
    justifyContent: 'center',
    alignItems: 'center',
  }
});