import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProviderProfile({navigation, route}) {
  const {service_id} = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [providername, setProvidername] = useState('');
  const [providerid, setProviderid] = useState('');
  const [error, setError] = useState(null);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve access token from AsyncStorage
        const accessToken = await AsyncStorage.getItem('access_token');
        console.log('Access Token:', accessToken);
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        // Make a network request to fetch provider details
        const response = await fetch(
          `http://192.168.1.50:5000/seeker/bookingDetails/${service_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log('Response:', response);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response and set state variables
        const results = await response.json();
        console.log('Service Results:', results);

        setTitle(results.provider.service_title);
        setDescription(results.provider.service_description);
        setCost(results.provider.service_cost);
        setProvidername(results.provider.provider_name);
        setProviderid(results.provider.provider_id);
        console.log(providerid);
      } catch (error) {
        console.error('Profile Fetch Error:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white'}}
      behavior="padding">
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftIcon size={20} color="white" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            color: 'white',
            position: 'absolute',
            marginTop: 53,
            alignSelf: 'center',
            fontWeight: '600',
            textAlign: 'center', 
            width: '50%', 
          }}>
          {title} Service
        </Text>
      </View>

      <ScrollView style={[styles.gridContainer, {flex: 1}]}>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SeekerWorkerProfile', {
                provider_id: providerid,
              })
            }>
            <View style={styles.nameinputContainer}>
              <Image
                source={require('../../../assets/image/man.png')}
                style={styles.icon}
              />
              <TextInput
                style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}
                value={providername}
                editable={false}
              />
            </View>
          </TouchableOpacity>

          <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
            Service Detail
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.input}>{description}</Text>
          </View>
          <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
            Cost
          </Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/image/money.png')}
              style={styles.icon}
            />
            <TextInput style={styles.input} value={cost} editable={false} />
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SeekerBooking', {
                service_id: service_id,
                provider_id: providerid,
                service_title: title,
                service_cost: cost,
                providername: providername,
              })
            }
            style={[styles.button, {backgroundColor: '#583EF2'}]}>
            <Text style={[styles.buttonText, {color: 'white'}]}>
              Booking this service
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    width: 375,
    height: 500,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{translateX: -187.5}, {translateY: -187.5}],
  },
  input: {
    padding: 10,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 20,
    marginBottom: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 0,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameinputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAFF',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#6E6BE8',
    height: 160,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  backButton: {
    width: 27,
    height: 27,
    left: 20,
    top: 55,
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F4F3FD',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6E6BE8',
  },
});
