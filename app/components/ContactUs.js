import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DefaultButton from './DefaultButton';

export default class ContactUs extends Component{
    render() {
        return (
            <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
                <View style={style.about}>
                    <Text style={style.header}>ABOUT CHIME</Text>
                    <Text style={style.body}>{`Making the next big thing is not about getting rich; it's about creating something that will solve day to day problems. For NYC, our day to day problem is the MTA.\n\nOften unreliable and prone to delays, our city's public transportation has a reputation fro being the number one reason to make you late. To phase out the mishaps of delays and construction, NYC commuters take naps on the bus or train, but end up missing their stop. Chime was made to solve this problem.`}</Text>
                </View>

                <View style={style.ourTeam}>
                    <Text style={style.header}>OUR TEAM</Text>

                    <View style={style.body}>
                        <View style={style.card}></View>
                        <View style={style.card}></View>
                        <View style={style.card}></View>
                    </View>
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
  },
  about: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  ourTeam: {
    color: 'white'
  }, 
  teaContent: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  }
});