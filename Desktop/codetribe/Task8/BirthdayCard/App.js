import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './pages/Home'

export default function App() {

  // const cardData = {
  //   recipient: 'John Doe',
  //   message: 'Happy Birthday! Wishing you a fantastic day!',
  //   sender: 'Jane Smith',
  // };
  return (
    <View style={styles.container}>
      <Home  />
     
      <StatusBar style="auto" />
    </View>
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
