import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import AddressMap from './app/components/AddressMap';
import SavedLocations from './app/components/SavedLocations';
import Settings from './app/components/Settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import {AdMobBanner} from 'react-native-admob';

const SavedLocationsStack = createStackNavigator(
  {
    SLHome: SavedLocations,
  }
);
const SettingsStack = createStackNavigator(
  {
    SettingsHome: Settings,
  },
  {
    navigationOptions: { title: '', headerTitle: 'Settings' },
  }
);

const RootTab = createAppContainer(createBottomTabNavigator(
  {
    //Screens
    AddressMapScreen: {
      screen: AddressMap,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Ionicons name='ios-map' size={35} color={tintColor} />
        },
      },
    },
    SavedLocationsScreen: {
      screen: SavedLocationsStack,
      title: 'Donate',
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Foundation name='save' size={35} color={tintColor}/>
        }
      },
    },
    SettingsScreen: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Ionicons name='ios-settings' size={35} color={tintColor} />
        },
      },
    }
  },
  {
    //Landing Screen
    initialRouteName: 'AddressMapScreen',
    order: ['AddressMapScreen', 'SavedLocationsScreen', 'SettingsScreen'],
    tabBarOptions: {
      showLabel: false,
      activeTintColor: '#941AB7',
      inactiveTintColor: '#FFFFFF',

      activeBackgroundColor: '#FFFFFF',
      inactiveBackgroundColor: '#941AB7',
    }

  }
));

export default class App extends Component{
  static router = RootTab.router;

  render() {
    const { navigation } = this.props;

    return (
      <View style={{flex: 1}}>
        <RootTab/>
        <AdMobBanner
          adSize="fullBanner"
          adUnitID="ca-app-pub-3940256099942544/2934735716"
          testDevices={[AdMobBanner.simulatorId]}
          onAdFailedToLoad={error => console.error(error)}
        />
      </View>
    );
  }
}
