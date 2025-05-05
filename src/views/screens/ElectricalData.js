// src/views/screens/ElectricalData.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ElectricalData = () => (
  <View style={styles.container}>
    <Text>Configuración</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ElectricalData;