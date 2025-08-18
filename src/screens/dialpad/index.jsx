import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
// buttonCountPerRow = 3; totalRows = 4
const BUTTON_SIZE = width / 3 - 24; // 24 = horizontal padding + inter-button spacing

export default function DialPad() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const onPress = key => {
    if (key === '#' && phoneNumber.length) {
      // treat '#' as backspace
      setPhoneNumber(prev => prev.slice(0, -1));
    } else {
      setPhoneNumber(prev => prev + key);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.display}>{phoneNumber || 'Enter number'}</Text>
      <View style={styles.grid}>
        {keys.map((key, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.button}
            onPress={() => onPress(key)}
            activeOpacity={0.6}
          >
            <Text style={styles.buttonText}>{key === '#' ? '⌫' : key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    bottom:0,
    marginHorizontal:10
  },

  display: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    marginBottom: 12,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 28,
    color: '#444',
  },
});
