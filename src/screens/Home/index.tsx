import { View, Text } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '../../navigations/HomeStack'

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>
}

const Home = ({navigation}: HomeScreenProps) => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default Home;