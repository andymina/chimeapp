import React, { Component } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      isFavorite: false,
    }
  }
  render(){
    return (
      <View style={[styles.searchBar, {flex: this.state.focus ? 0.4 : 0.2,}]}>
        <View style={styles.searchContainer}>
          <View style={styles.searchLeft}>
            <TouchableOpacity style={styles.searchLeft} onPress={this.state.isFavorite ? this.removeAddress : this.saveAddress} disabled={!this.state.address}>
              {this.state.isFavorite ? <IonIcons name='ios-heart' size={30} color="#941AB7"/> :
                <IonIcons name='ios-heart-outline' size={30} color="#941AB7" />}
            </TouchableOpacity>
          </View>
          <View style={styles.searchCenter}>
            <TextInput style={styles.searchText} onChangeText={this.handleAddressChange}
                       onFocus={this.handleKeyboardShow} onSubmitEditing={this.state.alarm ? null : this.handleAddressSubmit}
                       placeholder='Where to?'/>
          </View>
          <View style={styles.searchRight}>
            <TouchableOpacity onPress={this.state.alarm ? this.stopAlarm : this.handleAddressSubmit} disabled={!this.state.address}>
              <IonIcons name='ios-search-outline' size={32} color="#941AB7" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
