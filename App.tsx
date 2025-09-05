import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home';
import CategoryScreen from './src/screens/categories';
import DialPadScreen from './src/screens/dialpad';
import InitScreen from './src/screens/getstarted';
import AudioCode from './src/screens/audiocode';
import CallScreen from './src/screens/callscreen/callentry';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

export type RootStackParamList = {
  InitScreen: undefined;
  Home: undefined;
  Detail: {
    category: string;
    imgPath: any;
  };
  AudioCode: undefined;
  CallScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="InitScreen">
          <Stack.Screen
            name="InitScreen"
            component={InitScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Detail" component={CategoryScreen} />
          <Stack.Screen
            name="AudioCode"
            component={AudioCode}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CallScreen"
            component={CallScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '15%',
    bottom: 0,
  },
});
