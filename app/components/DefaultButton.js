import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class DefaultButton extends Component{
  render() {
    return (
      <TouchableOpacity style={[style.defaultButton, this.props.buttonStyling]} onPress={this.props.run}><Text style={[style.defaultText, this.props.textStyling]}>{this.props.capitalized ? this.props.content.toUpperCase() : this.props.content}</Text></TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  defaultButton: {
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    padding: 20
  },
  defaultText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Microsoft Yi Baiti'
  }
});
