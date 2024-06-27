import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigations/AuthStack'

//sign in screen prop interfce
interface SignInScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>
}

const SignIn = ({navigation}: SignInScreenProps) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAwareScrollView style={{paddingTop:'30%', marginHorizontal: 30}} >
        <View style={{marginHorizontal: 20, marginBottom: 100}}>
          <Text style={styles.welcomeText}>Welcome to Daily Task Manager</Text>
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
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            placeholder={'Enter password'}
            style={styles.inputContainer}
            secureTextEntry={true}
            onChangeText={(e) => null}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => null} style={styles.signInBtn}>
          <Text style={styles.signInBtnText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.bottomText}>
          <Text style={{color:'grey', fontSize: 15}}>Don't have an account?</Text>
          <Text onPress={() => navigation.navigate('Register')} style={styles.registerText}>Register</Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default SignIn;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent:'center',
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
  registerText: {
    color:'black', 
    fontSize: 15, 
    fontWeight:'600', 
    marginLeft: 10
  },
})