import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '../../navigations/HomeStack'
import { useIsFocused } from '@react-navigation/native'
import { useAppDispatch } from '../../store/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

//import components
import { NotFound } from '../../components'

//import redux actions
import { logOutEvent } from '../../store/authSlice'

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>
}

const Home = ({navigation}: HomeScreenProps) => {

  interface TaskListParams {
    title: string,
    dueDate: string,
    description: string,
    status: string
  }

  type TaskHeaderParams = {
    headerTitle: string,
    isShown: boolean
  }

  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();

  const [ userName, setUserName ]                  = useState<string | null>('');
  const [ taskList, setTaskList ]                  = useState<Array<TaskListParams>>([]);

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

  //function to get the status background color
  const getStatusBgColor = (status: string) => {
    if(status === 'Yet to Start') return 'orange';
    if(status === 'Pending')      return '#1296B0';
    if(status === 'Completed')    return 'green';
  }

  //page header component
  const PageHeader = () => {
    return(
      <View style={styles.pageHeaderContainer}>
        <View style={{maxWidth:'80%'}}>
          <Text style={{color: 'black', fontSize: 40, fontWeight: '200'}}>{`Good ${getGreeting()},`}</Text>
          <Text style={{color: 'black', fontSize: 40, fontWeight: '500'}}>{userName}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => dispatch(logOutEvent())}>
          <Image source={require('../../../assets/sign_out.png')} style={{height: 30, width: 30}} />
        </TouchableOpacity>
      </View>
    )
  }

  //task header component
  const TaskHeader = ({headerTitle, isShown}: TaskHeaderParams) => {
    return(
      <View style={styles.taskHeaderContainer}>
          <Text style={{color: 'black', fontSize: 30, fontWeight: '400'}}>{headerTitle}</Text>
          {isShown? 
            <TouchableOpacity>
              <Text style={{color:'black', fontSize: 15, fontWeight: '500'}}>View All</Text>
            </TouchableOpacity>
          : null}
        </View>
    )
  }

  //task item component
  const TaskItem = ({item, index}: any) => {
    return(
      <View key={index} style={[styles.taskItemContainer, styles.shadow]}>
        <View style={styles.taskItemHeader}>
          <Text numberOfLines={2} style={styles.taskTitleText}>{item?.title}</Text>
          <View style={[styles.taskStatusContainer, {backgroundColor: moment(item?.dueDate).isBefore(new Date(), 'date')? 'red': getStatusBgColor(item?.status)}]}>
            <Text style={{color:'white', fontSize: 15, fontWeight:'500'}}>{moment(item?.dueDate).isBefore(new Date(), 'date')? 'Expired': item?.status}</Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 15}}>
          <View style={styles.taskDeadlineContainer}>
            <Text style={{color:'black', fontSize: 15, fontWeight:'500'}}>Deadline: </Text>
            <Text style={styles.taskDescriptionText}>{moment(item?.dueDate).format('DD MMM YYYY')}</Text>
          </View>
          <Text style={styles.taskDescriptionText}>{item?.description}</Text>
        </View>
        <View style={styles.taskItemBtnContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('CreateTask', {task: item})} style={[styles.taskActionBtn, {borderRightWidth: 0.4, borderColor:"grey"}]}>
            <Text style={styles.taskActionText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => deleteTask(index)} style={styles.taskActionBtn}>
            <Text style={[styles.taskActionText, {color: 'red'}]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  //function to get the user name
  const getUserName = async() => {
    let user: string | null;
    user = await AsyncStorage.getItem('USER_INFO');
    const userName: string | null = user? JSON.parse(user)?.name: null;
    setUserName(userName);
  }

  //function to delete any task
  const deleteTask = async(index: number) => {
    let updatedList = [...taskList];
    updatedList.splice(index, 1);
    await AsyncStorage.setItem('TASK_LIST', JSON.stringify(updatedList));
    setTaskList(updatedList);
  }

  //function to get all the tasks
  const getAllTasks = async() => {
    let tasks: string | null;
    tasks = await AsyncStorage.getItem('TASK_LIST');
    const taskList: Array<TaskListParams> | null = tasks? JSON.parse(tasks): null;
    if(taskList){
      setTaskList(taskList);
    }
  }

  useEffect(() => {
    getUserName();
  }, []);

  useEffect(() => {
    if(isFocused){
      getGreeting();
      getAllTasks();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <PageHeader />
      {taskList?.length > 0? 
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
          <View style={{marginTop: 30}}>
            <TaskHeader headerTitle={`Today's Tasks`} isShown={taskList.filter(item => moment(item?.dueDate).isSame(new Date(), 'date'))?.length > 3} />
            <FlatList
              data={taskList.filter(item => moment(item?.dueDate).isSame(new Date(), 'date'))}
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
            <TaskHeader headerTitle={'Upcoming Tasks'} isShown={taskList.filter(item => moment(item?.dueDate).isAfter(new Date(), 'date'))?.length > 3} />
            <FlatList
              data={taskList.filter(item => moment(item?.dueDate).isAfter(new Date(), 'date'))}
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
            <TaskHeader headerTitle={'All Tasks'} isShown={taskList?.length > 3} />
            <FlatList
              data={taskList}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={TaskItem}
              style={{paddingVertical: 10}}
              contentContainerStyle={{alignItems:'center'}}
              ListHeaderComponent={() => <View style={styles.width20} />}
              ListFooterComponent={() => 
                taskList?.length > 3? 
                  <TouchableOpacity onPress={() => null} style={{paddingHorizontal: 40, paddingVertical:10}} >
                    <Text style={{color:'black', fontSize: 20, fontWeight:'500'}}>View All</Text>
                  </TouchableOpacity>
                : <View style={styles.width20} />
              }
              ListEmptyComponent={() => <View style={{marginTop: 30}}><NotFound title={'Task'} /></View>}
              ItemSeparatorComponent={() => <View style={styles.width20} />}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>
        </ScrollView>
      :
        <View style={{marginTop:'50%', alignItems:'center', paddingRight:'10%'}}>
          <NotFound title={'Task'} />
        </View>
      }
      <View style={styles.createTaskBtnContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('CreateTask', {task: null})} style={styles.createBtn}>
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
    width:'100%',
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
  pageHeaderContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    padding: 20,
    backgroundColor:'white'
  },
  taskHeaderContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    marginBottom: 10, 
    marginHorizontal: 20
  },
  taskActionBtn: {
    alignSelf:"center", 
    alignItems:'center', 
    justifyContent:"center", 
    paddingVertical: 15, 
    width:"50%"
  },
  taskStatusContainer: {
    borderRadius: 6, 
    paddingHorizontal:7, 
    paddingVertical: 5, 
    alignItems:'center', 
    justifyContent:'center'
  },
  createTaskBtnContainer: {
    backgroundColor:'white', 
    padding: 20, 
    paddingBottom: 30, 
    position:"absolute", 
    bottom:0, 
    width:'100%'
  },
  taskDeadlineContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    marginBottom: 5
  },
  taskTitleText: {
    color:'black', 
    fontSize: 20, 
    fontWeight:'500', 
    maxWidth: '70%'
  },
  taskDescriptionText: {
    color:'black', 
    fontSize: 15, 
    fontWeight:'400'
  },
  taskActionText: {
    color: 'black', 
    fontSize: 15, 
    fontWeight: '600'
  },
})