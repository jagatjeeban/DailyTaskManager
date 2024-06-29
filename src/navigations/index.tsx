import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStack';
import HomeStackNavigator from './HomeStack';
import { useAppSelector } from '../store/hooks';

const MainStackNavigator = () => {

  let authStatus = useAppSelector(state => state.auth.loginStatus);

  return (
    <NavigationContainer>
      {authStatus? 
        <HomeStackNavigator />
      :
        <AuthStackNavigator />
      }
    </NavigationContainer>
  )
}

export default MainStackNavigator;