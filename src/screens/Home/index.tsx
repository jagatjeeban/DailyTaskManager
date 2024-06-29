import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '../../navigations/HomeStack'
import { useIsFocused } from '@react-navigation/native'
import { useAppDispatch } from '../../store/hooks'

//import components
import { NotFound } from '../../components'
import { logOutEvent } from '../../store/authSlice'

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>
}

const Home = ({navigation}: HomeScreenProps) => {

  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();

  //function to get the greeting text
  const getGreeting = () => {
    const date = new Date();
    const hours = date.getHours();
    if(hours > 0 && hours <= 12){
      return 'Morning';
    }
    else if(hours > 12 && hours <= 17){
      return 'Afternoon';
    }
    else {
      return 'Evening';
    }
  }

  //page header component
  const PageHeader = () => {
    return(
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', margin: 20}}>
        <View>
          <Text style={{color: 'black', fontSize: 40, fontWeight: '200'}}>{`Good ${getGreeting()},`}</Text>
          <Text style={{color: 'black', fontSize: 40, fontWeight: '500'}}>Jagat Jeeban</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => dispatch(logOutEvent())}>
          <Image source={require('../../../assets/sign_out.png')} style={{height: 30, width: 30}} />
        </TouchableOpacity>
      </View>
    )
  }

  type TaskHeaderParams = {
    headerTitle: string
  }

  //task header component
  const TaskHeader = ({headerTitle}: TaskHeaderParams) => {
    return(
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom: 10, marginHorizontal: 20}}>
          <Text style={{color: 'black', fontSize: 30, fontWeight: '400'}}>{headerTitle}</Text>
          <TouchableOpacity>
            <Text style={{color:'black', fontSize: 15, fontWeight: '500'}}>View All</Text>
          </TouchableOpacity>
        </View>
    )
  }

  //task item component
  const TaskItem = ({item}: any) => {
    return(
      <View style={[styles.taskItemContainer, styles.shadow]}>
        <View style={styles.taskItemHeader}>
          <Text numberOfLines={2} style={{color:'black', fontSize: 20, fontWeight:'500', maxWidth: '50%'}}>Title</Text>
          <View style={{backgroundColor: 'orange', borderRadius: 6, paddingHorizontal:7, paddingVertical: 5, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'white', fontSize: 15, fontWeight:'500'}}>Yet to Start</Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 15}}>
          <View style={{flexDirection:'row', alignItems:'center', marginBottom: 5}}>
            <Text style={{color:'black', fontSize: 15, fontWeight:'500'}}>Deadline: </Text>
            <Text style={{color:'black', fontSize: 15, fontWeight:'400'}}>12/05/2024</Text>
          </View>
          <Text style={{color:'black', fontSize: 15, fontWeight:'400'}}>Complete the design development as soon as possible.</Text>
        </View>
        <View style={styles.taskItemBtnContainer}>
          <TouchableOpacity activeOpacity={0.7} style={{alignSelf:"center", alignItems:'center', justifyContent:"center", paddingVertical: 15, borderRightWidth: 0.4, borderColor:"grey", width:"50%"}}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: '600'}}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={{alignSelf:"center", alignItems:'center', justifyContent:"center", paddingVertical: 15, width:"50%"}}>
            <Text style={{color: 'red', fontSize: 15, fontWeight: '600'}}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  useEffect(() => {
    if(isFocused){
      getGreeting();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <PageHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 30}}>
          <TaskHeader headerTitle={`Today's Tasks`} />
          <FlatList
            data={[1, 2, 3]}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingVertical: 10}}
            renderItem={TaskItem}
            ListHeaderComponent={() => <View style={styles.width20} />}
            ListFooterComponent={() => <View style={styles.width20} />}
            ListEmptyComponent={() => <View style={{marginTop: 30}}><NotFound title={`Today's Task`} /></View>}
            ItemSeparatorComponent={() => <View style={styles.width20} />}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
        <View style={{marginTop: 30}}>
          <TaskHeader headerTitle={'Upcoming Tasks'} />
          <FlatList
            data={[1, 2, 3]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={TaskItem}
            style={{paddingVertical: 10}}
            ListHeaderComponent={() => <View style={styles.width20} />}
            ListFooterComponent={() => <View style={styles.width20} />}
            ListEmptyComponent={() => <View style={{marginTop: 30}}><NotFound title={'Upcoming Task'} /></View>}
            ItemSeparatorComponent={() => <View style={styles.width20} />}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
        <View style={{marginTop: 30}}>
          <TaskHeader headerTitle={'All Tasks'} />
          <FlatList
            data={[1, 2, 3]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={TaskItem}
            style={{paddingVertical: 10}}
            contentContainerStyle={{alignItems:'center'}}
            ListHeaderComponent={() => <View style={styles.width20} />}
            ListFooterComponent={() => 
              <TouchableOpacity onPress={() => null} style={{paddingHorizontal: 40, paddingVertical:10}} >
                <Text style={{color:'black', fontSize: 20, fontWeight:'500'}}>View All</Text>
              </TouchableOpacity>
            }
            ListEmptyComponent={() => <View style={{marginTop: 30}}><NotFound title={'Task'} /></View>}
            ItemSeparatorComponent={() => <View style={styles.width20} />}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </ScrollView>
      <View style={{backgroundColor:'white', paddingTop: 20}}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('CreateTask')} style={styles.createBtn}>
          <Text style={{color:'white', fontSize:20, fontWeight: '400'}}>Create New Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Home;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'white'
  },
  width20: {
    width: 20
  },
  taskItemContainer: {
    width: 350, 
    paddingTop: 15,
    borderRadius: 12, 
    backgroundColor:'white', 
  },
  shadow: {
    elevation: 10, 
    shadowColor:'#D4D4D4', 
    shadowRadius: 3, 
    shadowOpacity: 1, 
    shadowOffset: {width: 0, height: 1}
  },
  taskItemHeader: {
    flexDirection:'row', 
    paddingHorizontal: 15,
    alignItems:'flex-start', 
    justifyContent:'space-between',
    marginBottom: 10
  },
  createBtn: {
    width:'90%',
    alignSelf:'center',
    backgroundColor:'black', 
    alignItems:'center', 
    justifyContent:'center', 
    marginHorizontal: 20, 
    paddingVertical: 15, 
    borderRadius: 12, 
  },
  taskItemBtnContainer: {
    flexDirection:'row', 
    alignItems:"center", 
    borderTopWidth: 0.4, 
    borderColor:'grey', 
    marginTop: 20
  },
})