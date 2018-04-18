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
    AsyncStorage.getItem('customAlarms').then(customAlarms => {
      customAlarms = customAlarms ? JSON.parse(customAlarms) : {};
      this.setState({customAlarms: customAlarms});
    });
    Sound.setCategory('Playback');
    this.loadAlarm({ name: "alarm1", autoPlay: false });
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
    AsyncStorage.setItem('customAlarms', JSON.stringify(this.state.customAlarms));
  }
  uploadAudio = () => {
    this.setState({playing: false});
    this.alarm ? this.alarm.reset() : null;
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.audio()]
    }, (err, res) => {
      if (res) {
        const encoding = "base64";
        console.log(res);
        res.uri ? RNFS.readFile(res.uri, encoding).then(contents => {
          const id = res.uri.split('/').pop().replace(/[#%&{}\<>*?/\s$!'":@]/gi, "-");
          RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/custom.alarms`).then(() => {
            RNFS.writeFile(`${RNFS.DocumentDirectoryPath}/custom.alarms/${id}`, contents, encoding).then(() => {
              let customAlarms = Object.assign({}, this.state.customAlarms);
              customAlarms[id] = {
                name: res.fileName,
                path: `${RNFS.DocumentDirectoryPath}/custom.alarms/${id}`,
                fileSize: res.fileSize,
                type: res.type,
              };
              this.setState({customAlarms: customAlarms});
              AsyncStorage.setItem('currentAlarm', JSON.stringify({ name: id, userUploaded: true }));
              this.loadAlarm({ name: id, userUploaded: true });
            });
          });
        }): null;
      }
    });
  }
  loadAlarm = ({ name, userUploaded = false, autoPlay = true }) => {
    this.alarm = new Sound(
      userUploaded ? `${RNFS.DocumentDirectoryPath}/custom.alarms/${name}` : `${name}.mp3`,
      userUploaded ? '' : Sound.MAIN_BUNDLE,
      (err) => {
        if (err) {
          console.log("Error: ", err); 
          return;
        }
        autoPlay ? this.startAlarm() : null;
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
