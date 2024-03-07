import { useState } from "react"
import Chat from "../chat"

const ChatPanel = ({ socket, streams }) => {

    const [active, setActive] = useState("join")

    const Join = () => {
        const [username, setUsername] = useState(sessionStorage?.getItem('username'))

        return (
            <div id="chat-panelh" style={{gridColumn: 3, gridRowStart: 2, gridRowEnd: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
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
            setActive("chat")
        } else {
            socket.emit('join_room', { 'username': `anon-${Date.now()}` })
            setActive("chat")
        }
    }

    return (
        <Panel socket={socket} username={sessionStorage.getItem('username')} streams={streams}/>
        )
}

export default ChatPanel;