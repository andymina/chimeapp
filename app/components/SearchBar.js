import React, { Component } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

export default class SearchBar extends Component{
  render() {
    return (
      <View style={[style.defaultButton, this.props.buttonStyling]} onPress={this.props.run}><TextInput style={[style.defaultText, this.props.textStyling]} defaultValue={this.props.placeholder}></TextInput></View>
    );
  }
}

const style = StyleSheet.create({
  defaultButton: {
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, .7)',
  },
  defaultText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Microsoft Yi Baiti',
    borderColor: 'rgba(0, 0, 0, 1)'
  }
});
