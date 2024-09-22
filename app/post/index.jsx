import { ScrollView, Modal, View, Text, StatusBar, StyleSheet, TextInput,ToastAndroid, TouchableOpacity, Pressable,Alert  } from 'react-native';
import React, { useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import Cameras from './../../components/camera';
import * as FileSystem from 'expo-file-system';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from './../../config';
import { Statecontext } from './../../context/StateContext'
import { useRouter } from 'expo-router';

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false); // For managing modal visibility
  const [error, setError] = useState(null); // To track any errors
  const [DownloadURL, setDownloadURL] = useState(null);
  const [camImage, setCamImage] = useContext(Statecontext)
    const [doneUpload, setDoneUpload] = useContext(Statecontext)
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();
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
        aspect: [1,1],
        quality: 1,
        base64: true, // Enable base64 encoding
      });
        console.log("hello inside the image picker");
      // Log the result for debugging purposes
        console.log('ImagePicker result:', result.assets[0].uri);      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCamImage(result.assets[0].uri); // Store image URI
        setError(null); // Clear any previous errors
      } else {
        setError("Image selection was canceled or failed.");
      }
    } catch (e) {
      setError("An error occurred while picking the image.");
      console.error(e);
    }
  };

  
  const uplaodPostTofireBase =async () => {
    try {
       if (!camImage) {
         console.error("No image selected");
         Alert.alert("please upload a image😡")
         return;
         setIsLoading(true); // Show loading screen
       }
      // Convert the image URI to a Blob for Firebase Storage
    const response = await fetch(camImage);
    const blob = await response.blob();

    // Create a reference to the Firebase storage location
    const storageRef = ref(storage, `images/${Date.now()}_${camImage.split('/').pop()}`);

    // Upload the image blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Upload successful, download URL:', downloadURL);
      // Send caption and image URL to Firebase Realtime Database via REST API
      
 const postData = {
  caption: caption,
  imgUri: downloadURL,
  createdAt: new Date().toISOString(), // Timestamp
  comments: {}, // Use an object to store comments, or use an array if you prefer
  likes: 0, // Initialize likes to zero
};
  
    // Firebase Realtime Database URL with your project name
  const firebaseUrl = `https://yoursmile-89b3b-default-rtdb.firebaseio.com/Feeds.json`;

    // Sending POST request to Firebase Realtime Database
    const postResponse = await fetch(firebaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (postResponse.ok) {
       ToastAndroid.show('Uploaded Succesfully!', ToastAndroid.SHORT);

    } else {
      console.error('Error uploading post:', postResponse.statusText);
    }
  } catch (error) {
    console.error("Error uploading post:", error);
  } finally {
      setIsLoading(false); // Hide loading screen
    }
  }
  
  const uploadPost = async () => {
    // await uploadImageToFirebase()
    await uplaodPostTofireBase()
    setCaption()
    setCamImage()
    router.push('/feeds')

};
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>New post</Text>
        <View style={styles.imageContainer}>
           <View style={styles.imageContainer}>
          {camImage ? (
            // Display the uploaded image from Firebase Storage
              <View style={styles.imageCam}> 
                 <Image
              style={styles.imagePost}
              source={{ uri: camImage }}
              contentFit="cover"
              transition={1000}
            />
              </View>
          ) : (
            <Text style={styles.placeholderText}></Text>
            )}
             {isLoading && (
        <Modal transparent={true} animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={{ color: '#ffffff', marginTop: 10 }}>Uploading...</Text>
          </View>
        </Modal>
      )}
        </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#E1E3E4"
            placeholder="Write your caption here:"
            keyboardType="default"
            value={caption} // Bind the state to the TextInput
            onChangeText={(text) => setCaption(text)} // Update the state on text input
            
          />
        </View>

        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <MaterialCommunityIcons name="progress-upload" size={30} color="#E1E3E4" />
            <Text style={styles.uploadText}>Upload files</Text>
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

                 onClose={() => setModalVisible(false)}  // Optionally close modal
              />
            </View>
          </Modal>

          <Pressable onPress={uploadPost} style={styles.button}>
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
    aspectRatio: 1/1,
    borderRadius:10
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
    width:300,
    height: 300,
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
