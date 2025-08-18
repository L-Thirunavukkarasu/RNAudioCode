import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Option {
  label: string;
  value: string;
}

const RADIO_OPTIONS: Option[] = [
  { label: 'AudioCode Call', value: 'audiocode' },
  { label: 'PSTN Call', value: 'pstn' },
];

const RadioButtonGroup = ({ SelectedOption }: any) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const onSelect = (value: string) => {
    setSelectedValue(value);
    SelectedOption(value);
  };

  return (
    <View style={styles.container}>
      {RADIO_OPTIONS.map(option => (
        <Pressable
          key={option.value}
          style={styles.optionRow}
          onPress={() => onSelect(option.value)}
        >
          <View style={styles.radioOuter}>
            {selectedValue === option.value && (
              <View style={styles.radioInner} />
            )}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#555',
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
  selectedText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
});

export default RadioButtonGroup;
