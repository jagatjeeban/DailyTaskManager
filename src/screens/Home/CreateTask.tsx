import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '../../navigations/HomeStack'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import RBSheet from 'react-native-raw-bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { showMessage } from 'react-native-flash-message'
import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants'

interface CreateScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'CreateTask'>
}

interface formObject {
  'title': string,
  'dueDate': string,
  'description': string,
  'status': string
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const CreateTask = ({navigation}: CreateScreenProps) => {

  const route                                             = useRoute<RouteProp<HomeStackParamList, 'CreateTask'>>();
  const isFocused                                         = useIsFocused();
  const statusArr                                         = ['Yet to Start', 'Pending', 'Completed'];
  const [ formValue, setFormValue ]                       = useState<formObject>({title: '', dueDate: '', description: '', status: ''});
  const [ dateTimePickerStatus, setDateTimePickerStatus ] = useState<boolean>(false);
  const [ formActionStatus, setFormActionStatus ]         = useState<string>('add');
  const statusRef                                         = useRef<any>(null);
  const notificationListener                              = useRef<Notifications.Subscription>();
  const responseListener                                  = useRef<Notifications.Subscription>();

  interface formParams {
    value: string,
    name: string
  }

  //function to set the input into state
  const addIntoForm = ({value, name}: formParams) => {
    setFormValue((formValue) => ({...formValue, [name]: value}));
  }

  //function to set the deadline
  const setDateTime = (req: Date) => {
    addIntoForm({value: req.toISOString(), name: 'dueDate'})
    setDateTimePickerStatus(false);
  }

  //status bottomsheet component
  const StatusBottomSheet = ({refRBSheet}: any) => {
    return(
      <RBSheet ref={refRBSheet} height={200} customStyles={{container: styles.bottomSheetContainer, draggableIcon: styles.pillBarStyle}} closeOnPressBack draggable >
        <View>
          <View style={styles.bottomSheetHeader} >
            <Text style={styles.bottomSheetHeaderTitle}>Select Status</Text>
          </View>
          <View style={{paddingHorizontal: 20, paddingTop:10}}>
            {statusArr.map((item, index) => {
              return(
                <TouchableOpacity key={index} onPress={() => addIntoForm({value: item, name: 'status'})} style={{paddingVertical: 5}}>
                  <Text style={{color:'black', fontSize: 15, fontWeight: '400'}}>{item}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </RBSheet>
    )
  }

  //function to save the tasks 
  const saveTaskInfo = async() => {
    let tasks: string;
    let newTaskArr = [];
    let prevTaskArr: string | null = await AsyncStorage.getItem('TASK_LIST');
    const taskList: Array<formObject> | null = prevTaskArr? JSON.parse(prevTaskArr): null;
    if(taskList){
      taskList.push(formValue);
      tasks = JSON.stringify(taskList);
    } else {
      newTaskArr.push(formValue);
      tasks = JSON.stringify(newTaskArr);
    }
    await AsyncStorage.setItem('TASK_LIST', tasks);
    schedulePushNotification();
    navigation.goBack();
  }

  //function to update any task
  const updateTaskInfo = async() => {
    let prevTaskArr: string | null = await AsyncStorage.getItem('TASK_LIST');
    const taskList: Array<formObject> | null = prevTaskArr? JSON.parse(prevTaskArr): null;
    const taskIndex: number | undefined = taskList?.findIndex(item => item?.title === route?.params?.task?.title);
    if(taskIndex && taskIndex !== -1){
      let updatedList = [...(taskList ?? [])];
      updatedList[taskIndex] = formValue;
      await AsyncStorage.setItem('TASK_LIST', JSON.stringify(updatedList));
    }
    schedulePushNotification();
    navigation.goBack();
  }

  //function to validate the form
  const validateForm = () => {
    if(formValue?.title === ''){
      showMessage({message: 'Title', description:'Task Title can not be empty', type:'danger', icon:'danger'});
    }
    else if(formValue?.dueDate === ''){
      showMessage({message: 'Deadline', description:'Task Deadline can not be empty', type:'danger', icon:'danger'});
    }
    else if(formValue?.description === ''){
      showMessage({message: 'Description', description:'Task Description can not be empty', type:'danger', icon:'danger'});
    }
    else if(formValue?.status === ''){
      showMessage({message: 'Status', description:'Task Status can not be empty', type:'danger', icon:'danger'});
    }
    else {
      if(formActionStatus === 'add'){
        saveTaskInfo();
      } else {
        updateTaskInfo();
      }
    }
  }

  //function to register for push notifications
  const registerForPushNotificationsAsync = async() => {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  //function to schedule for push notifications
  const schedulePushNotification = async() => {
    const scheduledDate: any = moment(formValue?.dueDate);
    const currentDate: any = moment();
    const secondsLeft: number = scheduledDate.diff(currentDate, 'seconds');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: formValue?.title,
        body: formValue?.description,
        data: { data: 'goes here', test: { test1: 'more data' } },
      },
      trigger: { seconds: Number(secondsLeft) > 0? Number(secondsLeft): 1 },
    });
  }

  useEffect(() => {
    if(isFocused){
      if(route?.params?.task){
        setFormActionStatus('edit');
        addIntoForm({value: route?.params?.task?.title,       name: 'title'});
        addIntoForm({value: route?.params?.task?.dueDate,     name: 'dueDate'});
        addIntoForm({value: route?.params?.task?.description, name: 'description'});
        addIntoForm({value: route?.params?.task?.status,      name: 'status'});
      }
    }
  }, [isFocused]);

  useEffect(() => {
    registerForPushNotificationsAsync();

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync();
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' extraScrollHeight={150} contentContainerStyle={{paddingHorizontal: 20, paddingTop: 70, paddingBottom: 100}}>
        <View style={{marginBottom: 100}}>
          <Text style={styles.welcomeText}>{formActionStatus === 'add'? 'Create a New Task': 'Update the Task'}</Text>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Title</Text>
          <TextInput
            placeholder={'Enter Task Title'}
            value={formValue?.title}
            style={styles.inputContainer}
            keyboardType={'default'}
            onChangeText={(e) => addIntoForm({value: e, name: 'title'})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Deadline</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setDateTimePickerStatus(true)} style={styles.inputContainer}>
            <Text style={formValue?.dueDate === ''? styles.placeholderText: styles.inputText}>{formValue?.dueDate !== ''? moment(formValue?.dueDate).format('DD MMM YYYY'): 'Select Date'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Text style={styles.inputTitle}>Description</Text>
            <Text style={{color:'grey', fontSize: 15, fontWeight:'400'}}>{`${formValue?.description?.length} / 150`}</Text>
          </View>
          <TextInput
            placeholder={'Enter Task Description'}
            value={formValue?.description}
            style={styles.inputContainer}
            multiline
            maxLength={150}
            keyboardType={'default'}
            onChangeText={(e) => addIntoForm({value: e, name: 'description'})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.inputTitle}>Status</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => statusRef.current.open()} style={styles.inputContainer}>
            <Text style={formValue?.status === ''? styles.placeholderText: styles.inputText}>{formValue?.status !== ''? formValue?.status: 'Select Status'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={{color:'black', fontSize: 15, fontWeight: '500'}}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={async() => validateForm()} style={styles.createBtn}>
          <Text style={{color:'white', fontSize: 15, fontWeight: '500'}}>{formActionStatus === 'add'? 'Create':'Update'}</Text>
        </TouchableOpacity>
      </View>
      <DateTimePicker
        isVisible={dateTimePickerStatus}
        mode={'date'}
        minimumDate={new Date()}
        onConfirm={(req) => setDateTime(req)}
        onCancel={() => setDateTimePickerStatus(false)}
      />
      <StatusBottomSheet refRBSheet={statusRef} />
    </SafeAreaView>
  )
}

export default CreateTask;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor:'white'
  },
  welcomeText: {
    fontSize: 40, 
    fontWeight: '600', 
    textAlign:'center'
  },
  inputTitle: {
    fontSize: 20, 
    fontWeight:'400', 
    marginBottom: 10
  },
  inputContainer: {
    padding: 10, 
    borderWidth: 1, 
    borderColor: 'grey', 
    borderRadius: 10
  },
  cancelBtn: {
    width:'48%', 
    alignItems:'center', 
    justifyContent:"center", 
    backgroundColor:'white', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor:'black', 
    paddingVertical: 10
  },
  createBtn: {
    width:'48%', 
    alignItems:'center', 
    justifyContent:"center", 
    backgroundColor:'black', 
    borderRadius: 10, 
    paddingVertical: 10
  },
  actionBtnContainer: {
    position:'absolute', 
    bottom:0, 
    paddingBottom: Platform.OS === 'ios'? 40: null, 
    width:'100%', 
    padding: 20, 
    flexDirection:'row', 
    alignItems:"center", 
    justifyContent:"space-between",
    backgroundColor:'white'
  },
  placeholderText: {
    color:'grey', 
    fontSize: 15, 
    fontWeight:'400'
  },
  inputText: {
    color:'black',
    fontSize: 15,
    fontWeight: '400'
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  pillBarStyle: {
    width: 50,
    height: 3,
    borderRadius: 50,
    backgroundColor:'grey'
  },
  bottomSheetHeader: {
    backgroundColor:'white', 
    borderBottomWidth: 0.4, 
    borderColor:'grey', 
    paddingHorizontal: 20, 
    paddingBottom: 15
  },
  bottomSheetHeaderTitle: {
    color:'black', 
    fontSize: 20, 
    fontWeight:'500'
  },
})