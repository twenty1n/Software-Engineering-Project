import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookingScreen({navigation}) {
  const [processingReservations, setProcessingReservations] = useState([]);
  const [completedReservations, setCompletedReservations] = useState([]);
  const [cancelledReservations, setCancelledReservations] = useState([]);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Processing');

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

  const handleCancelButtonPress = item => {
    if (!accessToken) {
      Alert.alert('Access token not found. Please log in.');
      return;
    }

    // Send a PATCH request to cancel the reservation with the access token in the headers
    fetch('http://192.168.1.50:5000/seeker/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reservation_id: item,
        status: 'Cancelled',
      }),
    })
      .then(res => {
        if (!res.ok) {
          console.error('Response status code:', res.status);
          throw new Error('Network response was not ok');
        }
        Alert.alert('Cancelled successfully');
        setRefreshFlag(!refreshFlag);
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Failed to cancelled the booking');
      });
  };

  // Function to fetch reservations based on the selected status
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    // Fetch user profile data using the access token
    console.log('Access Token:', accessToken);

    const fetchReservations = async status => {
      console.log(status);
      try {
        const response = await fetch(
          `http://192.168.1.50:5000/seeker/reservation/${status}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          console.error('Response status:', response.status);
          const errorText = await response.text();
          console.error('Response text:', errorText);
          throw new Error('Network response was not ok');
        }

        const results = await response.json();
        console.log(results);

        switch (status) {
          case 'Processing':
            setProcessingReservations(results);
            break;
          case 'Completed':
            setCompletedReservations(results);
            break;
          case 'Cancelled':
            setCancelledReservations(results);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${status} reservations:`, error);
        setError(error.message);
      }
    };
    console.log('selected status', selectedStatus);
    console.log('cancelledReservations.length', cancelledReservations.length);
    console.log('completedReservations.length', completedReservations.length);
    console.log('processingReservations.length', processingReservations.length);
    fetchReservations(selectedStatus);
  }, [refreshFlag, accessToken, selectedStatus]);

  const ItemSeparator = () => (
    <View
      style={{
        height: 30,
        backgroundColor: 'transparent',
      }}
    />
  );

  // Function to render each item in the FlatList
  const renderItem = ({item}) => (
    <View style={styles.bookingDetails}>
      {console.log('Parameters to be sent:', {
        service_id: item.service_id,
        provider_id: item.provider_id,
        service_title: item.service_title,
        service_cost: item.service_cost,
        providername: item.provider_name,
      })}
      <Text style={styles.bookingHeader}>
        Booking No : {item.reservation_id}
      </Text>
      <Text style={styles.detailsHeader}>Working Time</Text>
      <Text>
        {item.reservation_date} - {item.reservation_time}
      </Text>
      <View style={{marginTop: 20}} />
      <Text style={styles.detailsHeader}>Location</Text>
      <Text>{item.seeker_address}</Text>
      <View style={{marginTop: 20}} />
      {selectedStatus === 'Processing' && (
        <View style={{flexDirection: 'row', columnGap: 13}}>
          <TouchableOpacity
            onPress={() => handleCancelButtonPress(item.reservation_id)}
            style={[styles.button, {backgroundColor: '#FFEBF0'}]}>
            <Text style={[styles.buttonText, {color: '#F7658B'}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      {selectedStatus === 'Completed' && (
        <View style={{flexDirection: 'row', columnGap: 13}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SeekerHistoryDetail', {
                reservation_id: item.reservation_id,
              })
            }
            style={[styles.smallButton, {backgroundColor: '#F4F3FD'}]}>
            <Text style={[styles.buttonText, {color: '#583EF2'}]}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SeekerBooking', {
                service_id: item.service_id,
                provider_id: item.provider_id,
                service_title: item.service_title,
                service_cost: item.service_cost,
                providername: item.provider_name,
              })
            }
            style={[styles.smallButton, {backgroundColor: '#FFEBF0'}]}>
            <Text style={[styles.buttonText, {color: '#F7658B'}]}>
              Book again
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {selectedStatus === 'Cancelled' && (
        <View style={{flexDirection: 'row', columnGap: 13}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SeekerHistoryDetail', {
                reservation_id: item.reservation_id,
              })
            }
            style={[styles.smallButton, {backgroundColor: '#F4F3FD'}]}>
            <Text style={[styles.buttonText, {color: '#583EF2'}]}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SeekerBooking', {
                service_id: item.service_id,
                provider_id: item.provider_id,
                service_title: item.service_title,
                service_cost: item.service_cost,
                providername: item.provider_name,
              })
            }
            style={[styles.smallButton, {backgroundColor: '#FFEBF0'}]}>
            <Text style={[styles.buttonText, {color: '#F7658B'}]}>
              Book again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={{...styles.container, backgroundColor: 'white'}}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <ArrowLeftIcon size={20} color="#6E6BE8" />
      </TouchableOpacity>
      <Text style={styles.heading}>Booking</Text>

      <View style={styles.topcontainer}>
        <TouchableOpacity
          style={[
            styles.underline,
            {
              borderBottomColor:
                selectedStatus === 'Processing' ? '#583EF2' : 'white',
            },
          ]}
          onPress={() => setSelectedStatus('Processing')}>
          <Text
            style={[
              styles.bookingHeader,
              {
                color: selectedStatus === 'Processing' ? '#1F126B' : '#B8B8D2',
              },
            ]}>
            Processing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.underline,
            {
              borderBottomColor:
                selectedStatus === 'Completed' ? '#583EF2' : 'white',
            },
          ]}
          onPress={() => setSelectedStatus('Completed')}>
          <Text
            style={[
              styles.bookingHeader,
              {color: selectedStatus === 'Completed' ? '#1F126B' : '#B8B8D2'},
            ]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.underline,
            {
              borderBottomColor:
                selectedStatus === 'Cancelled' ? '#583EF2' : 'white',
            },
          ]}
          onPress={() => setSelectedStatus('Cancelled')}>
          <Text
            style={[
              styles.bookingHeader,
              {color: selectedStatus === 'Cancelled' ? '#1F126B' : '#B8B8D2'},
            ]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>
      {selectedStatus === 'Processing' ? (
        processingReservations.length === 0 ? (
          <Text style={styles.noReservationsText}>
            No processing reservations found.
          </Text>
        ) : (
          <FlatList
            data={processingReservations}
            renderItem={renderItem}
            keyExtractor={item => item.reservation_id.toString()}
            ItemSeparatorComponent={ItemSeparator}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : selectedStatus === 'Completed' ? (
        completedReservations.length === 0 ? (
          <Text style={styles.noReservationsText}>
            No completed reservations found.
          </Text>
        ) : (
          <FlatList
            data={completedReservations}
            renderItem={renderItem}
            keyExtractor={item => item.reservation_id.toString()}
            ItemSeparatorComponent={ItemSeparator}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : selectedStatus === 'Cancelled' ? (
        cancelledReservations.length === 0 ? (
          <Text style={styles.noReservationsText}>
            No cancelled reservations found.
          </Text>
        ) : (
          <FlatList
            data={cancelledReservations}
            renderItem={renderItem}
            keyExtractor={item => item.reservation_id.toString()}
            ItemSeparatorComponent={ItemSeparator}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <Text style={styles.noReservationsText}>Invalid status selected.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  topcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  underline: {
    borderBottomWidth: 2,
    width: 80,
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 45,
    color: '#1F126B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingDetails: {
    borderColor: '#EAEAFF',
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1,
    width: '100%',
  },
  bookingHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F126B',
  },
  detailsHeader: {
    fontWeight: 'bold',
    color: '#1F1F39',
    marginBottom: 6,
  },
  button: {
    width: 267,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    width: 127,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
