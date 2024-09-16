import { ScrollView, Modal, View, Text, StatusBar, StyleSheet, TextInput, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import Cameras from './../../components/camera';
import * as FileSystem from 'expo-file-system';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from './../../config';


export default function Index() {
 const [image, setImage] = useState(null); // Stores the image URI
  const [modalVisible, setModalVisible] = useState(false); // For managing modal visibility
  const [error, setError] = useState(null); // To track any errors
   const [downloadURL, setDownloadURL] = useState(null);
  const pickImage = async () => {
    try {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        setError("Permission to access media library was denied.");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true, // Enable base64 encoding
      });
        console.log("hello inside the image picker");
      // Log the result for debugging purposes
        console.log('ImagePicker result:', result.assets[0].uri);      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri); // Store image URI
        setError(null); // Clear any previous errors
      } else {
        setError("Image selection was canceled or failed.");
      }
    } catch (e) {
      setError("An error occurred while picking the image.");
      console.error(e);
    }
  };
 const upload = async () => {
  if (!image) {
    console.error("No image selected");
    return;
  }

  try {
    // Convert the image URI to a Blob for Firebase Storage
    const response = await fetch(image);
    const blob = await response.blob();

    // Create a reference to the Firebase storage location
    const storageRef = ref(storage, `images/${Date.now()}_${image.split('/').pop()}`);

    // Upload the image blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);
     setDownloadURL(downloadURL);
    console.log('Upload successful, download URL:', downloadURL);

    // You can now use the download URL in your application
    // For example: setImageUrl(downloadURL);
    setImage(null); // Store image URI
    setDownloadURL(null)


  } catch (error) {
    console.error('Error uploading image:', error);
  }
   
};
const handlePictureTaken = (picture) => {
    setImage(picture.uri);  // Get the image URI from the camera component
    setIsModalVisible(false);  // Close the modal after capturing
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>New post</Text>
        <View style={styles.imageContainer}>
           <View style={styles.imageContainer}>
          {downloadURL ? (
            // Display the uploaded image from Firebase Storage
            <Image
              style={styles.imagePost}
              source={{ uri: downloadURL }}
              contentFit="cover"
              transition={1000}
            />
          ) : (
            <Text style={styles.placeholderText}>No image uploaded yet</Text>
          )}
        </View>
          <Image
            style={styles.imagePost}
            source={require('./../../assets/images/smilePost.png')}
            contentFit="cover"
            transition={1000}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#E1E3E4"
            placeholder="Write your caption here:"
            keyboardType="default"
          />
        </View>

        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <MaterialCommunityIcons name="progress-upload" size={30} color="#E1E3E4" />
            <Text style={styles.uploadText}>Upload files</Text>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
            <Feather name="camera" size={30} color="#E1E3E4" />
            <Text style={styles.uploadText}>Use camera</Text>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close-thick" size={30} color="#E1E3E4" />
              </TouchableOpacity>
              <Cameras
                 onPictureSaved={handlePictureTaken}  // Pass the callback to capture the image
                 onClose={() => setModalVisible(false)}  // Optionally close modal
              />
            </View>
          </Modal>

          <Pressable onPress={upload} style={styles.button}>
            <Text style={styles.text}>Save</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#010409',
    flex: 1,
    gap: 10,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#E1E3E4',
    fontSize: 25,
    paddingTop: 30,
    marginLeft: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePost: {
    width: 200,
    height: 200,
  },
  inputContainer: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 40,
  },
  input: {
    height: 50,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#E1E3E4',
    backgroundColor: '#222',
    fontSize: 16,
  },
  uploadOptions: {
    paddingHorizontal: 40,
    gap: 15,
  },
   imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePost: {
    width: 200,
    height: 200,
  },
  placeholderText: {
    color: '#E1E3E4',
    fontSize: 16,
  },
  uploadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#E1E3E4',
  },
  uploadText: {
    color: '#E1E3E4',
    marginLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  modalContainer: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    paddingRight: 15,
    paddingTop: 15,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E1E3E4',
  },
});
