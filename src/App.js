import * as React from 'react';
import './App.css';
import Gauge from './Gauge';
import MiniGauge from './MiniGauge';
import { useState, useEffect } from 'react';
import Monitor from './Monitor';
import StartSupport from './StartSupport';
import SendMyIndex from './SendMyIndex';

import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_SOCKET_URL)

// testmsgを送信するボタンのonClick関数
const sendTest = async () =>{
  console.log('running sendTest')
  await socket.emit("send_message" , "testmsg")
  console.log('ran sendTest')
}

function App() {
  console.log('function App()が呼ばれたよ')

  const [index, useIndex] = useState(0)
  const [info, setInfo] = useState('応援してください')
  const [num_participants, setNumParticipants] = useState()
  const [aveIndex, setAveIndex] = useState()
  const [msg, setMsg] = useState('original msg')

  // indexをサーバに送りつける関数
  const sendmyindex = async () =>{
    console.log("サーバにindexを送信する!")
    await socket.emit("send_myindex" , index)
    console.log('サーバにindexを送信したぜ!')
  }

  // 以下の15行くらいは、socket.ioの公式ドキュメントからのコピペ
  useEffect(() => {
    socket.on('receive_message', function(aveIndex) {
      setMsg(aveIndex)
      console.log('setMsg done')
    })

    socket.on('receive_message2', function(aveIndex) {
      setAveIndex(aveIndex)
      console.log('来たぜよ！！！！！')
    });

    return () => {
      socket.off('receive_message');
      socket.off('receive_message2');
    };
  }, []);
  
  

  useEffect(() => {
    const interval = setInterval(() => {
      sendmyindex(index)
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="team-index">
        {/* <SocketTest /> */}
        <h1 className='title'>チーム全体の応援</h1>
        <h3>{aveIndex}</h3>

        <button 
          className='button' 
          onClick={sendTest}
        >サーバに送信</button>
        <h3>下のメッセージがoriginalmsgからtestmsgに書き変わる</h3>
        <h2>{msg}</h2>

        <SendMyIndex myindex={index}/> 

        <Gauge score={index} />
        <StartSupport 
          num_participants={num_participants}
          index={index}
          />
      </div>

      <div className='bottom'>
        <h1 className='title'>あなたの応援</h1>
        <div className='monitor'>
            <Monitor useIndex={useIndex} /> 
        </div>  

        <div className='info'>
            <h3>メッセージ：</h3>
            <h1>{info}</h1>
            <div className="minigauge">
              <h1>あなたの応援熱量</h1>
              <br />
              <MiniGauge score={index} />
            </div>
        </div>
      </div>


    </div>
  );
}

export default App;
