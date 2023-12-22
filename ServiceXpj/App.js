import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from './src/screen/OnboardingScreen';

import ProviderSignUp from './src/screen/Provider/ProviderSignUp';
import ProviderLogin from './src/screen/Provider/ProviderLogin';
import TabProvider from './Navigation/TabProvider';
import ProviderProfile from './src/screen/Provider/ProviderProfile';
import ProviderEditProfile from './src/screen/Provider/ProviderEditProfile';
import AddService from './src/screen/Provider/AddService';
import ProviderBooking from './src/screen/Provider/ProviderBooking';
import ProviderBookingDetails from './src/screen/Provider/ProviderBookingDetails';

import TabSeeker from './Navigation/TabSeeker';
import SeekerProfile from './src/screen/Seeker/SeekerProfile';
import SeekerConfirmation from './src/screen/Seeker/SeekerConfirmation';
import SeekerSuccesspage from './src/screen/Seeker/SeekerSuccesspage';
import SeekerSignUp from './src/screen/Seeker/SeekerSignUp';
import SeekerLogin from './src/screen/Seeker/SeekerLogin';
import SeekerHistory from './src/screen/Seeker/SeekerHistory';
import SeekerBooking from './src/screen/Seeker/SeekerBooking';
import SeekerEditProfile from './src/screen/Seeker/SeekerEditProfile';
import SeekerFilterCategory from './src/screen/Seeker/SeekerFilterCategory';
import SeekerBookingDetail from './src/screen/Seeker/SeekerBookingDetail';
import SeekerHistoryDetail from './src/screen/Seeker/SeekerHistoryDetail';
import SeekerWorkerProfile from './src/screen/Seeker/SeekerWorkerProfile';
import SeekerPending from './src/screen/Seeker/SeekerPending';
import SeekerSearch from './src/screen/Seeker/SeekerSearch';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnboardingScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />

        {/* Provider Side */}
        <Stack.Screen name="ProviderSignUp" component={ProviderSignUp} />
        <Stack.Screen name="ProviderHome">{() => <TabProvider />}</Stack.Screen>
        <Stack.Screen name="ProviderLogin" component={ProviderLogin} />
        <Stack.Screen name="AddService" component={AddService} />
        <Stack.Screen name="ProviderProfile" component={ProviderProfile} />
        <Stack.Screen name="ProviderEditProfile" component={ProviderEditProfile} />
        <Stack.Screen name="ProviderBooking" component={ProviderBooking} />
        <Stack.Screen name="ProviderBookingDetails" component={ProviderBookingDetails} />

        {/* Seeker Side */}
        <Stack.Screen name="SeekerSignUp" component={SeekerSignUp} />
        <Stack.Screen name="SeekerLogin" component={SeekerLogin} />
        <Stack.Screen name="SeekerHome">{() => <TabSeeker />}</Stack.Screen>
        <Stack.Screen name="SeekerProfile" component={SeekerProfile} />
        <Stack.Screen name="SeekerBooking" component={SeekerBooking} />
        <Stack.Screen name="SeekerConfirmation"component={SeekerConfirmation} />
        <Stack.Screen name="SeekerEditProfile" component={SeekerEditProfile} />
        <Stack.Screen name="SeekerSuccesspage" component={SeekerSuccesspage} />
        <Stack.Screen name="SeekerFilterCategory" component={SeekerFilterCategory} />
        <Stack.Screen name="SeekerBookingDetail" component={SeekerBookingDetail} />
        <Stack.Screen name="SeekerHistory" component={SeekerHistory} />
        <Stack.Screen name="SeekerHistoryDetail" component={SeekerHistoryDetail} />
        <Stack.Screen name="SeekerWorkerProfile" component={SeekerWorkerProfile} />
        <Stack.Screen name="SeekerPending" component={SeekerPending} />
        <Stack.Screen name="SeekerSearch" component={SeekerSearch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
