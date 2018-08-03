import React, { Component } from 'react';
import Customize from './Customize';
import { StackNavigator } from 'react-navigation';

export default class CustomizeStack extends Component{
  render() {
    return <RootStack />;
  }
}

const RootStack = StackNavigator({
  CustomizeScreen: Customize
});
