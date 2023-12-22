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

export default function ProviderBooking({navigation}) {
  const [processingReservations, setProcessingReservations] = useState([]);
  const [completedReservations, setCompletedReservations] = useState([]);
  const [cancelledReservations, setCancelledReservations] = useState([]);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Processing');

  // Fetch access token on component mount
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

  // Handle press for completing a booking
  const handleDoneButtonPress = item => {
    if (!accessToken) {
      Alert.alert('Access token not found. Please log in.');
      return;
    }

    // Send PATCH request to mark the reservation as completed
    fetch('http://192.168.1.50:5000/provider/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reservation_id: item,
        status: 'Completed',
      }),
    })
      .then(res => {
        if (!res.ok) {
          console.error('Response status code:', res.status);
          throw new Error('Network response was not ok');
        }
        Alert.alert('Completed the booking successfully');
        setRefreshFlag(!refreshFlag);
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Failed to complete the booking');
      });
  };

  // Handle press for canceling a booking
  const handleCancelButtonPress = item => {
    if (!accessToken) {
      Alert.alert('Access token not found. Please log in.');
      return;
    }

    fetch('http://192.168.1.50:5000/provider/status', {
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

  // Fetch reservations based on the selected status
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    console.log('Access Token:', accessToken);

    const fetchReservations = async status => {
      console.log(status);
      try {
        const response = await fetch(
          `http://192.168.1.50:5000/provider/reservation/${status}`,
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

  const renderItem = ({item}) => (
    <View style={styles.bookingDetails}>
      <Text style={styles.bookingHeader}>
        Booking No. : {item.reservation_id}
      </Text>
      <Text style={styles.detailsHeader}>Working Time</Text>
      <Text>
        {item.reservation_date} - {item.reservation_time}
      </Text>
      <View style={{marginVertical: 5}} />
      <Text style={styles.detailsHeader}>Location</Text>
      <Text>{item.seeker_address}</Text>
      <View style={{marginVertical: 10}} />
      {selectedStatus === 'Processing' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleDoneButtonPress(item.reservation_id)}
            style={[styles.smallButton, {backgroundColor: '#F4F3FD'}]}>
            <Text style={[styles.buttonText, {color: '#583EF2'}]}>Done</Text>
          </TouchableOpacity>
          <View style={{marginHorizontal: 10}} />
          <TouchableOpacity
            onPress={() => handleCancelButtonPress(item.reservation_id)}
            style={[styles.smallButton, {backgroundColor: '#FFEBF0'}]}>
            <Text style={[styles.buttonText, {color: '#F7658B'}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedStatus === 'Completed' && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProviderBookingDetails', {
              reservation_id: item.reservation_id,
            })
          }
          style={[styles.button, {backgroundColor: '#F4F3FD'}]}>
          <Text style={[styles.buttonText, {color: '#583EF2'}]}>View</Text>
        </TouchableOpacity>
      )}
      {selectedStatus === 'Cancelled' && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProviderBookingDetails', {
              reservation_id: item.reservation_id,
            })
          }
          style={[styles.button, {backgroundColor: '#F4F3FD'}]}>
          <Text style={[styles.buttonText, {color: '#583EF2'}]}>View</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{...styles.container, backgroundColor: 'white'}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <ArrowLeftIcon size={20} color="#6E6BE8" />
      </TouchableOpacity>

      <Text style={styles.heading}>Booking Planner</Text>

      <View style={styles.topcontainer}>
        <TouchableOpacity
          style={[
            styles.underline,
            {
              width: 100,
              borderBottomColor:
                selectedStatus === 'Processing' ? '#583EF2' : 'white',
            },
          ]}
          onPress={() => setSelectedStatus('Processing')}>
          <Text
            style={[
              styles.bookingHeader,
              {color: selectedStatus === 'Processing' ? '#1F126B' : '#B8B8D2'},
            ]}>
            Processing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.underline,
            {
              width: 100,
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
              width: 100,
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
    padding: 16,
    alignItems: 'center',
  },
  topcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginHorizontal: 'auto',
  },
  underline: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    paddingVertical: 4,
    width: '100%',
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  smallButton: {
    width: 127,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 30,
    color: '#1F126B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  bookingDetails: {
    borderColor: '#EAEAFF',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 10,
    borderWidth: 1,
    width: 350,
  },
  bookingHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F126B',
  },
  detailsHeader: {
    fontWeight: 'bold',
    color: '#1F1F39',
    marginBottom: 4,
  },
  icon: {
    width: 17,
    height: 17,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
