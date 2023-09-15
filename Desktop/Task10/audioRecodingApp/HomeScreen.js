import { Button, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/core'
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { db, storage, auth } from './firebase';
import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';



const HomeScreen = () => {

  const recordingSettings = {
    android: {
      extension: ".m4a",
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".m4a",
      outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };


  const user = auth.currentUser;
  // const db = firebase.database();

  console.log(user);

  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [title, setTitle] = useState('');
  const [messege, setMessege] = useState("")
  const [editTitle, setEditTitle] = useState('')

  const navigation = useNavigation()

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });

        const { recording } = await Audio.Recording.createAsync(
          recordingSettings
        );
        setRecording(recording);

      } else {
        setMessege("please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error('failed to start recording', err);
    }
  }

  async function stopRecording() {

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const audioFile = await recording.getURI();

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          try {
            resolve(xhr.response);
          } catch (error) {
            console.log("error:", error);
          }
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", audioFile, true);
        xhr.send(null);
      });
      console.log('Time==', status)
      if (blob != null) {

        const audioFileRef = ref(storage, `audio/${title}`);
        const uploadTask = uploadBytes(audioFileRef, blob).then(() => {
          getDownloadURL(audioFileRef).then(async (url) => {
            await addDoc(collection(db, 'recordings'), {
              title: title,
              duration: getDurationFormatted(status.durationMillis),
              fileURL: url,
            });
          });
        });

        let updatedRecordings = [
          ...recordings,
          {
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: audioFile,
            title: title,
          },
        ];
        setRecordings(updatedRecordings);
        setRecording(null);
        setTitle('');
      }

    } catch (err) {
      console.log(err);
    }
    console.log('==========', recordings);
  }

  function getDurationFormatted(millis) {

    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60)
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}: ${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>

          <Text style={styles.fill}>
            {recordingLine.title} - {recordingLine.duration}
          </Text>
          <Foundation name="play-circle"
            onPress={() => recordingLine.sound.replayAsync()}
            size={25} color="black" />


          {editTitle === index ? (
            <View style={styles.editContainer}>


              <Button
                style={styles.button}
                onPress={() => updateRecording(index)}
                title="Update"
              />


            </View>
          ) : (
            <View>

              <MaterialCommunityIcons name="circle-edit-outline"
                onPress={() => editRecording(index)}
                size={24} color="black" />

            </View>

          )}
          <MaterialCommunityIcons name="delete-circle-outline"
            size={24}
            onPress={() => removeRecording(index)}
            color="black" />

        </View>
      );
    });
  }


  async function updateRecording(index) {

    const recording = recordings[index]
    console.log(recordings[index]);
    try {

      const recordingRef = doc(db, 'recordings', recording.fireatoreDocId);
      await updateDoc(recordingRef, { title: title });
      console.log('Recording title updated in Firestore');

      const updatedRecordings = [...recordings];
      updatedRecordings[index].title = title;

      setRecordings(updatedRecordings);


      setEditTitle('');
    } catch (error) {
      console.error('Error updating recording title in Firestore:', error);
    }



  }

  function editRecording(index) {

    setEditTitle(index)
    setTitle(recordings[index].title)


  }

  async function removeRecording(index) {

    const recording = recordings[index]
    console.log(recordings[index]);

    try {

      const recordingRef = doc(db, 'recordings', recording.fireatoreDocId);
      await deleteDoc(recordingRef);
      console.log('Recording deleted from firestore');


      const audioRef = ref(storage, `audio/${recording.title}`)
      await deleteObject(audioRef)
      console.log('Recording deleted from storage');

      const updatedRecordings = recordings.filter((_, i) => i !== index)
      setRecordings(updatedRecordings);


    } catch (error) {
      console.error('Error deleting recording title in Firestore:', error);
    }

  }

  const fetchData = async () => {


    try {
      const recordCollection = collection(db, 'recordings');
      const recordSnapshot = await getDocs(
        query(recordCollection)
      );


      const loadedRecordings = [];
      recordSnapshot.forEach((doc) => {
        const recordData = doc.data();
        loadedRecordings.push({
          fireatoreDocId: doc.id,
          ...recordData,
        })
        setRecordings(loadedRecordings)
        console.log("loaded", loadedRecordings);
      });

    } catch (error) {
      console.log(err);
    }

  }



  useEffect(() => {
    fetchData()

  }, [])



  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("login")
      })
      .catch(error => alert(error.message))
  }
  return (
    <>
      <View style={styles.container}>
        <Text  style={styles.line}>Ready to make some soundwaves together?</Text>
        <Text>{messege}</Text>
        <TextInput
          onChangeText={text => setTitle(text)}
          placeholder='title'
          style={styles.inputText}
          value={title} />


        <MaterialCommunityIcons name="record-rec"
          onPress={recording ? stopRecording : startRecording}
          size={100} color="red" />
        {getRecordingLines()}

        <StatusBar style="auto" />
      </View>

      <View style={styles.container3}>
        <Text>Email: {auth.currentUser?.email}</Text>
        <TouchableOpacity
          onPress={() => handleSignOut()}
          style={styles.button1}
        >
          <Text style={styles.buttonText1}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button1: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText1: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#BAE5E3',
    alignItems: 'center',
    justifyContent: 'center',

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16,
    fontSize: 20,
    color: '#153638',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  button: {

    backgroundColor: 'red',
    border: 'none',
    color: 'white',
    padding: 15,
    textAlign: 'center',
    display: 'inlineBlock',
    fontSize: 16,
    margin: 4,
  },
  editContainer: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,

  },

  inputText: {
    width: 250,
    backgroundColor: '#378D90',
    color: 'white',
    padding: 14,
    margin: 8,
    border: 1,
    borderRadius: 4,
    boxSizing: 'border-box',
    marginBottom: 50,
  },
  line:{
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  }


})