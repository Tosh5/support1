import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { add } from './App.js'
import hoge from './App.js'

const async = require("async");
const socket = io.connect(process.env.REACT_APP_SOCKET_URL)
// const socket = io.connect("http://localhost:8000")
// const socket = io.connect("https://cheer-app-server1.onrender.com")
// const index = io.connect("https://cheer-app-server1.onrender.com/index")

let myindex3 = 24

const sendmyindex = async (props) =>{
  console.log(`current myindex is...... ${props}`)
  await socket.emit("send_myindex" , props)
  console.log('ran sendTest')
}


function SendMyIndex2(props) {
  console.log(add(3,5));

  console.log(props.myindex)

  useEffect(() => {
    myindex3 = props.myindex
  },[props.myindex])

  useEffect(() => {
    const interval = setInterval(() => {
      sendmyindex(myindex3)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>MyIndex is : {myindex3}</div>
  )
}

export default SendMyIndex2