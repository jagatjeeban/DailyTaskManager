import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStack';
import HomeStackNavigator from './HomeStack';

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <HomeStackNavigator/>
    </NavigationContainer>
  )
}

export default MainStackNavigator;