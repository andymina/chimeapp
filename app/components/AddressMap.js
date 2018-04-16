import React from 'react';
import Map from './Map';
import { StyleSheet, ImageBackground, View, WebView, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, Slider, SliderIOS, TextInput, StatusBar, AsyncStorage, Vibration } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
// react-native-communications

// TODO: Replace maps api key with mine?
export default class AddressMap extends React.Component {
  constructor() {
    super();
    this.state = {
      alarm: false,
      address: '',
      savedAddresses: [],
      res: {},
      origin: null,
      destination: null,
      coordinates: {},
      radius: null,
      focus: false,
      isFavorite: false,
    }
  }
  componentDidMount = () => {
    const watchId = navigator.geolocation.watchPosition(pos => {
      this.setState({origin: pos.coords});
    }, (err) => {
      console.log("Error: ", err);
      if (err.code !== 3) {
        alert("Something seems to have gone wrong. Please try again later.");
      }
    });
    this.setState({watchId: watchId});
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this.screenDidFocus
    );
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
    Sound.setCategory('Playback');
    this.loadAlarm("alarm1");
    this.alarm.setVolume(1);
    AsyncStorage.getItem('savedAddresses').then((savedAddresses) => {
      savedAddresses = savedAddresses ? JSON.parse(savedAddresses) : [];
      this.setState({savedAddresses: savedAddresses});
    });
    this.getSettings();
  }
  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.state.watchId);
    if (this.state.alarm) {
      this.alarm.stop();
    }
    this.alarm.release();
    this._sub.remove();
    Keyboard.removeAllListeners();
  }
  loadAlarm = (alarmName) => {
    this.alarm = new Sound(`${alarmName}.mp3`, Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log("Error: ", err); 
        return;
      }
      this.alarm.setNumberOfLoops(-1);
    });
  }
  startAlarm = () => {
    this.setState({alarm: true, origin: null, destination: null});
    this.alarm.play(success => {
      if (!success) {
        this.alarm.reset();
        return;
      }
    });
    Vibration.vibrate([0, 1000], true);
    alert("You've reached your destination!");

  }
  stopAlarm = () => {
    this.alarm.stop();
    Vibration.cancel();
    navigator.geolocation.getCurrentPosition(pos => {
      this.setState({origin: pos.coords});
    }, (err) => {
      console.log("Error: ", err);
      if (err.code !== 3) {
        alert("Something seems to have gone wrong. Please try again later.");
      }
    });
    this.setState({alarm: false});
  }
  screenDidFocus = (prop) => {
    this.getSettings();
  }
  getSettings = () => {
    AsyncStorage.getItem('settings').then(settings => {
      settings = settings ? JSON.parse(settings) : {};
      this.setState({radius: settings.radius ? settings.radius : 0.1});
    });
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
    // TODO: add delay to geoSearch call.
    this.geoSearch(this.state.address.toLowerCase())
      .then(res => {
        this.setState({destination: res.results[0].geometry.location});
      })
      .catch(err => {
        console.log("Error: ", err); 
        alert("Something seems to have gone wrong. Please try again later.");
      });
    // TODO: add loading icon while getting res, reuse res currently in state.
  }
  saveAddress = () => {
    if (this.state.address) {
      const savedAddresses = this.state.savedAddresses,
        res = this.state.res;
      if (res.results.length) {
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
      if (res.results.length) {
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
        {this.state.origin && this.state.radius ? <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
          <View style={{flex: 1, width: '100%', display: this.state.focus ? 'none' : 'flex'}}>
            <Map startAlarm={this.startAlarm} radius={this.state.radius} origin={this.state.origin} destination={this.state.destination ? {latitude: this.state.destination.lat, longitude: this.state.destination.lng} : null} />
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
                  <Icon name='ios-search-outline' size={32} color="white" />
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
              <View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, borderRadius: 12}}>
                <Icon name='md-settings' size={38} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View> : this.state.alarm ? <View>
          <TouchableOpacity onPress={this.stopAlarm}>
            <Icon name='ios-close' size={64} color="white" />
          </TouchableOpacity>
        </View> : <View style={{flex: 1, width: "100%", backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
          <Text style={{fontSize: 32}}>Loading...</Text>
        </View>}
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