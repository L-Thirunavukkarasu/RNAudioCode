import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// sample data
const categories = [
  { id: '1', name: 'Food', icon: 'restaurant' },
  { id: '2', name: 'Travel', icon: 'flight' },
  { id: '3', name: 'Shopping', icon: 'shopping-cart' },
  { id: '4', name: 'Health', icon: 'fitness-center' },
  { id: '5', name: 'Work', icon: 'work' },
];

// CategoryList component
const Home = ({ onSelectCategory }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelectCategory(item)}
    >
      <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default Home;

// styles
const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});
