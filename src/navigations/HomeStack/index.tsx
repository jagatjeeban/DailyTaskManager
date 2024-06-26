import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//import all the screens
import Home from '../../screens/Home'
import CreateTask from '../../screens/Home/CreateTask'

export type HomeStackParamList = {
    Home: undefined,
    CreateTask: undefined
}

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home'       component={Home} />
      <Stack.Screen name='CreateTask' component={CreateTask} />
    </Stack.Navigator>
  )
}

export default HomeStackNavigator;