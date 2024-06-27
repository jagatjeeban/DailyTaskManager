import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigations/AuthStack'
import { useRoute } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>
}

const Register = ({navigation}: RegisterScreenProps) => {

  const route = useRoute();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAwareScrollView style={{paddingTop:70, paddingHorizontal: 30, width:'100%'}} >
        <View style={{marginBottom: 100}}>
          <Text style={styles.welcomeText}>Register to Daily Task Manager</Text>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            placeholder={'e.g. Jagat Jeeban'}
            style={styles.inputContainer}
            keyboardType={'default'}
            onChangeText={(e) => null}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Email Id</Text>
          <TextInput
            placeholder={'e.g. example@gmail.com'}
            style={styles.inputContainer}
            keyboardType={'email-address'}
            onChangeText={(e) => null}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>New Password</Text>
          <TextInput
            placeholder={'Enter password'}
            style={styles.inputContainer}
            secureTextEntry={true}
            onChangeText={(e) => null}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Confirm Password</Text>
          <TextInput
            placeholder={'Enter password'}
            style={styles.inputContainer}
            secureTextEntry={true}
            onChangeText={(e) => null}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.signInBtn}>
          <Text style={styles.signInBtnText}>Register</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default Register;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:'white'
  },
  welcomeText: {
    fontSize: 40, 
    fontWeight: '600', 
    textAlign:'center'
  },
  inputTitle: {
    fontSize: 20, 
    fontWeight:'400', 
    marginBottom: 10
  },
  inputContainer: {
    paddingVertical: 10, 
    paddingHorizontal: 7, 
    borderWidth: 1, 
    borderColor: 'grey', 
    borderRadius: 10
  },
  signInBtn: {
    backgroundColor:'black', 
    borderRadius: 10, 
    padding: 10, 
    alignItems:"center", 
    justifyContent:"center", 
    marginTop: 20
  },
  signInBtnText: {
    fontSize:20, 
    fontWeight:'500', 
    color:"white"
  },
  bottomText: {
    flexDirection:'row', 
    alignItems:'center', 
    marginTop: 10, 
    alignSelf:'center'
  },
})