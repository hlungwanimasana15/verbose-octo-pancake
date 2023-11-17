import React,{ useState } from 'react'
import Paper from '@mui/material/Paper';
import { Box, Link } from '@mui/material';
import TextFields from '../Components/TextFields'
import Button from '../Components/Buttons'
import { TextFieldPassword } from '../Components/TextFields';
import SectionHeading from '../Components/SectionHeading';
import SectionSubHeading from '../Components/SectionSubHeading';
import { theme } from '../Theme/theme';


function Profile() {

  const [email, setEmail]= useState("");
  const [fname, setFname]= useState("");
  const [lname, setLname]= useState("");
  const [Pnumber, setPnumber]= useState("");

  const [emailErr, setEmailErr]= useState(false);
  const [passwordErr, setPasswordErr]= useState(false);
  
  function testingFunc() {
      if (!email ) {
          setEmailErr(true)
      }else{
          setEmailErr(false)
      }
  
      if (!fname ) {
          setPasswordErr(true)
      }else{
          setPasswordErr(false)
      }
    }


  return (
    <div style={{ backgroundColor: '#B3B3B3', height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }} >
            <div style={{maxWidth:'1440px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <Paper elevation={3} style={{ padding: '50px', width: '35%', height: 'auto', borderRadius: '10px' }}>
                <div  style={{height: 'fit-content',   paddingBottom: theme.spacing(4) 
                }}>
                 <SectionSubHeading children={"Profile"}/> <Box >
                </Box>
                <SectionSubHeading children={"Lets setup your profile"}   />
                </div>
                <Box style={{  padding: theme.spacing(3),paddingTop:theme.spacing(3)}}>
                <TextFields label={"First Name:"} errorStatus={emailErr} errorMessage={"Field Required!"} setState={setEmail} />
                </Box>
                <Box style={{  padding: theme.spacing(3),paddingTop:theme.spacing(3)}}>
                <TextFields label={"Last Name:"} errorStatus={emailErr} errorMessage={"Field Required!"} setState={setEmail} />
                </Box>
                <Box style={{  padding: theme.spacing(3),paddingTop:theme.spacing(3)}}>
                <TextFields label={"Phone Number:"} errorStatus={emailErr} errorMessage={"Field Required!"} setState={setEmail} />
                </Box>
                <Box style={{  padding: theme.spacing(3),paddingTop:theme.spacing(3)}}>
                <TextFields label={"Email Address:"} errorStatus={emailErr} errorMessage={"Field Required!"} setState={setEmail} />
                </Box>
                <Box style={{textAlign: 'end', marginTop:'10px'}}><Link href="#">Reset password?</Link></Box>
                
                <Box style={{ paddingTop: theme.spacing(4), display:'flex',flexDirection:'column',alignItems:'center',gap:15}}>
                <Button text={"Submit"} buttonFunction={testingFunc} /></Box>
               
            </Paper>
            </div>
        </div>
  )
}

export default Profile
