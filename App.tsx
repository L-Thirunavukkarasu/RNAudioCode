import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Home from './src/screens/home';
import CategoryScreen from './src/screens/categories';
import DialPadScreen from './src/screens/dialpad';

const App = () => {
  return (
    <View>
      <CategoryScreen />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
