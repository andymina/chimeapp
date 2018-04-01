import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import Home from './app/components/Home';
import Settings from './app/components/Settings';
import AlarmSettings from './app/components/AlarmSettings';
import GPSSettings from './app/components/GPSSettings';
import AlarmSetup from './app/components/AlarmSetup';

export default class App extends Component{
  render() {
    return <RootStack/>;
  }
}

const RootStack = StackNavigator(
  {
    //Screens
    HomeScreen: {screen: Home},
    AlarmSetupScreen: {screen: AlarmSetup},
    SettingsScreen: {screen: Settings},
    AlarmSettingsScreen: {screen: AlarmSettings},
    GPSSettingsScreen: {screen: GPSSettings},
  },
  {
    //Landing Screen
    initialRouteName: 'HomeScreen',
    navigationOptions : {header: null}
  }
);
