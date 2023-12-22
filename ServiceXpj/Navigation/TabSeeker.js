import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import SeekerHome from '../src/screen/Seeker/SeekerHome';
import SeekerHistory from '../src/screen/Seeker/SeekerHistory';
import SeekerProfile from '../src/screen/Seeker/SeekerProfile';

const Tab = createBottomTabNavigator();

const TabSeeker = () => {
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
          component={SeekerHome}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={SeekerHistory}
          options={{
            tabBarIcon: ({color, size}) => (
              <Ionicons name="calendar" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={SeekerProfile}
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

export default TabSeeker;
