import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import geolib from 'geolib';
import MapView, { Marker, Circle } from 'react-native-maps';

export default class Map extends React.Component {
  componentDidMount = () => {
    this.props.hoistFocus(this.focusCurrentLocation);
  }
  componentWillReceiveProps = (nextProps) => {
    if (JSON.stringify(nextProps.radius) !== JSON.stringify(this.props.radius) || JSON.stringify(nextProps.origin) !== JSON.stringify(this.props.origin) || JSON.stringify(nextProps.destination) !== JSON.stringify(this.props.destination)) {
      if (nextProps.origin && nextProps.destination) {
        if (geolib.getDistance(nextProps.origin, nextProps.destination) < Number(nextProps.radius) * 1609.34) {
          this.props.startAlarm();
        }
      }
      if (this.map) {
        if (nextProps.destination) {
          this.map.fitToCoordinates([nextProps.origin, nextProps.destination], {
            edgePadding: {
              top: 35,
              right: 35,
              bottom: 35,
              left: 35,
            },
            animated: true
          });
        }
      }
    }
  }
  focusCurrentLocation = () => {
    this.map.animateToCoordinate(this.props.origin, 0);
  }
  render() {
    // On iOS read docs for showUserLocation.
    // Recenter button
    return (
      <MapView
        ref={ref => this.map = ref}
        style={styles.wrapper}
        initialRegion={{
          latitude: this.props.origin.latitude,
          longitude: this.props.origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        maxZoomLevel={16}
        // cacheEnabled
        toolbarEnabled={false}
        zoomControlEnabled={false}
        showsCompass={false}
      >
        <Marker
          zIndex={10}
          coordinate={this.props.origin}
        />
        {this.props.destination && <Circle
          zIndex={1}
          strokeColor={"rgba(51, 51, 51, 0.5)"}
          strokeWidth={2}
          fillColor={"rgba(205, 172, 218, 0.5)"}
          center={this.props.destination}
          radius={Number(this.props.radius) * 1609.34}
        />}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height
  },
});