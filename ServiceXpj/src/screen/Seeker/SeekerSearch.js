import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SeekerFilterCategory({navigation, route}) {
  const [allService, setAllService] = useState([]);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);

  const ItemSeparator = () => (
    <View
      style={{
        height: 20,
        backgroundColor: 'transparent',
      }}
    />
  );

  const fetchData = async token => {
    try {
      const type = route.params?.type || 'default';

      const response = await axios.get(
        `http://192.168.1.50:5000/seeker/filter-category/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAllService(response.data);
    } catch (error) {
      console.error('Profile Fetch Error:', error);
      setError(error.message);
    }
  };

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

  useEffect(() => {
    fetchProfileData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [navigation]),
  );

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.50:5000/seeker/searchService?searchText=${encodeURIComponent(
          searchText,
        )}`,
      );

      const results = response.data;
      setSearchResults(results);
      setIsSearchEmpty(results.length === 0);
    } catch (error) {
      console.error(error);
    }
  };

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
      <Text
        style={{
          fontFamily: 'Arial',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1F126B',
          alignSelf: 'center',
          top: 30,
        }}>
        Pick a service
      </Text>

      <Text style={styles.heading}>{route.params?.type}</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Service..."
          placeholderTextColor="#78789D"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={handleSearch}>
          <View
            style={{
              top: 10,
            }}>
            <Image source={require('../../../assets/image/search.png')} />
          </View>
        </TouchableOpacity>
      </View>

      {isSearchEmpty && (
        <View style={styles.emptyMessage}>
          <Text>No services found</Text>
        </View>
      )}

      <FlatList
        data={
          isSearchEmpty
            ? []
            : searchResults.length > 0
            ? searchResults
            : allService
        }
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
    marginTop: 5,
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
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#6E6BE8',
  },
  emptyMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
