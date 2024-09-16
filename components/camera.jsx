import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useState,useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View,StatusBar } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

export default function Cameras({ onPictureTaken, onClose }) {
  const [facing, setFacing] = useState(Camera.back); 
  const [permission, requestPermission] = useCameraPermissions();
   const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

   // Capture photo
  async function takePicture() {
    if (cameraRef.current) {
        try {
      console.log("inside takePicture")
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo)
        if (onPictureTaken) {
          onPictureTaken(photo);  // Pass the photo object to the parent
        }
        if (onClose) {
          onClose();  // Optionally close the modal after taking the picture
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  }

   // Capture picture
        // if (onPictureTaken) {
        //   onPictureTaken(photo.uri);  // Pass the image URI to the parent
        // }
        // if (onClose) {
        //   onClose();  // Optionally close the modal after taking the picture
  // }
  
  return (
    <View style={styles.container}>
    <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={toggleCameraFacing}
        >
          <MaterialIcons name="flip-camera-android" size={35} color="#E1E3E4" />
        </TouchableOpacity>
      </View>
     <View style={[{paddingTop:StatusBar.currentHeight,  marginTop: 'auto',paddingBottom:85}]}>
     <TouchableOpacity style={{ alignItems: 'center' }} onPress={takePicture}>
    <Entypo name="circle" size={75} color="#E1E3E4" />
  </TouchableOpacity>
     </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
   bottomContainer: {
    
    alignItems: 'flex-end',
    padding:20 // Adjust to add spacing from the bottom of the screen
  },
  button: {
    marginVertical:StatusBar.currentHeight // Add padding to make the button larger if needed
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
