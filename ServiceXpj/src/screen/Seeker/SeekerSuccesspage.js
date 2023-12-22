import React from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function SeekerConfirmation() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        style={styles.stretch}
        source={require('../../../assets/image/success.png')}
      />
      <Text style={styles.title}>
        <Text style={{fontWeight: 'bold', color: '#1F126B'}}> Success!</Text>
      </Text>
      <Text style={styles.body}>
        Ready to say Wow?{'\n'}
        Now you can track your booking or go back to the home screen
      </Text>
      <View style={{marginVertical: 15}} />
      <View style={styles.fixToText}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SeekerHistory')}
          style={[styles.button, {backgroundColor: '#F4F3FD'}]}>
          <Text style={[styles.buttonText, {color: '#583EF2'}]}>History</Text>
        </TouchableOpacity>

        <View style={{marginHorizontal: 10}} />
        <TouchableOpacity
          onPress={() => navigation.navigate('SeekerHome')}
          style={[styles.button, {backgroundColor: '#FFEBF0'}]}>
          <Text style={[styles.buttonText, {color: '#F7658B'}]}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center', 
    backgroundColor: 'white',
  },
  stretch: {
    width: 280,
    height: 300,
    resizeMode: 'stretch',
  },
  title: {
    textAlign: 'center',
    marginVertical: 12,
    marginHorizontal: 5,
    fontSize: 20,
    fontFamily: 'Arial',
  },
  body: {
    textAlign: 'center',
    marginVertical: 12,
    marginHorizontal: 10,
    fontSize: 18,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
