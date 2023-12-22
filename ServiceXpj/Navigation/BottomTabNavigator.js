import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './src/screen/OnboardingScreen';
import Tabs from './Tabs'; // Import your Tabs component

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='OnboardingScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        {/* Other screen definitions... */}
        <Stack.Screen name="TabsScreen" component={Tabs} /> {/* Include Tabs in your navigation */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
