import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, Slider, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Sound from 'react-native-sound';
import DefaultSlider from './DefaultSlider';

export default class AlarmSound extends Component{
  constructor() {
    super();
    this.state = {
      loading: true,
      volume: 100,
      currentAlarm: null,
      isAlarmPlaying: false,
      customAlarms: null,
      isAlarmCustom: false
    }
  }
  componentDidMount = () => {
    Sound.setCategory('Playback');
    AsyncStorage.getItem('settings')
      .then(settings => {
        settings = settings ? JSON.parse(settings) : {};
        settings.alarm = settings.alarm ? settings.alarm : {};
        this.setState({
          volume: (settings.volume || 1) * 100,
          currentAlarm: settings.alarm.current || 'alarm_1', // alarmName or Id
          customAlarms: settings.alarm.customs || {}, // object full of custom alarms
          isAlarmCustom: settings.alarm.isCustom || false, // boolean determining if alarm was uploaded or not
        }, () => {
          this.loadAlarm({ id: this.state.currentAlarm, userUploaded: this.state.isAlarmCustom, autoPlay: false })
            .then(() => {
              this.setState({ loading: false });
            });
        });
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }
  componentWillUnmount = () => {
    if (this.state.isAlarmPlaying) {
      this.alarm.stop();
    }
    this.alarm.release();
    AsyncStorage.getItem('settings')
      .then(settings => {
        settings = settings ? JSON.parse(settings) : {};
        settings.volume = this.state.settings;
        settings.alarm = settings.alarm ? settings.alarm : {};
        settings.alarm.current = this.state.currentAlarm;
        settings.alarm.customs = this.state.customAlarms;
        settings.alarm.isCustom = this.state.isAlarmCustom;
        AsyncStorage.setItem('settings', JSON.stringify(settings))
          .catch(err => {
            console.log("Error: ", err);
          });
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }
  uploadAudio = () => {
    this.stopAlarm()
      .then(() => {
        DocumentPicker.show({ filetype: [DocumentPickerUtil.audio()] }, (err, res) => {
          if (err) {
            console.log(new Error(err));
          } else if (res) {
            if (res.uri) {
              this.setState({ loading: true }, () => {
                const encoding = "base64";
                RNFS.readFile(res.uri, encoding)
                  .then(contents => {
                    const dir = `${RNFS.DocumentDirectoryPath}/custom.alarms`;
                    const id = decodeURIComponent(new RegExp(".*\/(.*)").exec(res.uri)[1]).replace(":", "_");
                    RNFS.mkdir(dir)
                      .then(() => {
                        const path = `${dir}/${id}.mp3`;
                        RNFS.writeFile(path, contents, encoding)
                          .then(() => {
                            const customAlarms = Object.assign({}, this.state.customAlarms);
                            customAlarms[id] = {
                              name: res.fileName,
                              path: path,
                              fileSize: res.fileSize,
                              type: res.type,
                            };
                            this.setState({ customAlarms: customAlarms });
                            AsyncStorage.getItem('settings')
                              .then(settings => {
                                settings = settings ? JSON.parse(settings) : {};
                                settings.alarm = settings.alarm ? settings.alarm : {};
                                settings.alarm.current = id;
                                settings.alarm.customs = customAlarms;
                                settings.alarm.isCustom = true;
                                AsyncStorage.setItem('settings', JSON.stringify(settings))
                                  .catch(err => {
                                    console.log("Error: ", err);
                                  });
                              })
                              .catch(err => {
                                console.log("Error: ", err);
                              });
                            this.loadAlarm({ id: id, userUploaded: true })
                              .then(() => {
                                this.setState({ loading: false });
                              })
                              .catch(err => {
                                console.log("Error: ", err);
                              });
                          });
                      });
                  });
                });
            }
          }
        });
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }
  loadAlarm = ({ id, userUploaded = false, autoPlay = true }) => {
    return new Promise((resolve, reject) => {
      const callback = (err) => {
        if (err) {
          reject(err);
        }
        if (autoPlay) {
          this.startAlarm()
            .then(() => {
              resolve();
            })
            .catch(err => {
              console.log("Error: ", err);
            });
        } else {
          resolve();
        }
      };
      console.log('id', id);
      console.log('userUploaded', userUploaded);
      console.log('autoPlay', autoPlay);
      this.alarm = userUploaded ? new Sound(`${RNFS.DocumentDirectoryPath}/custom.alarms/${id}.mp3`, ``, callback) : new Sound(`${id}.mp3`, Sound.MAIN_BUNDLE, callback);
      this.alarm.setNumberOfLoops(-1);
    });
  }
  startAlarm = () => {
    return new Promise((resolve, reject) => {
      try {
        this.setState({ isAlarmPlaying: true }, () => {
          try {
            this.alarm.play(success => {
              if (!success) {
                this.setState({ isAlarmPlaying: false });
                this.alarm.reset();
                reject(new Error('Playback failed due to audio decoding errors.'));
              }
            });
            resolve();
          } catch (err) {
            reject(new Error(err));
          }
        });
      } catch (err) {
        reject(new Error(err));
      }
    });
  }
  stopAlarm = () => {
    return new Promise((resolve, reject) => {
      try {
        if (this.state.isAlarmPlaying) {
          this.alarm.stop();
          this.setState({ isAlarmPlaying: false }, () => {
            resolve();
          });
        } else {
          resolve();
        }
      } catch (err) {
        reject(new Error(err));
      }
    });
  }
  setAlarmToDefault = () => {
    this.setState({ loading: true }, () => {
      this.loadAlarm({ id: `alarm_1` })
        .then(() => {
          this.setState({ loading: false });
        });
    });
  }
  handleVolumeChange = (val) => {
    this.setState({volume: val});
    this.alarm.setVolume(val/100);
  }
  render() {
    const size = 32;
    return (
        <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
          {this.state.loading ? <View>
            <Text>Loading</Text>
          </View> : <View>
            <Text>Change Volume</Text>
            <Text>{this.state.volume.toFixed(0) + "%"}</Text>
            <DefaultSlider sliderName={"Volume"} step={5} minimumValue={1e-12} maximumValue={100} value={this.state.volume} onValueChange={this.handleVolumeChange} />
            {!this.state.isAlarmPlaying ? <TouchableOpacity onPress={this.startAlarm}>
                <Icon name="ios-play" size={size} color="white" />
              </TouchableOpacity> : <TouchableOpacity onPress={this.stopAlarm}>
                <Icon name="ios-square" size={size} color="white" />
              </TouchableOpacity>}
            <TouchableOpacity onPress={this.uploadAudio}>
              <Icon name="md-cloud-upload" size={size} color="white" />
            </TouchableOpacity>
          </View>}
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
  text: {
    color: 'white'
  }
});
