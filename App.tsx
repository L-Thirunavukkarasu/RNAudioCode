import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home';
import CategoryScreen from './src/screens/categories';
import DialPadScreen from './src/screens/dialpad';
import InitScreen from './src/screens/getstarted';

export type RootStackParamList = {
  InitScreen: undefined;
  Home: undefined;
  Detail: {
    category: string;
    imgPath: any;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InitScreen"
      >
        <Stack.Screen name="InitScreen" component={InitScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Detail" component={CategoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
