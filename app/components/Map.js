import React from 'react';
import { View, WebView, StyleSheet } from 'react-native';

export default class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      origin: {}
    }
  }
  componentDidMount = () => {
    console.log("component mounted");
    this.props.passWebView(this.webView);
  }
  handleWebViewLoad = () => {
    navigator.geolocation.watchPosition(pos => {
      this.setState({origin: pos.coords}, () => {
        this.webView.postMessage(JSON.stringify({
          type: 'origin',
          origin: this.state.origin,
        }));
      });
    }, this.handleGeolocationError, {
      enableHighAccuracy: this.props.enableHighAccuracy,
      // distanceFilter: this.state.distanceFilter,
    });
  }
  receiveWebViewMessage = (data) => {
    console.log("message received");
    data = JSON.parse(data.nativeEvent.data);
    switch (data.type) {
      case 'arrived':
       console.log("we have arrived");
        this.props.startAlarm();
        break;
      case 'alert':
        alert(data.message);
        break;
      case 'message':
        console.log("Message: " + data.message);
        break;
    }
  }
  handleGeolocationError = (err) => {
    console.log("Error: " + JSON.stringify(err));
  }
  handleWebViewError = (err) => {
    console.log("Error: " + JSON.stringify(err));
  }
  render() {
    return (
      <View style={styles.webView}>
        <WebView
          style={{flex: 1}}
          source={require('./chime/index.html')}
          ref={webView => this.webView = webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoad={this.handleWebViewLoad}
          onMessage={this.receiveWebViewMessage}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    width: '85%',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    height: '100%',
  },
});