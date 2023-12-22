import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function SeekerEditProfile({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [surePassword, setSurePassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    };

    getAccessToken();
  }, []);

  // Function to check if the current password matches the old password
  const currentPasswordsMatch = () => {
    if (currentPassword === '') {
      return null;
    } else {
      return currentPassword === oldPassword;
    }
  };

  // Function to check if the new passwords match
  const passwordsMatch = () => {
    if (surePassword === '') {
      return null;
    } else {
      return newPassword === surePassword;
    }
  };

  // Function to check if the form is disabled
  const isDisabled =
    (currentPassword === '' && newPassword !== '') ||
    (currentPassword !== '' && newPassword === '') ||
    newPassword !== surePassword ||
    (currentPassword !== oldPassword && currentPassword !== '');

  const handleSave = () => {
    if (isDisabled) {
      // Handle invalid input or display an error message
      Alert.alert('Invalid input. Please check your data.');
    } else {
      if (!accessToken) {
        Alert.alert('Access token not found. Please log in.');
        return;
      }

      // Send a PATCH request to update the profile with the access token in the headers
      fetch('http://192.168.1.50:5000/seeker/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          currentPassword,
          newPassword,
        }),
      })
        .then(res => {
          if (!res.ok) {
            console.error('Response status code:', res.status);
            throw new Error('Network response was not ok');
          }

          Alert.alert('Profile updated successfully');
        })
        .catch(error => {
          console.error(error);
          // Handle errors here, e.g., set an error message for the user.
          Alert.alert('Failed to update profile');
        });
    }
  };

  useEffect(() => {
    if (!accessToken) {
      return; // If access token is not available, don't make the request
    }

    // Fetch user profile data using the access token
    fetch('http://192.168.1.50:5000/seeker/api/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(results => {
        setName(results.seeker.seeker_name);
        setEmail(results.seeker.seeker_email);
        setPhone(results.seeker.seeker_phone);
        setAddress(results.seeker.seeker_address);
        setOldPassword(results.seeker.seeker_password);
      })
      .catch(error => {
        console.error('Profile Fetch Error:', error);
        setError(error.message);
      });
  }, [accessToken]);

  return (
    <View style={styles.inner}>
      <View style={styles.header}>
        {/* Arrow Icon */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
            backgroundColor: 'transparent', // Set the background color to transparent
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image source={require('../../../assets/image/arrow.png')} />
        </TouchableOpacity>

        {/* Purple Background */}
        <Image source={require('../../../assets/image/mask-group.png')} />

        {/* White Background */}
        <Image
          source={require('../../../assets/image/picture.png')}
          style={{
            position: 'absolute',
            top: 110,
            left: '49%',
            transform: [{translateX: -50}],
          }}
        />

        {/* Camera Icon */}
        <TouchableOpacity
          onPress={() => {
            alert('Change profile picture');
          }}
          style={{
            position: 'absolute',
            top: 145,
            left: 185,
          }}>
          <Image source={require('../../../assets/image/camera.png')} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            color: 'white',
            position: 'absolute',
            marginTop: 61,
            alignSelf: 'center',
            fontWeight: 600,
          }}>
          Change your Profile
        </Text>
      </View>
      <KeyboardAwareScrollView>
        <View style={StyleSheet.compose(styles.btnContainer, {bottom: 15})}>
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
                style={StyleSheet.compose(styles.input, {color: 'grey'})}
                value={name}
                editable={false}
              />
            </View>
            <View style={styles.vector1}></View>
            <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
              New Phone
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
                placeholder="Enter Phone Number"
              />
            </View>
            <View style={styles.vector1}></View>
            <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
              New Email
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
              New Address
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
                placeholder="Enter your Address"
              />
            </View>

            <View style={styles.vector1}></View>
            <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
              Change Password
            </Text>
            <View style={[styles.inputContainer, {marginBottom: -20}]}>
              <Image
                source={require('../../../assets/image/key.png')}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                secureTextEntry
                value={currentPassword}
                onChangeText={text => setCurrentPassword(text)}
                placeholder="Enter your current password"
              />
            </View>

            <View style={{marginBottom: 5, marginLeft: 30}}>
              {currentPasswordsMatch() === null ? (
                <Text style={{color: 'white'}}>
                  Start typing in the retype password
                </Text>
              ) : currentPasswordsMatch() ? (
                <Text style={{color: '#6E6BE8'}}>Correct Current Password</Text>
              ) : (
                <Text style={{color: '#F7658B'}}>Wrong Current Password</Text>
              )}
            </View>

            <View style={styles.vector1}></View>
            <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
              New Password
            </Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../../../assets/image/key.png')}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                secureTextEntry
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
                placeholder="Enter your new password"
              />
            </View>

            <View style={styles.vector1}></View>
            <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
              Retype your New Password
            </Text>
            <View style={[styles.inputContainer, {marginBottom: -20}]}>
              <Image
                source={require('../../../assets/image/key.png')}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                secureTextEntry
                value={surePassword}
                onChangeText={text => setSurePassword(text)}
                placeholder="Retype your new password"
              />
            </View>
            <View style={{marginBottom: 5, marginLeft: 30}}>
              {passwordsMatch() === null ? (
                <Text style={{color: 'white'}}>
                  Start typing in the retype password
                </Text>
              ) : passwordsMatch() ? (
                <Text style={{color: '#6E6BE8'}}>Passwords match</Text>
              ) : (
                <Text style={{color: '#F7658B'}}>Passwords do not match</Text>
              )}
            </View>
            <View>
              <TouchableOpacity
                disabled={isDisabled}
                onPress={handleSave}
                style={[
                  styles.button,
                  {
                    backgroundColor: '#583EF2',
                    opacity: isDisabled ? 0.5 : 1,
                  },
                ]}>
                <Text style={[styles.buttonText, {color: 'white'}]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#6E6BE8',
    height: 196,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    marginBottom: 43,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    justifyContent: 'space-around',
    padding: 25,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
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
  vector1: {
    width: '100%',
    height: 2,
    backgroundColor: '#EAEAFF',
    marginBottom: 2,
  },
});
