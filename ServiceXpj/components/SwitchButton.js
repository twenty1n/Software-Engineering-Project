// Import necessary components and hooks from React and React Native
import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

// Define the functional component 'CustomSwitch' that takes three props: 'selectionMode', 'options', and 'onSelectSwitch'
export default function CustomSwitch({selectionMode, options, onSelectSwitch}) {
  // State variable to manage the current selection mode
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  // Function to update the selection mode and trigger the 'onSelectSwitch' callback
  const updateSwitchData = value => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };

  // Render the custom switch UI
  return (
    <View
      style={{
        height: 44,
        marginHorizontal: 32,
        width: '85%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderColor: '#AD40AF',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      {/* Map through 'options' array to create individual switch options */}
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          onPress={() => updateSwitchData(index + 1)}
          style={{
            flex: 1,
            backgroundColor:
              getSelectionMode === index + 1 ? '#583EF2' : '#ffffff',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: index !== 0 ? 5 : 0,
          }}>
          {/* Display the option text */}
          <Text
            style={{
              color: getSelectionMode === index + 1 ? 'white' : '#B8B8D2',
              fontSize: 14,
              fontFamily: 'Arial',
              fontWeight: 600,
            }}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
