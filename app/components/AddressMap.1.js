import React from 'react';
import Map from './Map';
import { StyleSheet, ImageBackground, View, WebView, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, Slider, SliderIOS, TextInput, StatusBar, Sound } from 'react-native';
// import { Constants, Audio } from 'expo';
// import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Ionicons';

export default class AddressMap extends React.Component {
  constructor() {
    super();
    this.state = {
      alarm: false,
      // address: '123 Sesame Street',
      // address: 'Louis E. Stocklmeir Elementary School',
      address: '',
      coordinates: {},
      radius: .1,
      // distanceFilter: 
      focus: false,
    }
  }
  loadAlarms(alarm) {
    this.setState({chime: `./chime/alarms/${alarm}.mp3`});
    // console.log(alarm);
    // alarm = `./chime/alarms/${alarm}.mp3`;
    // console.log(alarm);
    // this.alarm = new Sound(alarm, Sound.MAIN_BUNDLE, (error) => {
    //   if (error) {
    //     console.log('failed to load the sound', error);
    //     return;
    //   }
    //   this.alarm.play((success) => {
    //     if (success) {
    //       console.log('successfully finished playing');
    //     } else {
    //       console.log('success?,', success);
    //       console.log('playback failed due to audio decoding errors');
    //       // reset the player to its uninitialized state (android only)
    //       // this is the only option to recover after an error occured and use the player again
    //       this.alarm.reset();
    //     }
    //   });
    // });
    // this.alarm.setNumberOfLoops(-1);
    // const alarm2 = soundObject.loadAsync(require('./chime/alarm2.mp3'));
    // const alarm3 = soundObject.loadAsync(require('./chime/alarm3.mp3'));
  }
  componentDidMount = () => {
    // Sound.setCategory('Playback');
    this.loadAlarms('alarm3');
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
  }
  passWebView = (webView) => {
    this.webView = webView;
  }
  startAlarm = () => {
    console.log("alarm started");
    this.setState({alarm: true});
  }
  stopAlarm = () => {
    this.alarm.stop();
    this.setState({alarm: false});
  }
  handleAddressChange = (val) => {
    this.setState({address: val});
  }
  handleKeyboardShow = () => {
    this.setState({focus: true});
  }
  handleKeyboardHide = () => {
    this.setState({focus: false});
  }
  handleRadiusChange = (val) => {
    this.setState({radius: val});
  }
  handleAddressSubmit = () => {
    this.webView.postMessage(JSON.stringify({
      type: 'destination',
      destination: this.state.address,
      radius: this.state.radius,
    }));
    // if (this.state.focus) {
    //   this.handleKeyboardHide();
    // }
  }
  render() {
    // if (this.state.alarm) { 
    //   this.soundObject.playAsync();
    // }
    return (
      <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
        <StatusBar barStyle="light-content" />
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', width: '100%', margin: 15}}>
          <View style={{flex: 0.6, width: '100%', display: this.state.focus ? 'none' : 'flex'}}>
            <Map passWebView={this.passWebView} startAlarm={this.startAlarm} enableHighAccuracy={true} />
            {/* <Sound
              autoPlay={false}
              
              source={{
                mp3: this.state.chime
              }}
            /> */}
          </View>
          <View style={{flex: this.state.focus? 0.4 : 0.2, width: '100%', flexDirection: 'column', padding: 20}}>
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 35, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10}}>
                <View style={{flex: 7, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <TextInput
                    style={{textAlign: 'center', width: '85%', fontSize: 20, color: 'white'}}
                    onChangeText={this.handleAddressChange}
                    onFocus={this.handleKeyboardShow}
                    // placeholder='search destination'
                    placeholderTextColor="#fff"
                  />
                </View>
                <View style={{flex: 1, width: '100%', marginRight: '5%', justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity onPress={this.state.alarm ? this.stopAlarm : this.handleAddressSubmit}>
                    {this.state.alarm ? <Icon name='ios-close' size={32} color="white" /> :
                      <Icon name='ios-search-outline' size={32} color="white" />}
                  </TouchableOpacity>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', paddingTop: '4%'}}>
              <TouchableOpacity style={{flex: 1}}>
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 35, flex: 1, marginLeft: 5, marginRight: 5, justifyContent: 'center', alignContent: 'center'}}>
                  <Text style={{color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '500'}}>Save</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1}}>
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 35, flex: 1, marginLeft: 5, marginRight: 5, justifyContent: 'center', alignContent: 'center'}}>
                  <Text style={{color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '500'}}>Settings</Text>
                </View>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
});