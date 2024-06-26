import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStack';

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <AuthStackNavigator/>
    </NavigationContainer>
  )
}

export default MainStackNavigator;