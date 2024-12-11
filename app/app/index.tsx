import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid } from 'react-native';
import { CameraView, Camera, CameraType } from 'expo-camera';
import * as Linking from 'expo-linking';
import { BleManager } from 'react-native-ble-plx';

export default function Index() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(true);

  const bleManager = new BleManager();

  // 请求 Android 蓝牙权限
  const requestBluetoothPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '蓝牙权限',
          message: '我们需要位置权限以扫描蓝牙设备',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '确定',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('位置权限已授予');
      } else {
        console.log('位置权限被拒绝');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // 请求 iOS 蓝牙权限
  bleManager.onStateChange((state) => {
    if (state === 'PoweredOn') {
      console.log('蓝牙已打开');
    }
  }, true);

  requestBluetoothPermissions();

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

  const handleBarCodeScanned = ({ type, data } : any) => {
    setIsScanning(false);
    Alert.alert(
      '扫描结果',
      `二维码内容: ${data}`,
      [
        {
          text: '确定',
          onPress: () => setIsScanning(true),
        }
      ]
    );
  };

  if (isCameraOpen) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.cameraContainer}>
          <CameraView 
            style={styles.camera}
            facing={cameraType}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  }
});
