import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export type RootStackParamList = {
    Home: undefined,
    CreateTask: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>

const HomeStackNavigator = () => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default HomeStackNavigator;