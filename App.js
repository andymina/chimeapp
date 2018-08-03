import React, { Component } from 'react';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import AddressMap from './app/components/AddressMap';
import parentSL from './app/components/parentSL';
import CustomizeStack from './app/components/CustomizeStack';
import DonateStack from './app/components/DonateStack';
import ContactStack from './app/components/ContactStack';

export default class App extends Component{
  render() {
    return <RootTab/>;
  }
}

const RootTab = TabNavigator(
  {
    //Screens
    AddressMapScreen: {
      screen: AddressMap,
      navigationOptions: { title: 'Map' },
    },
    SavedLocationsScreen: {
      screen: parentSL,
      navigationOptions: { title: 'Saved Locations' },
    },
    CustomizeScreen: {
      screen: CustomizeStack,
      navigationOptions: { title: 'Customize' },
    },
    DonateScreen: {
      screen: DonateStack,
      navigationOptions: { title: 'Donate' },
    },
    ContactScreen: {
      screen: ContactStack,
      navigationOptions: { title: 'Contact' },
    }
  },
  {
    //Landing Screen
    initialRouteName: 'AddressMapScreen'
  }
);
