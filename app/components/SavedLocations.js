import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, AsyncStorage, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DefaultButton from './DefaultButton';

export default class GeneralSettings extends Component {
  constructor() {
    super();
    this.state = {
      savedAddresses: null
    }
  }
  componentDidMount = () => {
    AsyncStorage.getItem("savedAddresses").then(savedAddresses => {
      savedAddresses = savedAddresses ? JSON.parse(savedAddresses) : [];
      this.setState({savedAddresses: savedAddresses});
      console.log("savedAddresses", savedAddresses);
    });
  }
  render() {
    return (
      <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
        <View>
          {this.state.savedAddresses ? this.state.savedAddresses.map((savedAddress, i) =>
            <View key={i}><Text>{savedAddress}</Text></View>
          ) : null}
        </View>
        <Button title='Go Back' onPress={() => this.props.navigation.goBack()}/>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  imageBackground : {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
});
