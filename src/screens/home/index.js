import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Strings, MarginVal, Colors } from '../../assets/constants';
import * as Data from '../../assets/data';
import ModalView from '../../components/model';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 1.3;

const Home = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('1234567890');

  const handleCancel = () => {
    setModalVisible(false);
    // any extra “keep editing” logic
    openDialPad();
  };

  const handleConfirm = () => {
    setModalVisible(false);
    // perform discard action here
  };

  const openDialPad = async () => {
    // Use telprompt on iOS to skip the confirmation dialog
    const scheme = Platform.OS === 'ios' ? 'telprompt:' : 'tel:';
    const url = `${scheme}${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('Error', 'Dialing is not supported on this device');
        return;
      }
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Error', 'Failed to open dialer');
      console.error(err);
    }
  };
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer(index)}
      activeOpacity={0.7}
      onPress={() =>
        // navigation.navigate('Detail', {
        //   category: item.title,
        //   imgPath: item.icon,
        // })
        {
          setModalVisible(true);
        }
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
      <ModalView
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
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
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    color: '#333',
  },
});
