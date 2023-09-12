
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react'
import { Button, View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { StatusBar } from 'expo-status-bar';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home() {
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [title, setTitle] = useState('');
    const [messege, setMessege] = useState("")
    const [editTitle, setEditTitle] = useState('')

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HighQuality
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
        setRecording(undefined);

        await recording.stopAndUnloadAsync();

        let updatedRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        updatedRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            title: title,
            file: recording.getURI()


        });

        await saveRecordings([...recordings, {
            sound: recording.getURI(),
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
            title: title,


        }]);
        setRecordings(updatedRecordings)



    }

    async function saveRecordings(recordings) {
        try {
            const saves = {}
            await AsyncStorage.setItem('record', JSON.stringify(recordings))
        } catch (error) {
            console.log(error)
        }
    }

    function getDurationFormatted(millis) {

        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60)
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}: ${secondsDisplay}`;
    }

    async function fetchRecordings() {

        try {
            const storedRecordings = await AsyncStorage.getItem('record')
            if (storedRecordings) {
                setRecordings(JSON.parse(storedRecordings))
            }

        } catch (error) {
            console.error('Error fetching recording:', error);
        }

    }


    async function updateRecording(index, newTitle) {


        const updatedRecordings = [...recordings];
        updatedRecordings[index].title = title;
        setRecordings(updatedRecordings);
        await saveRecordings(updatedRecordings);
        setTitle('');

        await saveRecordings(updateRecording)
    }

    function editRecording(index) {

        setEditTitle(index)
        setTitle(recordings[index].title)

    }

    async function removeRecording(index) {

        const updatedRecordings = recordings.filter((_, i) => i !== index)
        setRecordings(updatedRecordings)

        await saveRecordings(updatedRecordings)
    }



    function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
            return (
                <View key={index} style={styles.row}>

                    <Text style={styles.fill}>
                        {recordingLine.title} - {recordingLine.duration}
                    </Text>
                    <Button style={styles.button}
                        onPress={() => recordingLine.sound.replayAsync()}
                        title="Play">
                    </Button>
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

                            <Button style={styles.button} onPress={() => editRecording(index)} title="Edit"></Button>
                        </View>

                    )}
                    <Button style={styles.button} onPress={() => removeRecording(index)} title="Remove"></Button>
                </View>
            );
        });
    }

    useEffect(() => {
        fetchRecordings()
    }, [])
    useEffect(() => {
        console.log(title);
    }, [title])

    return (


        <View style={styles.container}>
            <Text>{messege}</Text>
            <TextInput
                onChangeText={text => setTitle(text)}
                placeholder='title'
                style={styles.inputText}
                value={title}>

            </TextInput>
            {/* <Pressable  
             onPress={recording ? stopRecording : startRecording}>
                
            
                <Text style={styles.button} >{recording ? 'Stop Recording' : 'Start recording'}</Text>
            </Pressable> */}
            <Button

                title={recording ? 'Stop Recording' : 'Start recording'}
                onPress={recording ? stopRecording : startRecording} />
            {getRecordingLines()}

            <StatusBar style="auto" />
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ff9999',
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
        fontSize:20,
        color:'#560319',
    },
    button: {

        backgroundColor: 'red',
        border: 'none',
        color: 'white',
        padding: 15,
        textAlign: 'center',
        textDecoration: 'none',
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
        backgroundColor: '#d9603b',
        color: 'white',
        padding: 14,
        margin: 8,
        border: 1,
        borderRadius: 4,
        boxSizing: 'border-box',
        marginBottom:50,
    },

});
