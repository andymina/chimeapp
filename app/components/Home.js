import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, StyleSheet, AsyncStorage, Button, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import DefaultButton from './DefaultButton';

export default class Home extends Component{
  componentDidMount = () => {
    // AsyncStorage.clear();
  }
  render() {
    return (
        <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
          <Text style={style.header}>CHIME</Text>
          <View style={{alignItems: "center"}}>
            <Text style={style.oneLiner}>{'Location based alarms.'}</Text>
            <Text style={style.oneLiner}>{'Travel with ease.'}</Text>
          </View>
          <DefaultButton 
            content={'Get Started'}
            capitalized
            run={() => {this.props.navigation.navigate('AddressMapScreen')}}
            buttonStyling={{width: 250}}
            textStyling={{fontSize: 32}}
          />
          <View style={{position: 'absolute', bottom: 0, right: 0, margin: 20}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingsScreen')}>
              <View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, borderRadius: 12}}>
                <Icon name='md-settings' size={38} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={style.appInfo}>
            <Text style={style.infoText}>{DeviceInfo.getVersion()}</Text>
          </View>

            {/* settings icon */}

        </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  imageBackground : {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  header: {
    color: 'white',
    fontSize: 130,
    fontFamily: 'Microsoft Yi Baiti',
  },
  oneLiner: {
    color: 'white',
    fontSize: 35,
    fontFamily: 'Microsoft Yi Baiti',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfo: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Microsoft Yi Baiti',
  }
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