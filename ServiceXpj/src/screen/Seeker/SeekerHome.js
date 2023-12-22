import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function SeekerHome() {
  const navigation = useNavigation();

  // Function to handle navigation to SeekerSearch screen
  const handlePress = () => {
    navigation.navigate('SeekerSearch');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require('../../../assets/image/mask-group.png')}
      />
      <View>
        <View style={{flexDirection: 'row', gap: 74, justifyContent: 'center'}}>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 24,
                color: 'white',
                marginBottom: 10,
                marginTop: 69,
                fontWeight: 600,
                bottom: 15,
              }}>
              Hi Customer,
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: 400,
                paddingBottom: 25,
                bottom: 15,
              }}>
              Need some help today?
            </Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#AEAAF8',
              borderBottomLeftRadius: 111.1,
              borderBottomRightRadius: 111.1,
              borderTopLeftRadius: 11.1,
              borderTopRightRadius: 111.1,
              marginTop: 69,
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 15,
            }}>
            <Image source={require('../../../assets/image/menu.png')}></Image>
          </View>
        </View>
        <TouchableOpacity onPress={handlePress}>
          <View
            style={{
              flexDirection: 'row',
              width: 311,
              height: 50,
              paddingLeft: 16,
              paddingRight: 55,
              borderBottomRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 2,
              backgroundColor: 'white',
              alignSelf: 'center',
              alignItems: 'center',
              gap: 15,
              bottom: 15,
            }}>
            <Image source={require('../../../assets/image/search.png')} />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          top: 12,
        }}>
        <View style={styles.categoryButtonPanel}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              navigation.navigate('SeekerFilterCategory', {type: 'All'})
            }>
            <Image source={require('../../../assets/image/home.png')} />
            <Text style={styles.categoryButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              navigation.navigate('SeekerFilterCategory', {type: 'Clean'})
            }>
            <Image source={require('../../../assets/image/clean.png')} />
            <Text style={styles.categoryButtonText}>Clean</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              navigation.navigate('SeekerFilterCategory', {type: 'Repair'})
            }>
            <Image source={require('../../../assets/image/repair.png')} />
            <Text style={styles.categoryButtonText}>Repair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              navigation.navigate('SeekerFilterCategory', {
                type: 'Pest Control',
              })
            }>
            <Image source={require('../../../assets/image/pest.png')} />
            <Text style={styles.categoryButtonText}>Pest control</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              navigation.navigate('SeekerFilterCategory', {type: 'Cooking'})
            }>
            <Image source={require('../../../assets/image/food.png')} />
            <Text style={styles.categoryButtonText}>Cooking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() =>
              navigation.navigate('SeekerFilterCategory', {type: 'Laundry'})
            }>
            <Image source={require('../../../assets/image/laundry.png')} />
            <Text style={styles.categoryButtonText}>Laundry</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SeekerSearch')}>
          <View style={styles.rectangleFindYourService}>
            <Text style={styles.textFindService}>Find your service now</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 311,
            height: 50,
            borderRadius: 14,
            backgroundColor: '#F4F3FD',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: 36,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Arial',
              fontWeight: 600,
              color: '#583EF2',
            }}>
            Need more service?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  categoryButton: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#EAEAFF',
    height: 102,
    width: 97,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontFamily: 'Arial',
    gap: 14,
  },
  categoryButtonText: {
    color: '#B8B8D2',
  },
  categoryButtonPanel: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 30,
    gap: 10,
    justifyContent: 'center',
  },
  topPickButtonText: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '600',
    color: '#38385E',
  },
  exploreButtonPanel: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 30,
    gap: 20,
  },
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
  exploreButtonText: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '600',
    color: '#38385E',
    textAlign: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    position: 'absolute',
  },
  rectangleFindYourService: {
    height: 102,
    width: 311,
    backgroundColor: '#EAEAFF',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  textFindService: {
    fontSize: 16,
    color: '#38385E',
  },
});
