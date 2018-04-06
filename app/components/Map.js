import React from 'react';
import { View, WebView, StyleSheet } from 'react-native';

export default class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      origin: {}
    }
  }
  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.state.watchId);
  }
  handleWebViewLoad = () => {
    this.props.passWebView(this.webView);
    const watchId = navigator.geolocation.watchPosition(pos => {
      this.setState({origin: pos.coords}, () => {
        this.webView.postMessage(JSON.stringify({
          type: 'origin',
          origin: [this.state.origin.latitude, this.state.origin.longitude],
        }));
      });
    }, (err) => {
      console.log("Error: ", err);
      if (err.code !== 3) {
        alert("Something seems to have gone wrong. Please try again later.");
      }
    });
    // , {
    //   enableHighAccuracy: this.props.enableHighAccuracy,
    //   // distanceFilter: this.state.distanceFilter,
    // });
    this.setState({watchId: watchId});
  }
  receiveWebViewMessage = (data) => {
    console.log("message received");
    data = JSON.parse(data.nativeEvent.data);
    switch (data.type) {
      case 'arrived':
        this.props.startAlarm();
        break;
      case 'message':
        console.log("Message: ", data.message);
        break;
    }
  }
  handleWebViewError = (err) => {
    console.log("Error: ", err);
  }
  render() {
    return (
      <View style={styles.webView}>
        <WebView
          style={{flex: 1}}
          source={require('./chime/index.html')}
          ref={webView => this.webView = webView}
          onLoad={this.handleWebViewLoad}
          onError={this.handleWebViewError}
          onMessage={this.receiveWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          ignoreSslError={true} 
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