import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, Slider, ScrollView } from 'react-native';
import DefaultSlider from './DefaultSlider';

export default class GeneralSettings extends Component{
  render() {
    return (
        <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
          <DefaultSlider sliderName={'Volume'}/>
          <View style={style.view}>
            <Text style={style.text}>Alarm 1</Text>
            <Text style={style.text}>Alarm 2</Text>
            <Text style={style.text}>Tone 1</Text>
            <Text style={style.text}>Tone 2</Text>
            <Text style={style.text}>Sound 1</Text>
            <Text style={style.text}>Sound 2</Text>
            <Text style={style.text}>Custom...</Text>
          </View>
        </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  view: {
    padding: 50,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, .7)',
  },
  text: {
    color: 'white'
  }
});
