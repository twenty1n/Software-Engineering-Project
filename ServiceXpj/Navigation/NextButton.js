import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

export default function NextButton({onPress}) {
  return (
    <View style={styles.container}>
      <View style={styles.elementsContainer}></View>
      {/* Point 1 */}
      <View style={styles.point}></View>

      {/* Line 1 */}
      <View style={styles.line1}></View>

      {/* Point 2 */}
      <View style={styles.point}></View>

      {/* Line 2 */}
      <View style={styles.line2}></View>

      {/* Circle */}
      <View style={styles.circle}></View>

      {/* Add some space between the circle and the button */}
      <View style={{marginRight: 10}} />

      {/* Container for 'Next' button */}
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={onPress}>
          <View style={styles.innerContainer}>
            <Text style={styles.buttonText}>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    justifyContent: 'flex-end',
    top: 170,
  },
  point: {
    borderRadius: 25,
    backgroundColor: '#F3A8A2',
    width: 15,
    height: 15,
  },
  line1: {
    backgroundColor: '#F4CDD4',
    height: 5,
    width: 70, // Adjust as needed
  },
  line2: {
    backgroundColor: '#FFEBF0',
    height: 5,
    width: 70,
  },
  circle: {
    borderRadius: 25,
    backgroundColor: '#FFEBF0',
    width: 15,
    height: 15,
  },
  nextButtonContainer: {
    alignItems: 'center',
    marginLeft: 20,
  },
  nextButton: {
    width: '160%',
    height: 44,
    backgroundColor: '#583EF2',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
