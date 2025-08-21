import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const InitScreen =({ navigation }) => {
  const handlePress = () => {
    navigation.replace('Detail',{
        category: '',
        imgPath: require('../../assets/images/img_glob_service.png'),
      }); // swap in your actual route
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/img_glob_service.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to Our App</Text>
          <Text style={styles.subtitle}>
            Your companion for seamless experiences.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BUTTON_HEIGHT = 50;
const BUTTON_WIDTH = width * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#eb1800',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent:'center',
    paddingTop:'30%'
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: BUTTON_HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,            // Android shadow
    shadowColor: '#000',     // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: '#eb1800',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default InitScreen;
