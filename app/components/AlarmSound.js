import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, Slider, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Sound from 'react-native-sound';
import DefaultSlider from './DefaultSlider';

export default class AlarmVolume extends Component{
  constructor() {
    super();
    this.state = {
      origin: null,
      playing: false,
      volume: 0
    }
  }
  componentDidMount = () => {
    AsyncStorage.getItem('settings').then(settings => {
      settings = settings ? JSON.parse(settings) : {};
      this.setState({volume: (settings.volume ? settings.volume : 1) * 100});
    });
    Sound.setCategory('Playback');
    this.loadAlarm({ name: "alarm1" });
  }
  componentWillUnmount = () => {
    if (this.state.alarm) {
      this.alarm.stop();
    }
    this.alarm.release();
    AsyncStorage.getItem('settings').then(settings => {
      settings = settings ? JSON.parse(settings) : {};
      settings.volume = this.state.volume/100;
      AsyncStorage.setItem('settings', JSON.stringify(settings));
    });
  }
  uploadAudio = () => {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.audio()]
    }, (err, res) => {
      if (res) {
        const encoding = "base64";
        // store in local storage instead?
        res.uri ? RNFS.readFile(res.uri, encoding).then(str => {
          console.log("str", str);
          const name = res.uri.split('/').pop().replace(/%/gi, "-");
          // const name = "cheese";
          RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/custom.alarms`).then(() => {
            RNFS.exists(`${RNFS.DocumentDirectoryPath}/custom.alarms`).then(st => {
              console.log("new directory made? " + st);
              RNFS.writeFile(`${RNFS.DocumentDirectoryPath}/custom.alarms/${name}`, str, encoding).then(() => {
                console.log("written to...");
                console.log(`${RNFS.DocumentDirectoryPath}/custom.alarms/${name}`);
                this.loadAlarm({ name: name, userUploaded: true });
              });
            });
          });
        }): null;
      }
    });
  }
  loadAlarm = ({ name, userUploaded = false }) => {
    console.log("loadAlarm", "userUploaded: " + userUploaded, "name: " + name);
    userUploaded ? console.log("basepath", `${RNFS.DocumentDirectoryPath}/custom.alarms/${name}`) : null;
    this.alarm = new Sound(
      userUploaded ? `${RNFS.DocumentDirectoryPath}/custom.alarms/${name}` : `${name}.mp3`,
      userUploaded ? '' : Sound.MAIN_BUNDLE,
      (err) => {
        if (err) {
          console.log("Error: ", err); 
          return;
        }
        console.log("this.alarm.isLoaded()", this.alarm.isLoaded());
        this.startAlarm();
      }
    );
  }
  startAlarm = () => {
    this.setState({playing: true});
    this.alarm.play(success => {
      if (!success) {
        this.setState({playing: false});
        this.alarm.reset();
        return;
      }
    });
  }
  stopAlarm = () => {
    this.alarm.stop();
    this.setState({playing: false});
  }
  handleVolumeChange = (val) => {
    this.setState({volume: val});
    this.alarm.setVolume(val/100);
  }
  render() {
    const size = 32;
    return (
        <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
          <Text>Change Volume</Text>
          <Text>{this.state.volume.toFixed(0) + "%"}</Text>
          <DefaultSlider sliderName={"Volume"} step={5} minimumValue={0} maximumValue={100} value={this.state.volume} onValueChange={this.handleVolumeChange} />
          {!this.state.playing ? <TouchableOpacity onPress={this.startAlarm}>
              <Icon name="ios-play" size={size} color="white" />
            </TouchableOpacity> : <TouchableOpacity onPress={this.stopAlarm}>
              <Icon name="ios-square" size={size} color="white" />
            </TouchableOpacity>}
          <TouchableOpacity onPress={this.uploadAudio}>
            <Icon name="md-cloud-upload" size={size} color="white" />
          </TouchableOpacity>
          {/* <View style={style.view}>
            <Text style={style.text}>Alarm 1</Text>
            <Text style={style.text}>Alarm 2</Text>
            <Text style={style.text}>Tone 1</Text>
            <Text style={style.text}>Tone 2</Text>
            <Text style={style.text}>Sound 1</Text>
            <Text style={style.text}>Sound 2</Text>
            <Text style={style.text}>Custom...</Text>
          </View> */}
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
