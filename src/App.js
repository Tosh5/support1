import * as React from 'react';
import './App.css';
import Gauge from './Gauge';
import MiniGauge from './MiniGauge';
import { useState, useEffect, useContext, useRef} from 'react';
import Monitor from './Monitor';
import StartSupport from './StartSupport';
import SendMyIndex from './SendMyIndex';
// import {useGanbareCount} from './VoiceContext'
import { GanbareCount } from './VoiceContext';

import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_SOCKET_URL)

let prev_ganbare = 0;

function App() {

  const { ganbareCount, setGanbareCount } = useContext(GanbareCount)

  const [index, useIndex] = useState(0)
  const [info, setInfo] = useState('応援してください')
  const [num_participants, setNumParticipants] = useState()
  const [aveIndex, setAveIndex] = useState()
  const indexRef = useRef(0)

  // const ganbareChecker = () => {
  //   if (ganbareCount > prev_ganbare){
  //     ganbare - 
  //   }
  // }

  // indexをサーバに送りつける関数
  const sendmyindex = async (index) =>{
    // console.log("サーバにindexを送信する!")
    await socket.emit("send_myindex" , index)
    // console.log('サーバにindexを送信したぜ!')
  }

  // 以下の10行くらいは、socket.ioの公式ドキュメントからのコピペ
  useEffect(() => {
    socket.on('receive_message2', function(aveIndex) {
      setAveIndex(aveIndex)
      // console.log('来たぜよ！！！！！')
    });
    return () => {
      socket.off('receive_message2');
    };
  }, []);
  
  useEffect(() => {
    indexRef.current = index
  },[index])

  useEffect(() => {
    const interval = setInterval(() => {
      sendmyindex(indexRef.current)
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="team-index">
        <h1 className='title'>チーム全体の応援</h1>
        <h3>チーム全体の応援熱量: {aveIndex}</h3>
        <h3>ガンバレカウンター{ganbareCount}</h3>
        {/* <SendMyIndex myindex={index}/> */}

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
