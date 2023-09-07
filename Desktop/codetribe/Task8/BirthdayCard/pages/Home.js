import React, { useEffect, useState } from 'react'
import { View ,Text ,StyleSheet, TextInput, Button, ImageBackground} from 'react-native'


function Home() {

  const [recipient,setRecipient] = useState('')
  const [message, setMessege ] = useState([])
  const [sender ,setSender ] = useState('')

  const addToCard = (text) =>{

    setMessege(message => {
      return [...message, text.trim()]
    })
  }
  const clearState  = () =>{
    setRecipient('')
    setMessege([])
    setSender('')
    console.log(cleared)
  } 




  useEffect(() =>{
    console.log(recipient);
  },[recipient])

  useEffect(() =>{
    console.log(sender)
  },[sender])

  useEffect(() =>{
    console.log(message)
  },[message])

  return (
    <View style={styles.card} >
      <Text style={styles.label}>Recipient:</Text>
  
      <TextInput
        
        style={{borderColor:'pink',borderWidth:1,borderRadius:5}}
        onChange={(ev) => setRecipient(ev.target.value)}
      
        />


      <Text style={styles.label}>Message:</Text>
      <TextInput 
        style={{borderColor:'pink',borderWidth:1,borderRadius:5}}
        onChange={(ev) => setMessege(ev.target.value)}/>

      <Text style={styles.label}>Sender:</Text>
      <TextInput 
        style={{borderColor:'pink',borderWidth:1,borderRadius:5}}
        onChange={(ev) => setSender(ev.target.value)}/>
     
      <Button 
        style={{backgroundColor: 'pink', borderRadius: 5 , color: 'pink'}} 
        onPress={() => { clearState()}} title='clear '
      />  

      <View style={styles.diplay}>

      <ImageBackground
        source={require('../assets/frame.png')}
        style={styles.ImageBackground}
      >

      <Text style={styles.recipient}>To:{recipient}</Text>
       <Text style={styles.message}>{message}</Text>
       <Text style={styles.sender}>from:{sender}</Text>
      
       </ImageBackground>

       </View>
       
    </View>
  )
}
const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    margin: 20,
    padding: 16, 
    
  },
  label: {
    fontWeight: 'bold',
  },
  ImageBackground: {
    flex: 1, 
    resizeMode: 'cover', 
    justifyContent: 'center', 
    width: 800,
    height: 600,
    alignItems: 'center',
   
  },
  container: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  text: {
    color: 'white', 
    fontSize: 24,
  },
  diplay:{
    marginTop:50,
  },
  recipient:{
    marginTop: 200,
    marginLeft:10,
    fontSize: 24, 
    color: 'gray', 
    fontFamily: 'Arial',
    fontWeight: 'bold',
    
  },
  message:{
    marginTop: 100,
    marginLeft:10,
    fontSize: 24, 
    color: 'gray', 
    fontFamily: 'Arial', 
    fontWeight: 'bold', 
  },
  sender:{
    marginTop: 50,
    marginLeft:10,
    fontSize: 24, 
    color: 'gray',
    fontFamily: 'Arial', 
    fontWeight: 'bold', 
  } 

  
});

export default Home
