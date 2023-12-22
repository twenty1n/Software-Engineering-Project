import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProviderHome from '../src/screen/Provider/ProviderHome';
import AddService from '../src/screen/Provider/AddService';
import ProviderProfile from '../src/screen/Provider/ProviderProfile';
import ProviderBooking from '../src/screen/Provider/ProviderBooking';

const Tab = createBottomTabNavigator();

const TabProvider = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="ProviderHome"
        screenOptions={{
          headerShown: false,
          style: {height: 75},
          tabBarStyle: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            elevation: 5,
            borderColor: 'white',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            backgroundColor: 'white',
            shadowRadius: 10,
            // shadowOpacity: 0.8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            height: 65,
            top: 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: 500,
            marginBottom: 15,
          },
          tabBarInactiveTintColor: '#B8B8D2',
          tabBarActiveTintColor: '#6E6BE8',
        }}>
        <Tab.Screen
          name="Home"
          component={ProviderHome}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Add Service"
          component={AddService}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Booking"
          component={ProviderBooking}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="calendar" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProviderProfile}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'black',
    shadowOpacity: 100,
    shadowRadius: 150,
  },
});

export default TabProvider;
