import { View, Text,StyleSheet,TextInput,ToastAndroid, StatusBar, ScrollView,Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import axios from 'axios';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import UserFeeds from '../../components/userFeeds';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Statecontext } from './../../context/StateContext'

export default function index() {
   const router = useRouter();
  const [data, setData] = useState(null);
    const [doneUpload, setDoneUpload] = useContext(Statecontext)

     function showToast() {
    ToastAndroid.show('Request sent successfully!', ToastAndroid.SHORT);
  }

  // const getFeeds = async () => {
  //   try {
  //     const response = await axios.get('http://192.168.18.3:3000/Feeds/');
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getFeeds();
  //       if (data) {
  //         setData(data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <View style={styles.container}>
      {doneUpload ?  ToastAndroid.show('Request sent successfully!', ToastAndroid.SHORT): (
            <Text style={styles.placeholderText}></Text>
            )}
      <View style={styles.TitleContainer}>
         <Text style={styles.Title}>Your Smile</Text>
        <Pressable onPress={() => router.push('/profile')}>
          <MaterialCommunityIcons name="account-circle-outline" size={30} color="white" />
         </Pressable>
      </View>
      <ScrollView>
      <UserFeeds/>
      </ScrollView>
       <View style={{paddingVertical:10,alignItems:"center"}}>
        <Pressable onPress={() => router.push('/post')}  >
          <Ionicons name="add-circle-outline" size={45} color="#E1E3E4" />
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#010409',
    flex: 1,
     paddingHorizontal:20
  },
  Title: {
    textAlign: 'start',
    color: '#E1E3E4',
    fontWeight: '700',
    fontSize:20
  },
  TitleContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor:'#E1E3E4',
    padding: 10,
  },
})

    {/* {data && data.map((feed, index) => (
        <Text key={index}>{feed.caption}</Text> // Assuming each feed has a `caption` field
      ))} */}