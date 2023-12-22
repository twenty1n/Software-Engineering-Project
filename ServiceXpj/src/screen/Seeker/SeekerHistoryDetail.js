import React, {useEffect, useState} from 'react';
import {
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';

export default function ProviderHome({route}) {
  const {reservation_id} = route.params;
  const [workingTime, setWorkingTime] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the access token from AsyncStorage
        const accessToken = await AsyncStorage.getItem('access_token');
        console.log('Access Token:', accessToken);

        if (!accessToken) {
          throw new Error('Access token not found');
        }

        //Make a fetch request with the access token
        const response = await fetch(
          `http://192.168.1.50:5000/seeker/bookingHistoryDetails/${reservation_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log('Response:', response);
        //console.log('Response:', response);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response JSON
        const results = await response.json();
        console.log('results', results);

        if (results && results.length > 0) {
          const firstResult = results[0];
          setWorkingTime(
            `${firstResult.reservation_date} ${firstResult.reservation_time}`,
          );
          setLocation(firstResult.seeker_location || '');
          setNote(firstResult.note || '');
          setCustomerName(firstResult.provider_name || '');
        } else {
          console.error('Invalid server response:', results);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', left: 20, top: 83, borderRadius: 10}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton]}>
          <ArrowLeftIcon size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Purple Background */}
      <Image
        source={require('../../../assets/image/mask-group.png')}
        style={styles.backgroundImage}
      />

      {/* hamburger */}

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Booking Details</Text>
      </View>

      <View style={styles.bookingDetailsContainer}>
        {renderDetailsRow(
          'Working Time:',
          workingTime,
          require('../../../assets/image/time.png'),
        )}
        {renderDetailsRow(
          'Location:',
          location,
          require('../../../assets/image/location.png'),
        )}
        {renderDetailsRow(
          'Provider Name:',
          customerName,
          require('../../../assets/image/man.png'),
        )}
      </View>
    </View>
  );
}

const renderDetailsRow = (header, text, iconSource) => (
  <View style={styles.detailsRow} key={header}>
    <View style={styles.iconContainer}>
      <Image source={iconSource} style={styles.icon} />
      <View>
        <Text style={styles.detailsHeader}>{header}</Text>
        {text ? (
          <Text style={styles.detailsText}>{text}</Text>
        ) : (
          <Text
            style={
              styles.detailsText
            }>{`No ${header.toLowerCase()} added`}</Text>
        )}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    flexDirection: 'column', 
    width: 27,
    height: 27,
    left: 500,
    top: 20,
    position: 'absolute',
    borderRadius: 10,
  },
  backButton: {
    width: 27,
    height: 27,
    left: 20,
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '25%', 
    resizeMode: 'cover',
    zIndex: -1,
  },
  logoImage: {
    position: 'absolute',
    top: 70,
    right: 30,
  },
  header: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 80,
    alignSelf: 'center',
    left: 1,
  },
  bookingDetailsContainer: {
    borderColor: '#EAEAFF',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    width: '80%',
    alignSelf: 'center',
    marginTop: 140,
  },
  detailsRow: {
    marginBottom: 5,
  },
  iconContainer: {
    flexDirection: 'row', 
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  detailsRow: {
    marginBottom: 5,
  },
  detailsHeader: {
    flexDirection: 'row', 
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#38385E',
  },
  detailsText: {
    marginBottom: 10,
    color: '#000',
  },
});
