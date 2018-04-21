import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, Slider, AsyncStorage } from 'react-native';
import DefaultSlider from './DefaultSlider';
import MapView, { Circle } from 'react-native-maps';

export default class RadiusSize extends Component {
  constructor() {
    super();
    this.state = {
      origin: null,
      radius: 0
    }
  }
  componentDidMount = () => {
    AsyncStorage.getItem('settings').then(settings => {
      settings = settings ? JSON.parse(settings) : {};
      this.setState({radius: settings.radius ? settings.radius : 0.1});
    });
    navigator.geolocation.getCurrentPosition(pos => {
      this.setState({origin: pos.coords});
    }, (err) => {
      console.log("Error: ", err);
      if (err.code !== 3) {
        alert("Something seems to have gone wrong. Please try again later.");
      }
    });
  }
  componentWillUnmount = () => {
    AsyncStorage.getItem('settings').then(settings => {
      settings = settings ? JSON.parse(settings) : {};
      settings.radius = this.state.radius;
      AsyncStorage.setItem('settings', JSON.stringify(settings));
    });
  }
  handleRadiusChange = (val) => {
    this.setState({radius: val});
  }
  stayCenter = () => {
    this.map.animateToCoordinate(this.state.origin, 0);
  }
  render() {
    return (
        <ImageBackground source={require('../img/background.jpg')} style={styles.imageBackground}>
          <View style={{flex: 0.5, width: '75%', flexDirection: 'column', justifyContent: 'space-evenly'}}>
            <Text style={styles.text}>Configure Radius</Text>
            <Text style={styles.text}>{Number(this.state.radius.toFixed(2)).toLocaleString([], {style: 'decimal'}) + "mi"}</Text>
          </View>
          {this.state.origin && this.state.radius ? <View style={styles.container}>
              <DefaultSlider viewStyle={{borderRadius: 0, borderTopLeftRadius: 25, borderTopRightRadius: 25}} sliderName={"Radius Size"} sliderStyle={{width: 200}} step={0.05} minimumValue={0.05} maximumValue={5.0} value={this.state.radius} onValueChange={this.handleRadiusChange} />
              <MapView
                ref={ref => this.map = ref}
                style={styles.wrapper}
                cacheEnabled
                scrollEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                toolbarEnabled={false}
                zoomControlEnabled={false}
                initialRegion={{
                  latitude: this.state.origin.latitude,
                  longitude: this.state.origin.longitude,
                  latitudeDelta: 0.16135,
                  longitudeDelta: 0.073675,
                }}
                maxZoomLevel={16}
                minZoomLevel={11}
                onRegionChangeComplete={this.stayCenter}
              >
                <Circle
                  zIndex={1}
                  strokeColor={"rgba(51, 51, 51, 0.5)"}
                  strokeWidth={2}
                  fillColor={"rgba(205, 172, 218, 0.5)"}
                  center={this.state.origin}
                  radius={Number(this.state.radius) * 1609.34}
                />
              </MapView>
            </View>: <View style={{flex: 1, width: "75%", backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
            <Text style={{fontSize: 32}}>Loading...</Text>
          </View>}
          <View style={{flex: 0.5}} />
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '75%',
  },
  wrapper: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 32,
    color: "#fff"
  }
});