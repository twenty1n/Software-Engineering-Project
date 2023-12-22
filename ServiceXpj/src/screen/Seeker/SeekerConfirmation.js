import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NextButton from '../../../Navigation/NextButton';

export default function SeekerConfirmation({route}) {
  const {service_id, providername} = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reservation_id, setReservation_id] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        console.log('Access Token:', accessToken);

        if (!accessToken) {
          throw new Error('Access token not found');
        }
        const response = await fetch(
          `http://192.168.1.50:5000/seeker/reservation`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log('Response:', response);

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} - ${response.statusText}`,
          );
        }
        const resData = await response.json();
        const sortedReservations = resData.sort(
          (a, b) => new Date(b.reservation_date) - new Date(a.reservation_date),
        );
        const mostRecentReservation = sortedReservations[0];
        setReservation_id(mostRecentReservation.reservation_id || '');
        setDate(mostRecentReservation.reservation_date || '');
        setTime(mostRecentReservation.reservation_time || '');
        setAddress(mostRecentReservation.seeker_address || '');
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [service_id]);

  const navigation = useNavigation();

  const handleNextButton = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      console.log('Access Token:', accessToken);

      if (!accessToken) {
        throw new Error('Access token not found');
      }

      // Make a PUT request to update the reservation status
      const response = await fetch(
        'http://192.168.1.40:5000/seeker/reservation/updateStatus',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            reservation_id: reservation_id,
            new_status: 'Processing',
          }),
        },
      );

      console.log('Update Status Response:', response);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorBody = await response.json();
          console.error('Error updating status:', response.status, errorBody);
          throw new Error(`Network response was not ok: ${response.status}`);
        } else {
          const errorText = await response.text();
          console.error('Error updating status:', response.status, errorText);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
      }
      const result = await response.json();

      if (result.message) {
        navigation.navigate('SeekerSuccesspage');
      } else {
        console.warn('Status update was not successful');
      }
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <ArrowLeftIcon size={20} color="#6E6BE8" />
      </TouchableOpacity>

      <Text style={styles.heading}>Confirm your booking</Text>

      <View style={styles.bookingDetails}>
        <View style={styles.bookingHeaderRow}>
          <Text style={styles.bookingHeader}>Booking Details</Text>
          <Image
            source={require('../../../assets/image/time.png')}
            style={styles.icon}
          />
        </View>

        <Text style={styles.detailsHeader}>Reservation ID</Text>
        <Text style={styles.detailsText}>{reservation_id}</Text>

        <Text style={styles.detailsHeader}>Working Day</Text>
        <Text style={styles.detailsText}>{date}</Text>

        <Text style={styles.detailsHeader}>Start Time</Text>
        <Text style={styles.detailsText}>{time}</Text>

        <Text style={styles.detailsHeader}>Address</Text>
        <Text style={styles.detailsText}>{address}</Text>

        <Text style={styles.detailsHeader}>Domestic Worker</Text>
        <Text style={styles.detailsText}>{providername}</Text>
      </View>

      <View style={styles.ConfirmContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNextButton}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    width: 27,
    height: 27,
    left: 20,
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6E6BE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 45,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 40,
    color: '#1F126B',
  },
  bookingDetails: {
    borderColor: '#EAEAFF',
    padding: 30,
    borderRadius: 10,
    borderWidth: 1,
    width: 300,
  },
  bookingHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#583EF2',
  },
  detailsHeader: {
    fontWeight: 'bold',
    color: '#38385E',
  },
  detailsText: {
    marginBottom: 10,
  },
  bookingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 17,
    height: 17,
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
  ConfirmContainer: {
    marginTop: 280,
  },
});
