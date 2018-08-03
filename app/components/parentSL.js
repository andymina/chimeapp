import React, { Component } from 'react';
import testSL from './testSL';
import SavedLocations from './SavedLocations';
import { StackNavigator } from 'react-navigation';

export default class parentSL extends Component{
  render() {
    return <RootStack />;
  }
}

const RootStack = StackNavigator(
  {
    firstSL: testSL,
    secondSL: SavedLocations
  },
  {
    navigationOptions: { title: 'Saved Locations' }
  }
);
