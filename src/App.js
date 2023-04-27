/* globals faceapi */
import 'https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js';


import { TextField,Button } from "@mui/material";
import './App.css';
import React, { useState } from 'react';
import faceDetection from "./images/FaceDetection.gif";
import spinner from "./images/loader.gif";

async function face(){

  await faceapi.loadSsdMobilenetv1Model('models')
  await faceapi.nets.tinyFaceDetector.loadFromUri('models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('models');
  await faceapi.nets.faceExpressionNet.loadFromUri('models');
  await faceapi.nets.ageGenderNet.loadFromUri('models');
  console.log("loaded");

};
face();





function App() {
  const [picture, setPicture] = useState(null);
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  
  const [emotion,setEmotion]=useState("");
  const [load,isLoadding]=useState(false);
  const [spin,setSpin]=useState(false);

  const handleClick = ()=>{

    
    uploadImage(picture);
    setName(document.getElementById("name").value);
    setPhone(document.getElementById("phone").value);
    document.getElementById("file").value="";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    setPicture(null);
    
  }
  const  onChangePicture = e => {
    if (e.target.files[0]) {
      setPicture(e.target.files[0]);
      
    }
    
  };
async function uploadImage(e) {
  setSpin(true);
  const imgFile = e
  if(imgFile==null)
  { setSpin(false);
    return;
  }
  const img = await faceapi.bufferToImage(imgFile)
  const detections = await faceapi.detectSingleFace(img).withFaceExpressions();
  const expressions = detections.expressions;
  const maxValue = Math.max(...Object.values(expressions));
  const emotion = Object.keys(expressions).filter(
          item => expressions[item] === maxValue
        );
  console.log(emotion);
  setEmotion(emotion);
  setSpin(false);
  isLoadding(true);
}
  return (
    <div className="App">
    <h1 style={{color:'white'}}>🅵🅰🅲🅴 🅰🅿🅿</h1>
    <h2 style={{
                 position:'absolute',
                 top:'100px',
                 left:'100px',
                 color:'white'}}
    >Enter Details::</h2>
    <TextField
                id="name"
                label="Enter your name"
                variant="filled" 
                sx={{position:'absolute',top:'180px',left:'100px'}}
            />
            <TextField
                id="phone"
                label="Enter your phone number"
                variant="filled" 
                sx={{position:'absolute',top:'180px',left:'400px'}}
            />
           <img id="logo" src={faceDetection} /> 
          <input 
                  id="file" 
                  type="file"
                  style= {{
                            position:'absolute',
                            top:'280px',
                            left:'100px',
                            color:'white'
                          }}
                   onChange={onChangePicture} />

          <Button 
                  variant="contained"
                  color="success"
                  sx= {{
                          position:'absolute',
                          top:'330px',
                          left:'290px'
                      }}
                   onClick={handleClick} >Submit</Button>
          {spin?
                <div>
                       <img src={spinner}/>
                </div>
                 :''

          }
          {load?
            <div>
                 <h2 style={{position:'absolute',top:'400px',left:'100px',color:'white'}}>Result  ::</h2>
                 <h3 style={{position:'absolute',top:'440px',left:'100px',color:'white'}}>Name: {name}  </h3>
                 <h3 style={{position:'absolute',top:'480px',left:'100px',color:'white'}}>Phone Number: {phone}</h3>
                 <h3 style={{position:'absolute',top:'520px',left:'100px',color:'white'}}>Mood: {emotion}</h3>
            </div>
          :''} 
    </div>
  );
}

export default App;
