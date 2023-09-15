import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState ,useEffect} from 'react'
import { auth } from './firebase';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core'


const login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    const handleSignUp = () => {

        try {
            createUserWithEmailAndPassword(auth,email, password)
           .then((userCredential) =>{
            const user = userCredential.user;
            console.log('User registered:', user);
           })
            
          } catch (error) {
            console.error('Error registering user:', error);
          }
        
    }

    const handleLogin = () => {
        
            signInWithEmailAndPassword(auth,email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            navigation.navigate("home")
            console.log('Logged in with:', user.email);
          })
          .catch(error => alert(error.message))
      }

      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            navigation.navigate("home")
          }
        })
    
        return unsubscribe
      }, [])  
    
    return (
        <KeyboardAvoidingView style={styles.container}
            behavior='padding'>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={text => setEmail(text)}
                  
                    style={styles.input}
                ></TextInput>
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                   
                ></TextInput>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => handleLogin()}
                    style={styles.button}
                >
                <Text style={styles.buttonOutlineText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleSignUp()}
                    style={[styles.button, styles.buttonOutline]}
                >
                <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    )
}

export default login

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        
    },
    inputContainer: {
        width: '50%',
        marginTop:15,
        margin:40,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#0783f9',
        width: '15%',
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    buttonOutline: {
        backgroundColor: 'white',
        margin: 5,
        borderColor: '#078f9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        fontWeight: '700',
        fontSize: 16,
       
    },

})