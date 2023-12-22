import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function OnboardingScreen({navigation}) {
  return (
    // Using LinearGradient for background, colors go from purple to white
    <LinearGradient
      colors={['#583EF2', '#FFFFFF']} 
      style={{flex: 1}} 
    >
      {/* Container for the logo and ServiceX text */}
      <View style={styles.servicexRectangleContainer}>
        {/* Logo container with customized border radius */}
        <View style={styles.rectangle6}>
          {/* Image of the logo */}
          <Image
            source={require('../../assets/image/logo_icon.png')}
            style={styles.rectangle6Image}
          />
        </View>
        {/* Text displaying the name 'ServiceX' */}
        <Text style={styles.serviceXText}>ServiceX</Text>
      </View>

      {/* Container for the buttons */}
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {/* Invisible rectangle for layout spacing */}
        <View style={styles.rectangle1}></View>
        {/* Container for the 'Provider' and 'Seeker' buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ProviderSignUp')} // Navigation to 'ProviderSignUp' screen on press
          >
            <Text style={styles.buttonText}>Provider</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SeekerSignUp')} // Navigation to 'SeekerSignUp' screen on press
          >
            <Text style={styles.buttonText}>Seeker</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  servicexRectangleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: '20%',
  },
  serviceXText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 200,
    marginRight: 20,
    marginLeft: 20,
    top: '25%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 75,
    width: '100%',
    alignItems: 'center',
  },
  rectangle6: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
  },
  rectangle1: {
    width: 412,
    height: '75%',
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    backgroundColor: '#583EF2',
    margin: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: 268,
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  rectangle6Image: {
    position: 'absolute',
    top: 18,
    left: 10,
    width: 55,
    height: 38,
  },
});
