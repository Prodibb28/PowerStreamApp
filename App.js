// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/views/screens/LoginScreen';
import RegistrationScreen from './src/views/screens/RegistrationScreen';
import MainAppScreen from './src/views/screens/MainAppScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading, userToken } = React.useContext(AuthContext);

  if (isLoading) {
    return null; // O un componente de carga
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          // Pantallas para usuarios autenticados
          <Stack.Screen name="MainAppScreen" component={MainAppScreen} />
        ) : (
          // Pantallas para usuarios no autenticados
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;