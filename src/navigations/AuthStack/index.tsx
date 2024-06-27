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

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='SignIn'   component={SignIn} />
      <Stack.Screen name='Register' component={Register} />
    </Stack.Navigator>
  )
}

export default AuthStackNavigator;