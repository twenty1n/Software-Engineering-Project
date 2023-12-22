import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

export default function SeekerSignUp() {
  const navigation = useNavigation();
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Handle date change in the date picker
  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0];
      const [newYear, newMonth, newDay] = formattedDate.split('-');
      setYear(newYear);
      setMonth(newMonth);
      setDay(newDay);
    }
  };

  // Show the date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Handle form submission
  const handleonsubmit = async () => {
    try {
      if (email && password) {
        const birthday = `${year}-${month}-${day}`;

        const userData = {
          name,
          birthday,
          address,
          email,
          phone,
          gender,
          password,
        };

        const response = await axios.post(
          'http://192.168.1.50:5000/seeker/create',
          userData,
        );

        if (response.status === 201) {
          console.log('User registration successful.');
          Alert.alert('Success', 'User registration successful.');
          navigation.navigate('SeekerLogin');
        } else {
          console.log('Failed to create the user.');
          Alert.alert('Error', 'Failed to create the user.');
        }
      } else {
        console.log('Please fill in all required fields.');
        Alert.alert('Error', 'Please fill in all required fields.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 409) {
          console.log('Email already exists.');
          Alert.alert(
            'Error',
            'Email already exists. Please use a different email.',
          );
        } else {
          console.log('Axios request error:', err.message);
          Alert.alert('Error', 'Axios request error. Please try again.');
        }
      } else {
        console.log('Non-Axios error:', err.message);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
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
            <Text style={styles.textSignUp}>Sign up</Text>
            <Text style={styles.textSignUpDetail}>
              Please enter your details to sign up and create an account.
            </Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView style={styles.gridContainer}>
        <View style={{marginTop: 8}}>
          <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
            Your Name
          </Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/image/man.png')}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={text => setname(text)}
              placeholder="Enter your Full Name"
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
              placeholder="Enter your Email"
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
              placeholder="Enter Phone Number"
            />
          </View>
          <View style={styles.vector1}></View>
          <Text style={{color: 'black', marginLeft: 4, fontWeight: 'bold'}}>
            Date Of Birth
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../../assets/image/BD3.png')}
              style={styles.icon}
            />
            <TouchableOpacity onPress={showDatepicker}>
              <Text style={styles.input}>{`${year}-${month}-${day}`}</Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
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
              placeholder="Enter your Address"
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
            <Picker
              style={styles.picker}
              selectedValue={gender}
              onValueChange={itemValue => setGender(itemValue)}>
              <Picker.Item
                label="Select Gender"
                value=""
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Male"
                value="Male"
                style={styles.pickerItem}
              />
              <Picker.Item
                label="Female"
                value="Female"
                style={styles.pickerItem}
              />
            </Picker>
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
          <TouchableOpacity style={styles.button} onPress={handleonsubmit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SeekerLogin')}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    width: 375,
    height: 539,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderWidth: 1,
    borderColor: '#EAEAFF',
    position: 'absolute',
    left: '50%',
    top: '53%',
    paddingTop: 8,
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
  textSignUpDetail: {
    color: '#78789D',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    padding: 10,
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
    marginBottom: 10,
    paddingBottom: 8,
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
  picker: {
    flex: 1,
    color: 'black',
    height: 50,
  },
  pickerItem: {
    fontSize: 16,
  },
});
