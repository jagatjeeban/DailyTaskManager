import { View, Text, Image, Platform } from 'react-native'
import React from 'react'

type NotFoundParams = {
    title: string
}

const NotFound = ({title}: NotFoundParams) => {
  return (
    <View style={{alignItems:'center', justifyContent:'center', width:'100%'}}>
      <Image source={require('../../assets/empty_box.png')} style={{width: 120, height: 120}} />
      <Text numberOfLines={3} style={{color:'black', fontSize: 20, fontWeight:'200', marginTop: 10}}>{`No ${title} found!`}</Text>
    </View>
  )
}

export default NotFound;