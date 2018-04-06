import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DefaultButton from './DefaultButton';

export default class AlarmSetup extends Component{
  render() {
    return (
        <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
            <DefaultButton
              content={'Settings'}
              run={() => {this.props.navigation.navigate('SettingsScreen')}}
              buttonStyling={{width: 250}}/>

            <Text>Searching by: </Text>
            <View style={{flexDirection: 'row'}}>
              <DefaultButton
              content={'By Address'}
              run={() => {this.props.navigation.navigate('AddressMapScreen')}}
              buttonStyling={{width: 125}}/>

              <DefaultButton
              content={'By Stop'}
              run={() => {this.props.navigation.navigate('')}}
              buttonStyling={{width: 125}}/>
            </View>
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
  map: {
    flex: .6,
    marginVertical: '7.5%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 50,
  },
  search: {
    width: 100
  }
});