import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import Home from './app/components/Home';
import Settings from './app/components/Settings';
import AlarmSound from './app/components/AlarmSound';
import RadiusSize from './app/components/RadiusSize';
import GPSSettings from './app/components/GPSSettings';
import SavedLocations from './app/components/SavedLocations';
import AlarmSetup from './app/components/AlarmSetup';
import AddressMap from './app/components/AddressMap';

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
    RadiusSizeScreen: {screen: RadiusSize},
    AlarmSoundScreen: {screen: AlarmSound},
    GPSSettingsScreen: {screen: GPSSettings},
    SavedLocationsScreen: {screen: SavedLocations},
    AddressMapScreen: {screen: AddressMap}
  },
  {
    //Landing Screen
    initialRouteName: 'HomeScreen',
    navigationOptions : {header: null}
  }
);
