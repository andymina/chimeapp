import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DefaultButton from './DefaultButton';

export default class Home extends Component{
  render() {
    return (
        <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
          <Text style={style.header}>CHIME</Text>
          
          <Text style={style.oneLiner}>{`Location based alarms.\n\t\t\t\t\t\t\tTravel with ease.`}</Text>            

          <DefaultButton 
            content={'GET STARTED'}
            run={() => {this.props.navigation.navigate('AlarmSetupScreen')}}
            buttonStyling={{width: 250}}/>
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
  header: {
    color: 'white',
    fontSize: 100,
    fontFamily: 'Microsoft Yi Baiti',
  },
  oneLiner: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Microsoft Yi Baiti',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // icon: {
  //   resizeMode: 'center',
  //   margin: 0,
  //   padding: 0,
  // },
  // version: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignContent: 'flex-end',
  //   justifyContent: 'flex-end'
  // },
  // versionText: {
  //   color: 'white',
  //   fontFamily: 'Microsoft Yi Baiti',
  // },
});