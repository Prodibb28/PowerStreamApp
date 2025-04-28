import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Button from '../components/Button';
import COLORS from '../../conts/colors';
const MainAppScreen = () => {
  const { logout, userData } = useContext(AuthContext);

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
    <View style={style.container}>
      <Text>Bienvenido {userData?.nombre}</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
    container: {
        paddingTop:50,
        paddingHorizontal:35     
    }
});

export default MainAppScreen;
