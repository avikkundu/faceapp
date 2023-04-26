/* globals faceapi */
import 'https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js';


import { TextField,Button } from "@mui/material";
import './App.css';
import React, { useState } from 'react';


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
  const [phone,setPhone]=useState();
  const [mood,setMood]=useState("");
  const [emotion,setEmotion]=useState("");

  const  onChangePicture = e => {
    if (e.target.files[0]) {
      console.log("picture: ", e.target.files);
      setPicture(e.target.files[0]);
      uploadImage(e);
  
    }
    
  };
async function uploadImage(e) {
  const imgFile = e.target.files[0]
  const img = await faceapi.bufferToImage(imgFile)
  const detections = await faceapi.detectSingleFace(img).withFaceExpressions();
  const expressions = detections.expressions;
  const maxValue = Math.max(...Object.values(expressions));
  const emotion = Object.keys(expressions).filter(
          item => expressions[item] === maxValue
        );
  console.log(emotion);
  setEmotion(emotion);
}
  return (
    <div className="App">
    <h1 style={{color:'white'}}>Face App</h1>
    <TextField
                value={name}
                label="Enter your name"
                variant="filled" 
                onChange={(e) => {
                    setName(e.target.value);
                }}
                sx={{position:'absolute',top:'220px',left:'100px'}}
            />
            <TextField
                value={phone}
                label="Enter your phone number"
                variant="filled" 
                onChange={(e) => {
                    setPhone(e.target.value);
                }}
                sx={{position:'absolute',top:'220px',left:'400px'}}
            />
          <input type="file" style={{position:'absolute',top:'300px',left:'100px'}} onChange={onChangePicture} />
          <Button variant="contained" color="success" sx={{position:'absolute',top:'350px',left:'250px'}} onClick={()=>{setMood(emotion)}}>Submit</Button>
          <h3 style={{position:'absolute',top:'400px',left:'100px',color:'white'}}>Mood:{mood}</h3>
    </div>
  );
}

export default App;
