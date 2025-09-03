import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../assets/constants';
import ModalView from '../../components/model';
import { requestAllPermissions } from '../../services/permissions';

const index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('1234567890');

  useEffect(() => {
    (async () => {
      await requestAllPermissions();
    })();
  }, []);

  const handleCancel = (val: number) => {
    setModalVisible(false);
    // any extra “keep editing” logic
    if (val === 1) {
      openDialPad();
    }
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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.txt}>Make a Call</Text>
      </TouchableOpacity>
      <ModalView
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    padding: 10,
    backgroundColor: Colors.app_red,
    borderRadius: 10,
  },
  txt: {
    color: Colors.app_white,
  },
});
