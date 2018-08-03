import React, { Component } from 'react';
import testSL from './testSL';
import secondTestSL from './secondTestSL';
import { StackNavigator } from 'react-navigation';

export default class parentSL extends Component{
  render() {
    return <RootStack />;
  }
}

const RootStack = StackNavigator({
  firstSL: testSL,
  secondSL: secondTestSL
});
