import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { CameraView, Camera, CameraType } from 'expo-camera';
import * as Linking from 'expo-linking';

export default function Index() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleOpenCamera = async () => {
    if (hasPermission === null) {
      // Permission status unknown, request again
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        setIsCameraOpen(true);
      } else {
        showPermissionAlert();
      }
    } else if (hasPermission) {
      // Already authorized, open camera
      setIsCameraOpen(true);
    } else {
      // Permission denied
      showPermissionAlert();
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      'Camera Permission', 
      'Camera access is required. Would you like to grant permission?',
      [
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const handleButtonPress = () => {
    setCount(count + 1);
    Alert.alert('Button Pressed', `You've pressed the button ${count + 1} times`);
  };

  if (isCameraOpen) {
    return (
      <View style={styles.container}>
        <CameraView 
          style={StyleSheet.absoluteFillObject}
          type={cameraType}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={toggleCameraType}
            >
              <Text style={styles.buttonText}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={handleCloseCamera}
            >
              <Text style={styles.buttonText}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleButtonPress}
      >
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableOpacity>
      <Text>Camera Permission Status: {hasPermission ? 'Granted' : 'Not Granted'}</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleOpenCamera}
      >
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 10,
  }
});
