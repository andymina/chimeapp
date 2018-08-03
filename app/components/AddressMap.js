import React from 'react';
import Map from './Map';
import { StyleSheet, ImageBackground, View, WebView, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, Slider, SliderIOS, TextInput, StatusBar, AsyncStorage, Vibration } from 'react-native';
import SearchBar from './SearchBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Sound from 'react-native-sound';
import Communications from 'react-native-communications';

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
    AsyncStorage.getItem('savedAddresses').then((savedAddresses) => {
      savedAddresses = savedAddresses ? JSON.parse(savedAddresses) : [];
      this.setState({savedAddresses: savedAddresses});
    });
    AsyncStorage.getItem('currentAlarm').then((currentAlarm) => {
      currentAlarm = currentAlarm ? JSON.parse(currentAlarm) : {};
      this.setState({currentAlarm: currentAlarm});
      if (currentAlarm.userUploaded) {
        AsyncStorage.getItem('customAlarms').then((customAlarms) => {
          customAlarms = customAlarms ? JSON.parse(customAlarms) : {};
          this.setState({customAlarms: customAlarms});
          this.getSettings();
        });
      } else {
        this.getSettings();
      }
    });
  }
  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.state.watchId);
    if (this.state.alarm) {
      this.alarm.stop();
    }
    this.alarm.release();
    Vibration.cancel();
    this._sub.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  passMap = (map) => {
    this.map = map;
  }
  resetAlarm = (volume) => {
    const name = this.state.currentAlarm ? this.state.currentAlarm.name : 'alarm1';
    const userUploaded = this.state.currentAlarm ? this.state.currentAlarm.userUploaded : false;
    this.setState({alarm: false});
    Sound.setCategory('Playback');
    this.alarm ? this.alarm.reset() : null;
    this.alarm = new Sound(
      userUploaded ? this.state.customAlarms[name].path : `${name}.mp3`,
      userUploaded ? '' : Sound.MAIN_BUNDLE,
      (err) => {
      if (err) {
        console.log("Error: ", err);
        return;
      }
      this.alarm.setNumberOfLoops(-1);
    });
    this.alarm.setVolume(volume ? volume : 1);
  }
  startAlarm = () => {
    this.setState({alarm: true, origin: null, destination: null});
    this.alarm.setVolume(this.alarm.getVolume());
    this.alarm.play(success => {
      if (!success) {
        this.resetAlarm(this.alarm.getVolume());
        return;
      }
    });
    Vibration.vibrate([0, 1000], true);
    alert("You've reached your destination!");
    this.preformAction();
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
      this.resetAlarm(settings.volume);
      this.setState({radius: settings.radius ? settings.radius : 0.1});
    });
  }
  preformAction = () => {
    Communications.text('347-858-1839', "Hi, I'm Carl");
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
      key: "AIzaSyDMJ4sbMxSzd0cdr7i_9W68dL0QkFjySWE"
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
  hoistFocus = (ref) => {
    this.focusCurrentLocation = ref;
    this.forceUpdate();
  }
  render() {
    console.log("this.state.origin", this.state.origin);
    console.log("this.state.radius", this.state.radius);
    console.log(this.focusCurrentLocation);
    return (
      <ImageBackground source={require('../img/background.jpg')} style={styles.imageBackground}>
        <StatusBar barStyle="light-content" />
        {this.state.origin && this.state.radius ? <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
          <View style={{flex: 1, width: '100%', display: this.state.focus ? 'none' : 'flex'}}>
            <Map startAlarm={this.startAlarm} hoistFocus={this.hoistFocus} radius={this.state.radius} origin={this.state.origin} destination={this.state.destination ? {latitude: this.state.destination.lat, longitude: this.state.destination.lng} : null} />
          </View>

          // SearchBar component
          <View style={[styles.searchBar, {flex: this.state.focus ? 0.4 : 0.2,}]}>
            <View style={styles.searchContainer}>
              <View style={styles.searchLeft}>
                <TouchableOpacity style={styles.searchLeft} onPress={this.state.isFavorite ? this.removeAddress : this.saveAddress} disabled={!this.state.address}>
                  {this.state.isFavorite ? <Ionicons name='ios-heart' size={30} color="#941AB7"/> :
                    <Ionicons name='ios-heart-outline' size={30} color="#941AB7" />}
                </TouchableOpacity>
              </View>
              <View style={styles.searchCenter}>
                <TextInput style={styles.searchText} onChangeText={this.handleAddressChange}
                           onFocus={this.handleKeyboardShow} onSubmitEditing={this.state.alarm ? null : this.handleAddressSubmit}
                           placeholder='Where to?'/>
              </View>
              <View style={styles.searchRight}>
                <TouchableOpacity onPress={this.state.alarm ? this.stopAlarm : this.handleAddressSubmit} disabled={!this.state.address}>
                  <Ionicons name='ios-search-outline' size={32} color="#941AB7" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{position: 'absolute', bottom: 0, right: 0, margin: 20}}>
            <TouchableOpacity onPress={this.focusCurrentLocation}>
              <View style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingTop: 10, paddingBottom: 10, paddingLeft: 11, paddingRight: 11, borderRadius: 12}}>
                <MaterialIcons name='my-location' size={30} color="#941AB7" />
              </View>
            </TouchableOpacity>
          </View>
        </View> : this.state.alarm ? <View>
          <TouchableOpacity onPress={this.stopAlarm}>
            <Ionicons name='ios-close' size={64} color="white" />
          </TouchableOpacity>
        </View> : <View style={{flex: 1, width: "100%", backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
          <Text style={{fontSize: 32}}>Loading...</Text>
        </View>}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imageBackground : {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'column',
    padding: 25,
    marginTop: 10,
    marginBottom: 10
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  searchLeft: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCenter: {
    flex: 7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchText: {
    textAlign: 'center',
    width: '92%',
    fontSize: 24,
    color: '#941AB7',
    fontFamily: 'Microsoft Yi Baiti'
  },
  searchRight: {
    flex: 1,
    width: '100%',
    marginRight: '4%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
