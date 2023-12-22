import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';

export default function SeekerBooking({route}) {
  const {service_id, provider_id, service_title, service_cost, providername} =
    route.params;
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  // Function to handle the reservation process
  const handleMakeReservation = async () => {
    try {
      // Check if date and time are selected
      if (!date || !time) {
        Alert.alert(
          'Error',
          'Please select both date and time before making a reservation.',
        );
        return;
      }

      // Check if required data is available
      if (!provider_id || !service_id || !service_title || !service_cost) {
        Alert.alert(
          'Error',
          'Missing provider data. Please go back and try again.',
        );
        return;
      }

      // Retrieve access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem('access_token');
      if (!accessToken) {
        Alert.alert('Error', 'Access token not found');
        return;
      }

      console.log('Making Reservation with Data:', {
        provider_id,
        service_id,
        reservation_time: time,
        reservation_date: date,
      });

      // Make a network request to the server to make a reservation
      const response = await fetch(
        'http://192.168.1.50:5000/seeker/makeReservation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            provider_id,
            service_id,
            reservation_time: time,
            reservation_date: date,
          }),
        },
      );

      console.log('Reservation Response:', response);

      // Handle response from the server
      if (!response.ok) {
        Alert.alert('Error', 'Network response was not ok');
        return;
      }

      const result = await response.json();
      Alert.alert('Success', result.message);

      navigation.navigate('SeekerPending', {
        provider_id,
        service_id,
        service_title,
        service_cost,
        providername,
        reservation_time: time,
        reservation_date: date.toISOString(),
      });
    } catch (error) {
      console.error('Reservation Error:', error);
      Alert.alert('Error', 'Failed to make a reservation. Please try again.');
    }
  };

  // JSX to render the component
  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView scrollEnabled={false}>
        {/* Header section */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeftIcon size={20} color="white" />
          </TouchableOpacity>
          <Image
            source={require('../../../assets/image/mask-group.png')}
            style={styles.backgroundImage}
          />
          <Text style={styles.heading}>Pick a service</Text>
          {/* Service details section */}
          <View
            style={{
              width: 335,
              height: 143,
              borderRadius: 15,
              marginBottom: 20,
              marginLeft: 35,
              marginTop: 45,
              top: 20,
            }}>
            {/* Cost and title */}
            <View
              style={{
                height: 35,
                width: 50,
                borderRadius: 10,
                borderColor: 'white',
                borderWidth: 1,
                padding: 10,
                marginBottom: 20,
                marginLeft: 175,
                top: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  lineHeight: 16,
                }}>
                {service_cost}
              </Text>
            </View>
            <Text
              style={{
                color: 'white',
                fontSize: 22,
                fontWeight: 'bold',
                lineHeight: 28,
                marginLeft: 175,
                top: 5,
              }}>
              {service_title}
            </Text>
            {/* Service image */}
            <View
              style={{
                width: 143,
                height: 143,
                borderRadius: 15,
                marginBottom: 20,
                bottom: 80,
              }}>
              <Image source={require('../../../assets/image/cleaning.png')} />
            </View>
          </View>
        </View>
        {/* Worker details section */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SeekerWorkerProfile', {
              provider_id,
            })
          }>
          <View style={styles.container}>
            <View style={styles.gridContainer}>
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
          </View>
        </TouchableOpacity>
        {/* Date and time selection section */}
        <View style={{top: 45}}>
          <Text style={{color: '#38385E', marginLeft: 30, fontWeight: 'bold'}}>
            Working day
          </Text>
          {/* Date selection */}
          <View style={styles.inputContainer}>
            <View>
              <TouchableOpacity
                style={styles.buttonDate}
                onPress={() => setOpen(true)}>
                <Text style={styles.input}>{date.toDateString()}</Text>
              </TouchableOpacity>
              {/* DatePicker component */}
              <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
          </View>
          <View style={styles.vector1}></View>
          {/* Time selection */}
          <Text style={{color: '#38385E', marginLeft: 30, fontWeight: 'bold'}}>
            Start time
          </Text>
          <View>
            <View style={{paddingHorizontal: 20}}>
              {/* Picker for selecting time */}
              <Picker
                style={styles.picker}
                selectedValue={time}
                onValueChange={itemValue => setTime(itemValue)}>
                <Picker.Item
                  label="Select Time"
                  value=""
                  style={styles.pickerItem}
                />
                <Picker.Item
                  label="Morning"
                  value="Morning"
                  style={styles.pickerItem}
                />
                <Picker.Item
                  label="Evening"
                  value="Evening"
                  style={styles.pickerItem}
                />
              </Picker>
            </View>
          </View>
          <View style={styles.vector1}></View>
        </View>

        {/* Container for Confirm button */}
        <View style={styles.ConfirmContainer}></View>
      </ScrollView>

      {/* Next button to trigger reservation */}
      <TouchableOpacity style={styles.button} onPress={handleMakeReservation}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      {/* Background image */}
      <Image
        style={{right: 12, top: 20, zIndex: -1}}
        source={require('../../../assets/image/Order_2.png')}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  heading: {
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    top: 55,
  },
  vector1: {
    width: '85%',
    height: 2,
    backgroundColor: '#EAEAFF',
    marginBottom: 2,
    left: 30,
  },
  input: {
    padding: 10,
    color: 'black',
    borderRadius: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: '#583EF2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 95,
    left: 95,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  ConfirmContainer: {
    marginTop: 280,
  },
  backgroundImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    position: 'absolute',
  },
  gridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAFF',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginBottom: 2,
  },
  container: {
    flex: 1,
    padding: 15,
    top: 40,
  },
  picker: {
    flex: 1,
    color: 'black',
    height: 50,
  },
  pickerItem: {
    fontSize: 16,
  },
  buttonDate: {
    width: 200,
    height: 50,
    borderRadius: 14,
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
    zIndex: 1,
  },
});
