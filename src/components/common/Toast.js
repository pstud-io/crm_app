import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const Toast = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.text1}</Text>
      <Text style={styles.message}>{props.text2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#4caf50', // Custom background color
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 4, // For shadow on Android
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  message: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 4,
  },
});

export default Toast;
