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
    <Stack.Navigator>
      <Stack.Screen name='SignIn'   component={SignIn}   options={{headerShown: false}} />
      <Stack.Screen name='Register' component={Register} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}

export default AuthStackNavigator;