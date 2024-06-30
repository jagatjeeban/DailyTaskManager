import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigations/AuthStack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { showMessage } from 'react-native-flash-message'
import { useAppDispatch } from '../../store/hooks'
import { loginSuccess } from '../../store/authSlice'

//sign in screen prop interfce
interface SignInScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>
}

interface formObject {
  'emailId': string,
  'password': string
}

const SignIn = ({navigation}: SignInScreenProps) => {

  const [ formValue, setFormValue ] = useState<formObject>({ emailId: '', password: '' });
  const dispatch = useAppDispatch();

  interface formParams {
    value: string,
    name: string
  }

  interface UserInfo {
    name: string,
    emailId: string,
    password: string,
    confirmPass: string
  }

  //function to set the input into form state
  const addIntoForm = ({value, name}: formParams) => {
    setFormValue(formValue => ({...formValue, [name]: value}));
  }

  //function to sign into the app
  const signIn = async() => {
    let user: string | null;
    user = await AsyncStorage.getItem('USER_INFO');
    const currentUser: UserInfo = user? JSON.parse(user): null;

    if(formValue?.emailId === ''){
      showMessage({message: 'Email Id', description: 'Email Id can not be empty!', type:'danger', icon:'danger'});
    }
    else if(formValue?.password === ''){
      showMessage({message: 'Password', description: 'Password can not be empty!', type:'danger', icon:'danger'});
    }
    else if(!currentUser){
      showMessage({message: 'Invalid User', description:'Looks like your account does not exist. Please register!', type:'danger', icon:'info'});
    }
    else if(formValue?.emailId !== currentUser?.emailId){
      showMessage({message: 'Incorrect Email Id', description: 'Please enter the correct email id!', type:'danger', icon:'danger'});
    }
    else if(formValue?.password !== currentUser?.password){
      showMessage({message: 'Incorrect Password', description: 'Please enter the correct password!', type:'danger', icon:'danger'});
    }
    else {
      dispatch(loginSuccess());
      // showMessage({message: 'Success', description:'Successfully signed in!', type:'success', icon:'success'});
    }
  }

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
            value={formValue?.emailId}
            style={styles.inputContainer}
            keyboardType={'email-address'}
            onChangeText={(e) => addIntoForm({ value: e, name: 'emailId'})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            placeholder={'Enter password'}
            value={formValue?.password}
            style={styles.inputContainer}
            secureTextEntry={true}
            onChangeText={(e) => addIntoForm({ value: e, name: 'password'})}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => signIn()} style={styles.signInBtn}>
          <Text style={styles.signInBtnText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.bottomText}>
          <Text style={{color:'grey', fontSize: 15}}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{padding: 5}}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
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
    padding: 10, 
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
    marginLeft: 5
  },
})