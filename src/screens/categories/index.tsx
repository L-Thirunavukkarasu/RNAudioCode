import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'AudioCode',
  },
  {
    id: '2',
    name: 'PSTN',
  },
  {
    id: '3',
    name: 'Call',
  },
 
];

const CategoryCard: React.FC<{
  item: Category;
  onAdd: (item: Category) => void;
  onFavorite?: (item: Category) => void;
}> = ({ item, onAdd, onFavorite }) => (
  <View style={styles.card}>
    {/* <Image source={item.image} style={styles.image} resizeMode="cover" /> */}
    <Text style={styles.name}>{item.name}</Text>
    <View style={styles.actions}>
      <TouchableOpacity style={styles.addButton} onPress={() => onAdd(item)}>
        <Text style={styles.addButtonText}>Select</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.favButton}>
        <Text style={styles.favIcon}>❤️</Text>
      </TouchableOpacity>
    </View>
  </View>
);



const CategoryScreen: React.FC = () => {
  const itemOnPress = (item: Category) => {
    console.log('item on selected', item.name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Collections</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CategoryCard item={item} onAdd={itemOnPress} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'red'
  },

  header: {
    fontSize: 24,
    margin: 16,
    fontWeight: '600',
    color: '#333333',
  },

  list: {
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 12,
  },

  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },

  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },

  favButton: {
    padding: 8,
  },

  favIcon: {
    fontSize: 20,
  },

  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff',
  },

  navButton: {
    flex: 1,
    alignItems: 'center',
  },

  navIcon: {
    fontSize: 24,
  },
});
