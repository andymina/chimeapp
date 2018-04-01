import React, { Component } from 'react';
import { Text, View, ImageBackground, CheckBox, StyleSheet } from 'react-native';
import DefaultButton from './DefaultButton';

export default class GeneralSettings extends Component{
  state = {
    ticked : false,
  }
  render() {
    return (
        <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
          <View>
            <Text>Enable High Accuracy</Text>
            <CheckBox onValueChange={value => this.setState({ticked : value})} value={this.state.ticked}></CheckBox>
          </View>
          
          <View>
            <Text>Live Position Timeout</Text>
          </View>

          <View>
            <Text>Cached Position Timeout</Text>
          </View>
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
