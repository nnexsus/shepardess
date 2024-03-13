import { useEffect, useState } from "react"
import { io } from "socket.io-client"

import Chat from "../chat"

const socket = io.connect("https://arina.lol")

const ChatPanel = () => {

    const [active, setActive] = useState("join")
    const [streams, setStreams] = useState([])

    const Join = () => {
        const [username, setUsername] = useState(sessionStorage?.getItem('username'))

        return (
            <div id="chat-panelh" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <input id="chat-username" style={{border: 'inset 3px', backgroundImage: 'url(/images/bgs/BlackThatch.png)', fontFamily: 'ms ui gothic', color: 'lime', width: 'calc(100% - 12px)', height: '40px'}} type="text" defaultValue={username} onChange={(e) => sessionStorage.setItem('username', e.currentTarget.value)} placeholder="Username" />
                <button style={{border: 'outset 3px', margin: '3px', cursor: 'pointer', background: 'black', fontFamily: 'ms ui gothic', color: 'lime'}} onClick={() => JoinRoom()}>JOIN LIVE CHAT</button>
            </div>
        )
    }

    const panels = {
        "join": Join,
        "chat": Chat
    }
    
    var Panel = panels[active];

    const JoinRoom = () => {
        const username = sessionStorage.getItem('username')
        if (username !== "" && username !== null && !username?.includes("shepardess")) {
            socket.emit('join_room', { 'username': `${username}` })
            socket.emit('sync_stream')
            setActive("chat")
        } else {
            socket.emit('join_room', { 'username': `anon-${Date.now()}` })
            socket.emit('sync_stream')
            setActive("chat")
        }
    }

    useEffect(() => {
        socket.on('set_stream', (data) => {
          setStreams(data)
        })
  
        return () => socket.off('set_stream')
    }, [socket, streams, setStreams])

    return (
        <Panel socket={socket} username={sessionStorage.getItem('username')} streams={streams}/>
        )
}

export default ChatPanel;