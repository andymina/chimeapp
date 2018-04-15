import React from 'react';
// import Map from './Map';
import MapView from 'react-native-maps';
import { StyleSheet, ImageBackground, View, WebView, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, Slider, SliderIOS, TextInput, StatusBar, AsyncStorage, Vibration } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';

export default class AddressMap extends React.Component {
  constructor() {
    super();
    this.state = {
      alarm: false,
      address: '',
      savedAddresses: [],
      res: {},
      coordinates: {},
      radius: .1,
      focus: false,
      isFavorite: false,
    }
  }
  componentDidMount = () => {
    AsyncStorage.getItem('savedAddresses').then((savedAddresses) => {
      savedAddresses = savedAddresses ? JSON.parse(savedAddresses) : [];
      this.setState({savedAddresses: savedAddresses});
    });
    console.log("Sound", Sound);
    Sound.setCategory('Playback');
    this.loadAlarm("alarm1");
    this.alarm.setVolume(1);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
  }
  componentWillUnmount = () => {
    if (this.state.alarm) {
      this.alarm.stop();
    }
    this.alarm.release();
  }
  passWebView = (webView) => {
    this.webView = webView;
  }
  loadAlarm = (alarmName) => {
    this.alarm = new Sound(`${alarmName}.mp3`, Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log("Error: ", err); 
        return;
      }
      this.alarm.setNumberOfLoops(-1);
      console.log('duration in seconds: ' + this.alarm.getDuration() + 'number of channels: ' + this.alarm.getNumberOfChannels());
    });
  }
  startAlarm = () => {
    this.alarm.play(success => {
      if (!success) {
        this.alarm.reset();
        return;
      }
    });
    Vibration.vibrate([0, 1000], true);
    this.setState({alarm: true});
    alert("You've reached your destination!");
  }
  stopAlarm = () => {
    this.alarm.stop();
    this.webView.postMessage(JSON.stringify({
      type: 'reset',
    }));
    Vibration.cancel();
    this.setState({alarm: false});
  }
  handleAddressChange = (val) => {
    this.setState({address: val});
    this.geoSearch(val.toLowerCase())
      .then(res => {
        this.setState({
          res: res,
          isFavorite: this.state.savedAddresses.includes(res.results[0].formatted_address),
          address: this.state.savedAddresses.includes(res.results[0].formatted_address) ? res.results[0].formatted_address : val
        });
      })
      .catch(err => {
        console.log("Error: ", err); 
      });
  }
  // handleEval = (val) => {
  //   this.setState({eval: val});
  // }
  // sendEval = () => {
  //   console.log("sentEval");
  //   this.webView.postMessage(JSON.stringify({
  //     type: 'eval',
  //     code: this.state.eval
  //   }));
  // }
  handleKeyboardShow = () => {
    // this.setState({focus: true});
  }
  handleKeyboardHide = () => {
    // this.setState({focus: false});
  }
  handleRadiusChange = (val) => {
    this.setState({radius: val});
  }
  geoSearch = async (query) => {
    let params = {
      address: query,
      key: "AIzaSyCFahoN8YY9nnzyo2pYdXY9TnNdFB6JqdY"
    };
    params = Object.keys(params).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])).join("&");
    try {
      const req = await fetch('https://maps.googleapis.com/maps/api/geocode/json?' + params);
      return json = await req.json();
    } catch(err) {
      console.log("Error: ", err); 
    }
  }
  handleAddressSubmit = () => {
    Keyboard.dismiss();
    const res = this.state.res;
    if (res) {
      this.webView.postMessage(JSON.stringify({
        type: 'destination',
        destination: [res.results[0].geometry.location.lat, res.results[0].geometry.location.lng],
        radius: this.state.radius,
      }));
    } else {
      console.log("Error: ", res); 
      alert("Something seems to have gone wrong. Please try again later.");
    }
  }
  saveAddress = () => {
    if (this.state.address) {
      const savedAddresses = this.state.savedAddresses,
        res = this.state.res;
      if (res) {
        const address = res.results[0].formatted_address;
        if (!savedAddresses.includes(address)) {
          savedAddresses.push(address);
          this.setState({savedAddresses: savedAddresses, isFavorite: true});
          AsyncStorage.setItem('savedAddresses', JSON.stringify(savedAddresses))
            .then(() => {
              alert("Address successfully saved.");
            })
            .catch(err => {
              alert("Something seems to have gone wrong. Please try again later.");
            });
        }
      } else {
        alert("Something seems to have gone wrong. Please try again later.");
      }
    }
  }
  removeAddress = () => {
    if (this.state.address) {
      const savedAddresses = this.state.savedAddresses,
        res = this.state.res;
      if (res) {
        const address = res.results[0].formatted_address;
        if (savedAddresses.includes(address)) {
          savedAddresses.splice(savedAddresses.indexOf(address), 1);
          this.setState({savedAddresses: savedAddresses, isFavorite: false});
          AsyncStorage.setItem('savedAddresses', JSON.stringify(savedAddresses))
            .then(() => {
              alert("Address successfully removed.");
            })
            .catch(err => {
              alert("Something seems to have gone wrong. Please try again later.");
            });
        }
      } else {
        alert("Something seems to have gone wrong. Please try again later.");
      }
    }
  }
  render() {
    return (
      <ImageBackground source={require('../img/background.jpg')} style={style.imageBackground}>
        <StatusBar barStyle="light-content" />
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
          <View style={{flex: 1, width: '100%', display: this.state.focus ? 'none' : 'flex'}}>
            {/* <Map passWebView={this.passWebView} style={{width: '100%'}} startAlarm={this.startAlarm} enableHighAccuracy={true} /> */}
            <MapView />
          </View>
          <View style={{position: 'absolute', top: 0, flex: this.state.focus? 0.4 : 0.2, width: '100%', flexDirection: 'column', padding: 25}}>
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 35, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10}}>
              <View style={{flex: 1, width: '100%', marginLeft: '4%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={this.state.isFavorite ? this.removeAddress : this.saveAddress} disabled={!this.state.address}>
                  {this.state.isFavorite ? <Icon name='ios-heart' size={32} color="white" /> :
                    <Icon name='ios-heart-outline' size={32} color="white" />}
                </TouchableOpacity>
              </View>
              <View style={{flex: 7, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                  style={{textAlign: 'center', width: '92%', fontSize: 24, color: 'white', fontFamily: 'Microsoft Yi Baiti'}}
                  onChangeText={this.handleAddressChange}
                  onFocus={this.handleKeyboardShow}
                  // value={this.state.address}
                  onSubmitEditing={this.state.alarm ? null : this.handleAddressSubmit}
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={{flex: 1, width: '100%', marginRight: '4%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={this.state.alarm ? this.stopAlarm : this.handleAddressSubmit} disabled={!this.state.address}>
                  {this.state.alarm ? <Icon name='ios-close' size={32} color="white" /> :
                    <Icon name='ios-search-outline' size={32} color="white" />}
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={{flex: 0.25, flexDirection: 'row'}}>
            </View> */}
              {/* <View style={{flex: 7, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                  style={{textAlign: 'center', width: '92%', fontSize: 24, color: 'white', fontFamily: 'Microsoft Yi Baiti'}}
                  onChangeText={this.handleEval}
                  onFocus={this.handleKeyboardShow}
                  onSubmitEditing={this.sendEval}
                  placeholder="Enter code to evaluate."
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={{flex: 1, width: '100%', marginRight: '4%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={this.sendEval}>
                  <Icon name='ios-checkmark' size={42} color="white" />
                </TouchableOpacity>
              </View> */}
            {/* <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10}}>
              <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('FavoritesScreen')}>
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 35, flex: 1, marginLeft: 5, marginRight: 5, justifyContent: 'center', alignContent: 'center'}}>
                  <Text style={{textAlign: 'center', fontSize: 24, color: 'white', fontFamily: 'Microsoft Yi Baiti'}}>Favorites</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('SettingsScreen')}>
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 35, flex: 1, marginLeft: 5, marginRight: 5, justifyContent: 'center', alignContent: 'center'}}>
                  <Text style={{textAlign: 'center', fontSize: 24, color: 'white', fontFamily: 'Microsoft Yi Baiti'}}>Settings</Text>
                </View>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={{position: 'absolute', bottom: 0, right: 0, margin: 20}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingsScreen')}>
                {/* style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 35, flex: 1, marginLeft: 5, marginRight: 5, justifyContent: 'center', alignContent: 'center'}}> */}
                <Icon name='md-settings' size={40} color="black" />
            </TouchableOpacity>
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