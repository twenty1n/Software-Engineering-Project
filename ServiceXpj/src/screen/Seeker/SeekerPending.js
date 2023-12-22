import React, {useEffect, useState} from 'react';
import {
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SeekerPending({route}) {
  const {service_id, provider_id, service_title, service_cost, providername} =
    route.params;

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
        // Fetch reservation data from the server
        const response = await fetch(
          'http://192.168.1.50:5000/seeker/reservation',
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

        // Parse the response data
        const resData = await response.json();

        if (resData.length === 0) {
          console.warn('No reservations found');
          return;
        }

        // Extract details from the most recent reservation
        const mostRecentReservation = resData[0];

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

  const handleNextButton = () => {
    navigation.navigate('SeekerSuccesspage', {
      provider_id,
      service_id,
      service_title,
      service_cost,
      providername,
      reservation_time: time,
      reservation_date: date,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <ArrowLeftIcon size={20} color="#6E6BE8" />
      </TouchableOpacity>

      <Text style={styles.heading}>Pending your booking</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleNextButton}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
      <Image
        style={{top: 255, zIndex: -1}}
        source={require('../../../assets/image/Order_3.png')}
      />
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
    // color: '#000',
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
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F126B',
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
    top: 330,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});
