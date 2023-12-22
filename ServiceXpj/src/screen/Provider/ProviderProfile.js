import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProviderProfile({navigation}) {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState(null);

  // Function to fetch provider profile data from the server
  const fetchData = async token => {
    try {
      const response = await fetch(
        'http://192.168.1.50:5000/provider/api/profile',
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

      setname(results.provider.provider_name);
      setEmail(results.provider.provider_email);
      setPhone(results.provider.provider_phone);
      setAddress(results.provider.provider_address);
      setGender(results.provider.provider_gender);
    } catch (error) {
      console.error('Profile Fetch Error:', error);
      setError(error.message);
    }
  };

  // Function to fetch profile data when the component mounts
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
  }, []); // Fetch data when the component mounts

  // Fetch data when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [navigation]),
  );
  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Remove the access token from AsyncStorage
      await AsyncStorage.removeItem('access_token');
      // Navigate to the Onboarding screen
      navigation.navigate('OnboardingScreen');
    } catch (error) {
      console.error('Logout Error:', error);
      setError(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white'}}
      behavior="padding">
      <View style={styles.header}>
        {/* Arrow Icon */}
        <TouchableOpacity
          onPress={() => navigation.goBack('ProviderHome')}
          style={{
            width: 27,
            height: 27,
            left: 20,
            top: 40,
            position: 'absolute',
            zIndex: 1,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'white',
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image source={require('../../../assets/image/arrow.png')} />
        </TouchableOpacity>

        {/* Purple Background */}
        <Image source={require('../../../assets/image/mask-group.png')} />

        {/* White Background */}
        <Image
          source={require('../../../assets/image/profile.png')}
          style={{
            position: 'absolute',
            top: 116,
            left: '49%',
            transform: [{translateX: -50}],
          }}
        />
        <Text
          style={{
            fontSize: 24,
            color: 'white',
            position: 'absolute',
            marginTop: 61,
            alignSelf: 'center',
            fontWeight: 600,
          }}>
          Your Profile
        </Text>
        <View style={{position: 'absolute', top: 43, right: 30}}>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={25}
              color="white"
              style={{padding: 5}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={[styles.gridContainer, {flex: 1}]}>
        <View>
          <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
            Your Name
          </Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/image/man.png')}
              style={styles.icon}
            />
            <TextInput
              style={StyleSheet.compose(styles.input, {color: 'black'})}
              value={name}
              editable={false}
            />
          </View>

          <View style={styles.vector1}></View>
          <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
            Phone
          </Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/image/phone.png')}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={text => setPhone(text)}
              editable={false}
            />
          </View>
          <View style={styles.vector1}></View>
          <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
            Email
          </Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/image/mail.png')}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={text => setEmail(text)}
              editable={false}
            />
          </View>
        </View>
        <View style={styles.vector1}></View>
        <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
          Address
        </Text>
        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/image/home.png')}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={text => setAddress(text)}
            editable={false}
          />
        </View>
        <View style={styles.vector1}></View>
        <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
          Gender
        </Text>
        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/image/gender.png')}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={text => setGender(text)}
            editable={false}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProviderEditProfile')}
            style={[styles.button, {backgroundColor: '#583EF2'}]}>
            <Text style={[styles.buttonText, {color: 'white'}]}>Edit</Text>
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
    top: '58%',
    transform: [{translateX: -187.5}, {translateY: -187.5}],
  },
  vector1: {
    width: '100%',
    height: 2,
    backgroundColor: '#EAEAFF',
    marginBottom: 2,
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#6E6BE8',
    height: 196,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
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
