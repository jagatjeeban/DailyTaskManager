import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { HomeStackParamList } from '../../navigations/HomeStack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment'

//import common functions
import { getStatusBgColor } from '../../common/commonFun'

//import components
import { NotFound } from '../../components'

interface AllTasksScreenProps {
    navigation: NativeStackNavigationProp<HomeStackParamList, 'AllTasks'>
}

const AllTasks = ({navigation}: AllTasksScreenProps) => {

  interface TaskListParams {
    title: string,
    dueDate: string,
    description: string,
    status: string
  }

  const isFocused                                  = useIsFocused();
  const [ taskList, setTaskList ]                  = useState<Array<TaskListParams>>([]);
  const [ filteredTaskList, setFilteredTaskList ]  = useState<Array<TaskListParams>>([]);
  const [ activeTabId, setActiveTabId ]            = useState<number>(1);

  //page header component
  const PageHeader = () => {

    const pendingTaskCount: number = taskList.filter(task => task?.status === 'Pending')?.length;
    const yetToStartTaskCount: number = taskList.filter(task => task?.status === 'Yet to Start')?.length;
    const completedTaskCount: number = taskList.filter(task => task?.status === 'Completed')?.length;

    return(
        <View style={styles.tabsContainer}>
            <View style={styles.rowTabContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => [setActiveTabId(1), setFilteredTaskList(taskList)]} style={[styles.tabBtnContainer, {backgroundColor: activeTabId === 1? 'black':'white'}]}>
                    <Text style={{color: activeTabId === 1? 'white':'black', fontSize: 15, fontWeight:'600'}}>{`All Tasks (${taskList?.length})`}</Text> 
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => [setActiveTabId(2), setFilteredTaskList(taskList.filter(task => task?.status === 'Pending'))]} style={[styles.tabBtnContainer, {backgroundColor: activeTabId === 2? '#1296B0': 'white', borderColor:'#1296B0'}]}>
                    <Text style={{color: activeTabId === 2? 'white': '#1297B0', fontSize: 15, fontWeight:'600'}}>{`Pending (${pendingTaskCount})`}</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.rowTabContainer, {marginTop: 15}]}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => [setActiveTabId(3), setFilteredTaskList(taskList.filter(task => task?.status === 'Yet to Start'))]} style={[styles.tabBtnContainer, {backgroundColor: activeTabId === 3? 'orange':'white', borderColor:'orange'}]}>
                    <Text style={{color: activeTabId === 3? 'white':'orange', fontSize: 15, fontWeight:'600'}}>{`Yet to Start (${yetToStartTaskCount})`}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => [setActiveTabId(4), setFilteredTaskList(taskList.filter(task => task?.status === 'Completed'))]} style={[styles.tabBtnContainer, {backgroundColor: activeTabId === 4? 'green': 'white', borderColor:'green'}]}>
                    <Text style={{color: activeTabId === 4? 'white': 'green', fontSize: 15, fontWeight:'600'}}>{`Completed (${completedTaskCount})`}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
  }

  //task item component
  const TaskItem = ({item, index}: any) => {
    const taskIndex: number = taskList.indexOf(item);
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
          <TouchableOpacity activeOpacity={0.7} onPress={() => deleteTask(taskIndex)} style={styles.taskActionBtn}>
            <Text style={[styles.taskActionText, {color: 'red'}]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  //function to get all the tasks
  const getAllTasks = async() => {
    let tasks: string | null;
    tasks = await AsyncStorage.getItem('TASK_LIST');
    const taskList: Array<TaskListParams> | null = tasks? JSON.parse(tasks): null;
    if(taskList){
      setTaskList(taskList);
      setFilteredTaskList(taskList);
    }
  }

  //function to delete any task
  const deleteTask = async(index: number) => {
    let updatedList = [...taskList];
    updatedList.splice(index, 1);
    await AsyncStorage.setItem('TASK_LIST', JSON.stringify(updatedList));
    setTaskList(updatedList);
    if(activeTabId === 1) setFilteredTaskList(updatedList);
    if(activeTabId === 2) setFilteredTaskList(updatedList.filter(task => task?.status === 'Pending'));
    if(activeTabId === 3) setFilteredTaskList(updatedList.filter(task => task?.status === 'Yet to Start'));
    if(activeTabId === 4) setFilteredTaskList(updatedList.filter(task => task?.status === 'Completed'));
  }

  useEffect(() => {
    if(isFocused){
        getAllTasks();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
        <PageHeader />
        <View>
            <FlatList
              data={filteredTaskList}
              showsVerticalScrollIndicator={false}
              renderItem={TaskItem}
              ListHeaderComponent={() => <View style={styles.height20} />}
              ListFooterComponent={() => <View style={{height: 200}} />}
              ListEmptyComponent={() => <View style={styles.emptyListContainer}><NotFound title={'Task'} /></View>}
              ItemSeparatorComponent={() => <View style={styles.height20} />}
              keyExtractor={(_, index) => index.toString()}
            />
        </View>
    </SafeAreaView>
  )
}

export default AllTasks;

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor:'white'
    },
    height20: {
        height: 20
    },
    emptyListContainer: {
        marginTop: '40%', 
        paddingRight: '10%', 
        alignItems:'center'
    },
    tabsContainer: {
        padding: 20, 
        backgroundColor:'white'
    },
    tabBtnContainer: {
        backgroundColor:'black', 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: 'black', 
        paddingVertical: 10, 
        width:'48%', 
        alignItems:'center', 
        justifyContent:"center"
    },
    rowTabContainer: {
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:"space-between"
    },
    taskItemContainer: {
        marginHorizontal: 20,
        paddingTop: 15,
        borderRadius: 12, 
        backgroundColor:'white', 
    },
    shadow: {
        elevation: 10, 
        shadowColor: Platform.OS === 'ios'? '#D4D4D4':'grey', 
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
    taskItemBtnContainer: {
        flexDirection:'row', 
        alignItems:"center", 
        borderTopWidth: 0.4, 
        borderColor:'grey', 
        marginTop: 20
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
    taskDeadlineContainer: {
        flexDirection:'row', 
        alignItems:'center', 
        marginBottom: 5
    },
})