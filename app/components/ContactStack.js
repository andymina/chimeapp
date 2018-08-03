import React, { Component } from 'react';
import Contact from './Contact';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

export default class ContactStack extends Component{
  render() {
    return <RootStack />;
  }
}

const RootStack = StackNavigator(
  {
    ContactScreen: Contact,
  },
  {
    navigationOptions: { title: 'Contact' }    
  }
);
