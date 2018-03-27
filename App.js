import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Home from './app/components/Home';

export default class App extends Component{
  render() {
    return <RootStack/>;
  }
}

const RootStack = StackNavigator(
  {
    //Screens
    HomeScreen: {screen: Home},
  },
  {
    //Landing Screen
    initialRouteName: 'HomeScreen',
    navigationOptions : {header: null}
  }
);
