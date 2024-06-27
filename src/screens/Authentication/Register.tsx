import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigations/AuthStack'
import { useRoute } from '@react-navigation/native'

interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>
}

const Register = ({navigation}: RegisterScreenProps) => {

  const route = useRoute();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text onPress={() => navigation.navigate('SignIn')} style={{fontSize: 20, fontWeight:"600"}}>Register</Text>
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
  }
})