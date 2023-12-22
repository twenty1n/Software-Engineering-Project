import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AddService() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch access token on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://192.168.1.50:5000/provider/api/categories',
        );

        if (Array.isArray(response.data.categories)) {
          const categories = response.data.categories;
          setCategoryOptions(categories);
        } else {
          console.error(
            'Invalid response format for categories:',
            response.data,
          );
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle submit for complete the new service
  const handleSubmit = async () => {
    try {
      // Check if any required field is empty
      if (!title || !description || !cost || !selectedCategory) {
        Alert.alert('Error', 'All the field has not been completed yet.');
        return;
      }
      // Check if access token is available
      const accessToken = await AsyncStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      // Prepare service data
      const serviceData = {
        title,
        description,
        cost,
        category: selectedCategory,
      };

      // Set up Axios configuration
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Make the POST request using Axios
      const response = await axios.post(
        'http://192.168.1.50:5000/provider/api/addservice',
        serviceData,
        config,
      );

      // Check the response status
      if (response.status === 200) {
        // Request was successful
        navigation.goBack(); // Go back to the previous screen
      } else {
        // Handle error if the response status is not 200
        console.error('Service Submission Error:', response.data);
        setError('Network response was not ok');
      }
    } catch (error) {
      console.error(
        'Service Submission Error:',
        error.response?.data || error.message,
      );

      // Display a user-friendly error message
      setError(error.response?.data?.error || 'Service submission failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      androidEnabled={true}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -195}
      style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
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
                <Text style={styles.textMyService}>My Service</Text>
              </View>
            </View>
          </SafeAreaView>
          <View style={styles.gridContainer}>
            <View style={{marginTop: 20}}>
              <Text style={styles.label}>Service Title</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={text => setTitle(text)}
                  placeholder="Enter your service title"
                  underlineColorAndroid={'#EAEAFF'}
                />
              </View>
              <Text style={styles.label}>Service Description</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={description}
                  onChangeText={text => setDescription(text)}
                  placeholder="Describe your service"
                  underlineColorAndroid={'#EAEAFF'}
                />
              </View>
              <Text style={styles.label}>Cost</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={cost}
                  onChangeText={text => setCost(text)}
                  placeholder="Enter cost of service"
                  underlineColorAndroid={'#EAEAFF'}
                />
              </View>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedCategory(itemValue)
                  }
                  style={styles.pickerStyle}>
                  {categoryOptions.map(item => (
                    <Picker.Item
                      key={item.category_id}
                      label={item.category_title}
                      value={item.category_id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.SubmitTextContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textMyService: {
    color: '#1F126B',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
  },
  gridContainer: {
    width: 375,
    height: 420,
    position: 'absolute',
    left: '50%',
    top: '38%',
    transform: [{translateX: -187.5}, {translateY: -187.5}],
  },
  label: {
    color: 'black',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  button: {
    width: 268,
    height: 50,
    backgroundColor: '#583EF2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 260,
  },
  SubmitTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#EAEAFF',
    paddingLeft: 10,
  },
  dropdownButtonTextStyle: {
    fontSize: 16,
  },
  dropdownStyle: {
    backgroundColor: '#EAEAFF',
    borderRadius: 8,
  },
  pickerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#EAEAFF',
    marginBottom: 10,
  },

  pickerStyle: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    paddingLeft: 10,
    right: 8,
  },
});
