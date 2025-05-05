// src/views/navigation/AppTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ElectricalData from '../screens/ElectricalData';
import COLORS from '../../conts/colors';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false
      }}
    >
        <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
          tabBarLabel: 'Perfil'
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
          tabBarLabel: 'Inicio'
        }}
      />
      <Tab.Screen 
        name="ElectricalData" 
        component={ElectricalData} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="signal-cellular-3" color={color} size={26} />
          ),
          tabBarLabel: 'Variables'
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;