import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SeekerFilterCategory({navigation, route}) {
  const [allService, setAllService] = useState([]);
  const [error, setError] = useState(null);
  const ItemSeparator = () => (
    <View
      style={{
        height: 20,
        backgroundColor: 'transparent',
      }}
    />
  );

  // Helper function to fetch data from the backend
  const fetchData = async token => {
    try {
      const response = await fetch(
        `http://192.168.1.50:5000/seeker/filter-category/${route.params?.type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const results = await response.json();
      console.log('Profile Results:', results);
      setAllService(results);
    } catch (error) {
      console.error('Profile Fetch Error:', error);
      setError(error.message);
    }
  };

  // Function to fetch profile data
  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log('Access Token:', token);
      if (!token) {
        throw new Error('Access token not found');
      }
      fetchData(token);
    } catch (error) {
      console.error('Fetch Profile Data Error:', error);
      setError(error.message);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fetch data when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [navigation]),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SeekerBookingDetail', {
          service_id: item.service_id,
        })
      }>
      <View style={styles.bookingDetails}>
        <View style={{marginTop: 10}} />
        <Text style={styles.bookingHeader}>{item.service_title}</Text>
        <Text style={styles.detailsHeader}>Service Cost</Text>
        <Text>{item.service_cost}</Text>
        <View style={{marginTop: 20}} />
        <Text style={styles.detailsHeader}>Service Description</Text>
        <Text>{item.service_description}</Text>
        <View style={{marginTop: 20}} />
      </View>
    </TouchableOpacity>
  );

  // Rendered when there's an error
  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <ArrowLeftIcon size={20} color="#6E6BE8" />
      </TouchableOpacity>

      <Text style={styles.heading}>{route.params?.type}</Text>
      <FlatList
        data={allService}
        renderItem={renderItem}
        keyExtractor={item =>
          item.service_id ? item.service_id.toString() : 'default_key'
        }
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    width: 27,
    height: 27,
    left: 20,
    top: 40,
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6E6BE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'relative',
    marginBottom: 30,
    marginTop: 20,
    color: '#1F126B',
  },
  bookingDetails: {
    borderColor: 'white',
    backgroundColor: '#E6EAFF',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 10,
    borderWidth: 2.5,
    alignSelf: 'center',
    width: 350,
  },
  bookingHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F126B',
  },
  detailsHeader: {
    fontWeight: 'bold',
    color: '#1F1F39',
    marginBottom: 4,
  },
});
