import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import Loader from '../components/Loader';
import COLORS from '../../conts/colors';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de tener este import

const ElectricalData = () => {
  const { electricalData, logout, userData } = useContext(AuthContext);

  const [loaded] = useFonts({
    'OnestSemiBold': require('../../../assets/fonts/OnestSemiBold.ttf'),
    'OnestBlack': require('../../../assets/fonts/OnestBlack.ttf'),
    'OnestBold': require('../../../assets/fonts/OnestBold.ttf'),
  });

  if (!loaded || !electricalData) {
    return <Loader />;
  }

  const formatValue = (value, unit = '', decimals = 2) =>
    `${parseFloat(value).toFixed(decimals)} ${unit}`;

  return (
    <>
      <View style={styles.headerApp}>
        <Text style={styles.welcome}>
          Bienvenido, {userData?.nombre}!
        </Text>
        <Icon
          name="exit-to-app"
          style={styles.logoutIcon}
          onPress={logout}
        />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Últimas Variables Eléctricas</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Voltaje</Text>
            <Text style={styles.value}>{formatValue(electricalData.voltaje, 'V')}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Corriente</Text>
            <Text style={styles.value}>{formatValue(electricalData.corriente, 'A')}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Potencia Activa</Text>
            <Text style={styles.value}>{formatValue(electricalData.potenciaActiva, 'W')}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerApp: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 15,
    fontFamily: 'OnestSemiBold',
    alignSelf: 'center',
    color: COLORS.black,
  },
  logoutIcon: {
    color: COLORS.dark,
    fontSize: 25,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OnestBold',
    marginBottom: 20,
    color: COLORS.blue,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    fontFamily: 'OnestSemiBold',
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontFamily: 'OnestBlack',
    color: '#000',
  },
});

export default ElectricalData;
