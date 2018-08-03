import React, { Component } from 'react';
import Donate from './Donate';
import { StackNavigator } from 'react-navigation';

export default class DonateStack extends Component{
  render() {
    return <RootStack />;
  }
}

const RootStack = StackNavigator({
  DonateScreen: Donate
});
