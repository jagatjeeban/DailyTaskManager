import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigations/AuthStack'
import { useRoute } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { showMessage } from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface formObject {
  'name': string,
  'emailId': string,
  'password': string,
  'confirmPass': string
}
interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>
}

const Register = ({navigation}: RegisterScreenProps) => {

  const route = useRoute();
  const [ formValue, setFormValue ] = useState<formObject>({ name: '', emailId: '', password: '', confirmPass: '' });

  interface formParams {
    value: string,
    name: string
  }

  //function to set the input into form state
  const addIntoForm = ({value, name}: formParams) => {
    if(value){
      setFormValue(formValue => ({...formValue, [name]: value}));
    }
  }

  //function to save the user info into the local storage
  const saveUserInfo = async() => {
    await AsyncStorage.setItem('USER_INFO', JSON.stringify(formValue));
  }

  //function to validate the form
  const validateForm = () => {
    if(formValue?.name === ''){
      showMessage({message: 'Name', description: 'Name can not be empty!', type:'danger', icon:'danger'});
    }
    else if(formValue?.emailId === ''){
      showMessage({message: 'Email Id', description: 'Email Id can not be empty!', type:'danger', icon:'danger'});
    }
    else if(formValue?.emailId !== '' && (!formValue?.emailId.includes('@') || !formValue?.emailId.includes('.com'))){
      showMessage({message: 'Invalid Email Id', description: 'Please enter a valid email id!', type:'danger', icon:'danger'});
    }
    else if(formValue?.password === ''){
      showMessage({message: 'Password', description: 'Password can not be empty!', type:'danger', icon:'danger'});
    }
    else if(formValue?.confirmPass === ''){
      showMessage({message: 'Confirm Password', description: 'Confirm Password can not be empty!', type:'danger', icon:'danger'});
    }
    else if(formValue?.confirmPass !== formValue?.password){
      showMessage({message:'Mismatched Password', description: 'Please enter matched confirm password!', type:'danger', icon:'danger'});
    }
    else {
      saveUserInfo();
      navigation.navigate('SignIn');
    }
  }

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
            onChangeText={(e) => addIntoForm({ value: e, name: 'name'})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Email Id</Text>
          <TextInput
            placeholder={'e.g. example@gmail.com'}
            style={styles.inputContainer}
            keyboardType={'email-address'}
            onChangeText={(e) => addIntoForm({ value: e, name: 'emailId'})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>New Password</Text>
          <TextInput
            placeholder={'Enter password'}
            style={styles.inputContainer}
            secureTextEntry={true}
            onChangeText={(e) => addIntoForm({ value: e, name: 'password'})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Confirm Password</Text>
          <TextInput
            placeholder={'Enter password'}
            style={styles.inputContainer}
            secureTextEntry={true}
            onChangeText={(e) => addIntoForm({ value: e, name: 'confirmPass'})}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => validateForm()} style={styles.signInBtn}>
          <Text style={styles.signInBtnText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.bottomText}>
          <Text style={{color:'grey', fontSize: 15}}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 5}}>
            <Text style={styles.registerText}>Sign In</Text>
          </TouchableOpacity>
        </View>
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