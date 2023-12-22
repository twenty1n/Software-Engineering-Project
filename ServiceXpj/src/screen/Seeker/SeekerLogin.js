import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SeekerLogin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Function to handle the login process
  const handleLogin = async () => {
    if (email && password) {
      try {
        // Make an API request to check credentials
        const response = await axios.post(
          'http://192.168.1.50:5000/seeker/login',
          {
            email,
            password,
          },
        );

        console.log('Response:', response.data);

        if (response.data.access_token) {
          // Successful login, store tokens and navigate to the 'ProviderHome' screen
          const accessToken = response.data.access_token;
          const refreshToken = response.data.refresh_token;

          // Store tokens securely using AsyncStorage or some other secure storage method
          await AsyncStorage.setItem('access_token', accessToken);
          await AsyncStorage.setItem('refresh_token', refreshToken);

          if (response.status === 200) {
            const userInfo = response.data;

            // Set the axios default headers to include the access token for future requests
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${accessToken}`;

            navigation.navigate('SeekerHome', {
              accessToken: accessToken,
              userInfo: userInfo,
            });
          } else {
            console.log('Failed to fetch user information.');
          }
        } else {
          console.log('Invalid email or password. Please try again.');
          Alert.alert('Error', 'Invalid email or password. Please try again.');
        }
      } catch (err) {
        console.log('API request error:', err);
        Alert.alert('Error', 'API request error. Please try again.');
      }
    } else {
      console.log('Please fill in both email and password.');
      Alert.alert('Error', 'Please fill in both email and password.');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
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
            }}>
            <ArrowLeftIcon size={20} color="#6E6BE8" />
          </TouchableOpacity>
          <View style={styles.container}>
            <Image
              source={require('../../../assets/image/logo_icon.png')}
              style={styles.image}
            />
            <Text style={styles.textSignUp}>Login</Text>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.gridContainer}>
        <View style={{marginTop: 8}}>
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
              placeholder="Enter your Email"
            />
          </View>
          <View style={styles.vector1}></View>
          <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
            Password
          </Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/image/key.png')}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={text => setPassword(text)}
              placeholder="Enter your Password"
            />
          </View>
          <View style={styles.vector1}></View>
          <View style={styles.buttonMargin}></View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.textWelcome}>Welcome back!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    width: 375,
    height: 290,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderWidth: 1,
    borderColor: '#EAEAFF',
    position: 'absolute',
    left: 206,
    top: 450,
    transform: [{translateX: -187.5}, {translateY: -187.5}],
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 95,
    marginTop: 65,
  },
  textSignUp: {
    color: '#1F126B',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textWelcome: {
    color: '#78789D',
    fontSize: 14,
    lineHeight: 24,
    marginTop: 10,
    bottom: 1,
    textAlign: 'center',
  },
  input: {
    padding: 10,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 20,
    marginBottom: 10,
  },
  vector1: {
    width: '100%',
    height: 2,
    backgroundColor: '#EAEAFF',
    marginBottom: 2,
  },
  button: {
    width: 268,
    height: 50,
    backgroundColor: '#583EF2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#583EF2',
  },
  buttonMargin: {
    marginBottom: 20,
  },
  datePicker: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 0,
    marginBottom: 8,
  },
});
