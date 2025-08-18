import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

interface Key {
  label: string;
}

const KEY_LAYOUT: Key[][] = [
  [{ label: '1' }, { label: '2' }, { label: '3' }],
  [{ label: '4' }, { label: '5' }, { label: '6' }],
  [{ label: '7' }, { label: '8' }, { label: '9' }],
  [{ label: '*' }, { label: '0' }, { label: '#' }],
];

const DialPadScreen: React.FC = () => {
  const [number, setNumber] = useState<string>('');

  const onKeyPress = (key: Key) => (e: GestureResponderEvent) => {
    setNumber(prev =>
      key.label === '⌫' ? prev.slice(0, -1) : prev + key.label,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.displayText}>{number || 'Enter Number'}</Text>
      <View style={styles.padContainer}>
        {KEY_LAYOUT.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map(key => (
              <TouchableOpacity
                key={key.label}
                style={styles.keyButton}
                onPress={onKeyPress(key)}
                activeOpacity={0.6}
              >
                <Text style={styles.keyLabel}>{key.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        {/* Backspace key row */}
        <View style={styles.row}>
          <View style={styles.keySpacer} />
          <TouchableOpacity
            style={styles.keyButton}
            onPress={onKeyPress({ label: '⌫' })}
            activeOpacity={0.6}
          >
            <Text style={styles.keyLabel}>⌫</Text>
          </TouchableOpacity>
          <View style={styles.keySpacer} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DialPadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 24,
  },

  displayText: {
    fontSize: 32,
    color: '#222222',
    marginBottom: 24,
  },

  padContainer: {
    width: '90%',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },

  keyButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  keyLabel: {
    fontSize: 24,
    color: '#333333',
  },

  keySpacer: {
    width: 72,
    height: 72,
  },
});
