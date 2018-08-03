import React, { Component } from 'react';
import { Text, Button, View } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

export default class secondTestSL extends Component{
  render() {
    return (
      <View>
        <Text>Welcome to the secondTestSL page!</Text>
        <Button title='Go Back' onPress={() => this.props.navigation.goBack()}/>
      </View>
    );
  }
}
