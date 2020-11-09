import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Slider from './CustomComponents/Slider';

export default function App() {

  return (
    <View style={styles.container}>
      <Slider />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }

});
