// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [electricalData, setElectricalData] = useState(null);

  const login = async (user) => {
    try {
      // Guardar datos en AsyncStorage
      await AsyncStorage.setItem('userToken', 'dummy-token');
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      setUserToken('dummy-token');
      setUserData(user);
    } catch (e) {
      console.log('Login error', e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      setUserToken(null);
      setUserData(null);
    } catch (e) {
      console.log('Logout error', e);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userData');
      
      setUserToken(token);
      setUserData(JSON.parse(user));
      setIsLoading(false);
    } catch (e) {
      console.log('isLoggedIn error', e);
      setIsLoading(false);
    }
  };
  const updateUser = async (newUserData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
      setUserData(newUserData);
    } catch (e) {
      console.log('Error updating user data', e);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isLoading,electricalData,setElectricalData , userToken, userData,  updateUser}}>
      {children}
    </AuthContext.Provider>
  );
};