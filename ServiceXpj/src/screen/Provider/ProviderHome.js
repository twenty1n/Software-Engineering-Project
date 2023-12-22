import {
  StyleSheet, 
  Text, 
  View, 
  Image, 
  FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProviderHome() {
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  // Function to fetch services data from the server
  const fetchData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');

      if (accessToken) {
        const endpoint = 'http://192.168.1.50:5000/provider/api/getservices';
        console.log('Fetching data from:', endpoint); 

        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
        const response = await axios.get(endpoint);

        if (response.status === 200) {
          const servicesData = response.data.services;
          setServices(servicesData);
        } else {
          console.error(
            `Request failed with status code ${response.status}`,
            response.data,
          );
          setError(`Request failed with status code ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    }
  };

  // useEffect to fetch data when the screen gains focus
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData(); 
    });

    // Clean up the subscription when the component unmounts
    return unsubscribeFocus;
  }, [navigation]);

  // renderItem function to render each service item in FlatList
  const renderItem = ({item}) => (
    <View style={styles.serviceContainer}>
      <View>
        <Text style={styles.textHeader}>Title</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.textDetail}>{item.service_title}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.textHeader}>Description</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.textDetail}>{item.service_description}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.textHeader}>Cost</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.textDetail}>{item.service_cost}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.textHeader}>Category</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.textDetail}>{item.category_title}</Text>
        </View>
      </View>

      <View style={styles.vector1}></View>
    </View>
  );

  // Add unique keys based on the array index
  const servicesWithKeys = services.map((service, index) => ({
    ...service,
    service_id: `SV${index + 1}`, // Using index + 1 to avoid SV0
  }));

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.backgroundImage}
          source={require('../../../assets/image/mask-group.png')}
        />
        <View style={{flexDirection: 'row', gap: 74, justifyContent: 'center'}}>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 24,
                color: 'white',
                marginBottom: 10,
                marginTop: 69,
                fontWeight: 600,
                left: 35,
                bottom: 15,
              }}>
              Hi Provider,
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: 400,
                paddingBottom: 25,
                left: 33,
                bottom: 15,
              }}>
              What services would you like to add?
            </Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#AEAAF8',
              borderBottomLeftRadius: 111.1,
              borderBottomRightRadius: 111.1,
              borderTopLeftRadius: 11.1,
              borderTopRightRadius: 111.1,
              marginTop: 69,
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 15,
            }}>
            <Image source={require('../../../assets/image/menu.png')}></Image>
          </View>
        </View>
        <Text
          style={{
            fontSize: 24,
            color: 'black',
            fontWeight: 600,
            left: 35,
            top: 75,
          }}>
          My Service
        </Text>
      </View>
      <View style={styles.container2}>
        <FlatList
          data={servicesWithKeys}
          renderItem={renderItem}
          keyExtractor={item => item.service_id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  container2: {
    flex: 1,
    top: 100,
    left: 45,
  },
  header: {
    backgroundColor: '#6E6BE8',
    height: 237,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  buttonProfile: {
    width: 50,
    height: 50,
    backgroundColor: '#AEAAF8',
    borderBottomLeftRadius: 111.1,
    borderBottomRightRadius: 111.1,
    borderTopLeftRadius: 11.1,
    borderTopRightRadius: 111.1,
    marginTop: 69,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    width: 375,
    height: 280,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderWidth: 1,
    borderColor: '#EAEAFF',
    position: 'absolute',
    left: '50%',
    top: '60%',
    transform: [{translateX: -187.5}, {translateY: -187.5}],
  },
  vector1: {
    width: '80%',
    height: 2,
    backgroundColor: '#EAEAFF',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#78789D',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textHeader: {
    color: '#38385E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textDetail: {
    color: '#78789D',
    marginBottom: 10,
    width: '80%',
  },
  backgroundImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    position: 'absolute',
  },
});
