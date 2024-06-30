import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//import all the screens
import Home       from '../../screens/Home'
import CreateTask from '../../screens/Home/CreateTask'
import AllTasks   from '../../screens/Home/AllTasks'

export type HomeStackParamList = {
    Home: undefined,
    CreateTask: {
      task: any,
    },
    AllTasks: undefined
}

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, navigationBarColor: 'white'}}>
      <Stack.Screen name='Home'       component={Home} />
      <Stack.Screen name='CreateTask' component={CreateTask} />
      <Stack.Screen name='AllTasks'   component={AllTasks} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}

export default HomeStackNavigator;