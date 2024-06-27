import { StyleSheet } from 'react-native';
import MainStackNavigator from './src/navigations';
import FlashMessage from 'react-native-flash-message';

export default function App() {
  return (
    <>
      <MainStackNavigator />
      <FlashMessage position={'bottom'} floating />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
