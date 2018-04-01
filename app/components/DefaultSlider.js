import React, { Component } from 'react';
import { Slider, Text, StyleSheet, View } from 'react-native';

export default class DefaultSlider extends Component{
  render() {
    return (
        <View style={style.viewFrame}>
          <Text style={style.text}>{this.props.sliderName}</Text>
          <View>
            <Slider style={style.slider} minimumTrackTintColor={'#A110A2'} thumbTintColor={'white'}></Slider>
          </View>
        </View>
    );
  }
}

const style = StyleSheet.create({
  viewFrame: {
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    paddingLeft: 10,
    paddingRight: 10
  },
  slider: {
    padding: 10,
    width: 250
  },
  text: {
    color: 'white',
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15
  }
});
