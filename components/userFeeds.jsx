import { View, Text,StyleSheet,TextInput,Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image } from 'expo-image';

export default function UserFeeds() {
   const router = useRouter();
  return (
    <View style={styles.container}>
    <View style={{
      borderRadius: 10,
      padding:5,
      borderWidth:1,
        borderColor: 'white',
      gap:2
    }}>
     <View style={styles.containerHeaderFeed}>
      <MaterialIcons name="account-circle" size={37} color="#E1E3E4" />
      <View style={styles.containerHeaderText}>
       <Text style={{ color: "#E1E3E4", fontWeight: '500' }}>Yocor, angelo</Text>
       <Text style={{ color:"#E1E3E4",fontWeight:'condensed',fontSize:10}}>this is example caption</Text>
      </View>
     </View>
     <View style={{padding:5, paddingTop:10,}} >
      <Image
      style={styles.image}
        source={require('./../assets/images/mockpic.jpg')} // Use require
        contentFit="cover"
     />
        </View>
        <View  style={{ flexDirection:'row',justifyContent: 'space-between'}}>
          <View  style={{padding:5, flexDirection:'row',paddingHorizontal:7,gap:15}}>
          <AntDesign name="hearto" size={24} color="#E1E3E4" />
            <Pressable onPress={() => router.push('./../components/comments.jsx')}>
                <FontAwesome5 name="comment-dots" size={24} color="#E1E3E4" />
      </Pressable>
          </View>
        
        </View>
       
    </View>
   
     
    </View>
  )
}

const styles = StyleSheet.create({
 container: {
  color: "#E1E3E4",
  flex: 1,
  gap:15
 },
 containerHeaderFeed: {
    alignItems: 'flex-start',
   flex:1,
  flexDirection: 'row',
  gap:5
 },
 containerHeaderText: {
  flexDirection:'column'
 },
  image: {
    flex: 1,
   width: '100%',
    height: 300,
   backgroundColor: '#0553',
    borderRadius:10
  },
})