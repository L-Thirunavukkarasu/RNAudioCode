// DiscardConfirmationModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.35;

const ModalView = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onCancel(1)}
    >
      <TouchableWithoutFeedback onPress={() => onCancel(0)}>
        <View style={styles.backdrop}>
          <View style={styles.container}>
            <Text style={styles.title}>Call Type</Text>
            <Text style={styles.message}>
              Please select the call type! to proceed the request
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={() => onCancel(1)}
              >
                <Text style={[styles.buttonText, styles.outlineText]}>
                  PSTN Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.filledButton]}
                onPress={onConfirm}
              >
                <Text style={[styles.buttonText, styles.filledText]}>
                  VOIP Call
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: BUTTON_WIDTH,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  outlineButton: {
    backgroundColor: '#888',
    marginRight: 5,
  },
  filledButton: {
    backgroundColor: '#eb1800',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  outlineText: {
    color: '#fff',
  },
  filledText: {
    color: '#fff',
  },
});

export default ModalView;
