// screens/DetailScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Keyboard,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Colors, MarginVal } from '../../assets/constants';
import CheckboxGroup from '../../components/radiobtn';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 1.3;

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const DetailScreen = ({ route, navigation }: Props) => {
  const { category, imgPath } = route?.params
    ? route?.params
    : { category: '', imgPath: '' };
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [selectedCallType, setSelectedCallType] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const mobileRef = useRef<TextInput>(null);
  

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (!name.trim() || !mobile.trim()) {
      Alert.alert('Please fill in all fields');
      return;
    } else {
      navigation.navigate('Home');
    }
    // if (selectedCallType.trim() == 'pstn') {
    //   openDialPad();
    // } else {
    //   Alert.alert(
    //     'Submitted',
    //     `Name: ${name}\nMobile: ${mobile}\nCall type: ${selectedCallType}`,
    //   );
    // }
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
    >
      <View style={styles.sub_container}>
        <Text style={[styles.header]}>{category}</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            onSubmitEditing={() => mobileRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
            returnKeyType="done"
          />
        </View>
        {/* <View style={styles.field}>
          <Text style={styles.label}>Call Type</Text>
          <CheckboxGroup
            SelectedOption={(value: any) => setSelectedCallType(value)}
          />
        </View> */}

        <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
          <Text style={styles.label}>Proceed</Text>
        </TouchableOpacity>
       
      </View>
      <View style={styles.absolute}>
        <Image source={imgPath} style={styles.icon} />
      </View>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub_container: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: Colors.app_white,
    borderRadius: MarginVal,
    marginBottom: MarginVal * 3,
  },
  header: {
    fontSize: 32,
    fontWeight: '600',
    paddingVertical: MarginVal,
    paddingTop: MarginVal * 3,
  },

  field: {
    marginBottom: MarginVal,
    width: '80%',
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111111',
    height: 50,
  },
  btn: {
    padding: MarginVal / 2,
    backgroundColor: Colors.app_light_yellow,
    marginBottom: MarginVal,
    borderRadius: MarginVal / 2,
  },
  absolute: {
    position: 'absolute',
    backgroundColor: Colors.app_white,
    padding: 10,
    borderRadius: 20,
    top: MarginVal * 2,
    borderWidth: 0.3,
    borderColor: Colors.app_gray,
  },
  icon: {
    width: ITEM_WIDTH * 0.3,
    height: ITEM_WIDTH * 0.3,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});

export default DetailScreen;
