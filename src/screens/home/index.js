import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Strings, MarginVal, Colors } from '../../assets/constants';
import * as Data from '../../assets/data';
import { getRandomHexColor } from '../../utils';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 1.3;

const Home = ({ navigation }) => {
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer(index)}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('Detail', {
          category: item.title,
          imgPath: item.icon,
        })
      }
    >
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.txt_title}>{Strings.title_categories}</Text>
      <FlatList
        data={Data.categories}
        keyExtractor={item => item?.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginVertical: MarginVal,
  },
  txt_title: {
    fontSize: 20,
    marginHorizontal: MarginVal,
  },
  listContainer: {
    margin: MarginVal,
  },
  row: {
    marginBottom: MarginVal,
    flex: 1,
  },
  itemContainer: index => ({
    width: '47%',
    alignItems: 'center',
    backgroundColor: Colors.app_white,
    borderRadius: MarginVal,
    paddingVertical: MarginVal,
    marginRight: index % 2 == 0 ? '6%' : 0,
  }),
  icon: {
    width: ITEM_WIDTH * 0.5,
    height: ITEM_WIDTH * 0.5,
    marginBottom: 8,
    resizeMode: 'contain',
    borderRadius:10
  },
  title: {
    fontSize: 14,
    color: '#333',
  },
});
