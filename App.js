import React, { Component } from 'react';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import AddressMap from './app/components/AddressMap';
import parentSL from './app/components/parentSL';
import CustomizeStack from './app/components/CustomizeStack';
import DonateStack from './app/components/DonateStack';
import ContactStack from './app/components/ContactStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';

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
    initialRouteName: 'AddressMapScreen',
    order: ['AddressMapScreen', 'SavedLocationsScreen', 'CustomizeScreen', 'DonateScreen', 'ContactScreen'],
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'AddressMapScreen') {
          iconName = `ios-map`;
        } else if (routeName === 'SavedLocationsScreen') {
          return <Foundation name='save' size={30} color={tintColor}/>
        } else if (routeName === 'CustomizeScreen') {
          iconName = `ios-settings`;
        } else if (routeName === 'DonateScreen') {
          iconName = `ios-card`;
        } else if (routeName === 'ContactScreen') {
          iconName = `ios-mail`;
        }

        return <Ionicons name={iconName} size={30} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#941AB7',
      activeBackgroundColor: '#FFFFFF',

      inactiveTintColor: '#FFFFFF',
      inactiveBackgroundColor: '#941AB7',
    },
  }
);
