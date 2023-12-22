import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SeekerWorkerProfile({navigation, route}) {
  const {provider_id} = route.params;
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState([]);
  const combinedData = services.map((services, index) => ({
    service_name: services,
    category_id: category[index],
  }));

  const formattedData = combinedData.map(item => ({
    ...item,
    combinedValue: `${item.category_id}-${item.service_name}`,
  }));

  const categoryIcons = {
    C001: require('../../../assets/image/clean.png'),
    C002: require('../../../assets/image/repair.png'),
    C003: require('../../../assets/image/pest.png'),
    C004: require('../../../assets/image/food.png'),
    C005: require('../../../assets/image/laundry.png'),
  };

  const renderItem = ({item}) => {
    const categoryIcon = categoryIcons[item.category_id];

    return (
      <View style={styles.exploreButton}>
        {/* Render the icon based on the category_id */}
        {categoryIcon && <Image source={categoryIcon} style={styles.Licon} />}
        <Text>{item.service_name}</Text>
      </View>
    );
  };

  useEffect(() => {
    1;
    const fetchData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        console.log('Access Token:', accessToken);

        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await fetch(
          `http://192.168.1.50:5000/seeker/worker-profile/${provider_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        //console.log('Response:', response);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const results = await response.json();
        console.log('Profile Results:', results);

        // Set state variables and add console.log statements
        setname(results.provider.provider_name);
        setEmail(results.provider.provider_email);
        setPhone(results.provider.provider_phone);
        setAddress(results.provider.provider_address);
        setGender(results.provider.provider_gender);
        setDob(results.provider.provider_DateOfBirth);
        setServices(results.provider.service_titles.split(',')); // Assuming services is a comma-separated string
        setCategory(results.provider.category_ids.split(','));
        console.log('services', services);
        console.log('combine', combinedData);
        console.log(formattedData);
      } catch (error) {
        console.error('Profile Fetch Error:', error);
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={{...styles.container, backgroundColor: 'white'}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <ArrowLeftIcon size={20} color="#6E6BE8" />
      </TouchableOpacity>

      <Text style={styles.heading}>Profile</Text>

      {/* Rectangle border */}
      <View style={styles.bookingDetails}>
        <View style={styles.nameCardContainer}>
          <Image
            source={require('../../../assets/image/profile1.png')}
            style={{marginRight: 30}}
          />
          <View>
            <TextInput
              style={StyleSheet.compose(styles.bookingHeader, {
                marginBottom: 0,
                paddingBottom: 0,
              })}
              value={name}
              editable={false}
            />

            <View style={styles.rowContainer}>
              <Image
                source={require('../../../assets/image/phone.png')}
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                value={phone}
                editable={false}
              />
            </View>
            <View style={styles.rowContainer}>
              <Image
                source={require('../../../assets/image/mail.png')}
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                value={email}
                editable={false}
              />
            </View>
            <View style={styles.rowContainer}>
              <Image
                source={require('../../../assets/image/home.png')}
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                value={address}
                editable={false}
              />
            </View>
            <View style={styles.rowContainer}>
              <Image
                source={require('../../../assets/image/gender.png')}
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                value={gender}
                editable={false}
              />
            </View>

            <View style={styles.rowContainer}>
              <Image
                source={require('../../../assets/image/BD3.png')}
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                value={dob}
                editable={false}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={{marginVertical: 10}} />
      <Text
        style={{...styles.bookingHeader, marginLeft: -200, marginBottom: -20}}>
        Specialized in
      </Text>
      <View style={{marginVertical: 20}} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={formattedData}
        keyExtractor={item => item.combinedValue}
        renderItem={renderItem}
        ItemSeparatorComponent={<View style={{marginHorizontal: 10}} />}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  exploreButton: {
    width: 122,
    height: 160,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 2,
    borderColor: '#EAEAFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  nameCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  textInput: {
    color: '#78789D',
    marginBottom: 0,
    //paddingBottom: 0
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
    marginTop: 20,
    color: '#1F126B',
  },
  bookingDetails: {
    borderColor: '#EAEAFF',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 10,
    borderWidth: 1,
    width: 'auto',
    maxWidth: 400,
  },
  bookingHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F126B',
  },
  icon: {
    width: 17,
    height: 17,
  },
  Licon: {
    width: 40,
    height: 40,
  },
});
