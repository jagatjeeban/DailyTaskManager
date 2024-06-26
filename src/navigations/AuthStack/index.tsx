import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//import all the screens
import Register from '../../screens/Authentication/Register'
import SignIn from '../../screens/Authentication/SignIn'

export type AuthStackParamList = {
  Register: undefined,
  SignIn: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

const screenOptions = {
  headerShown: false,
}

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='SignIn'   component={SignIn} />
    </Stack.Navigator>
  )
}

export default AuthStackNavigator;