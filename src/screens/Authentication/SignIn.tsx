import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigations/AuthStack'

interface SignInScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>
}

const SignIn = ({navigation}: SignInScreenProps) => {
  return (
    <SafeAreaView style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
      <Text style={{fontSize: 20, fontWeight:'600'}}>SignIn</Text>
    </SafeAreaView>
  )
}

export default SignIn