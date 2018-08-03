import React, { Component } from 'react';
import { Text, Button, View } from 'react-native';
import SearchBar from './SearchBar';
import { StackNavigator } from 'react-navigation';

export default class testSL extends Component{
  render() {
    return (
      <View>
        <Text>This is the first SL page!</Text>
        <Button title='Tap here to go to SL 2!' onPress={() => this.props.navigation.navigate('secondSL')}/>
      </View>
    );
  }
}
