import { useEffect, useState } from "react"
import { io } from "socket.io-client"

import Chat from "../chat"

const socket = io.connect("https://arina.lol")

const ChatPanel = () => {

    const JoinRoom = () => {
        socket.emit('sync_stream')
        socket.emit('join_room', { 'username': `Guest` })
    }

    useEffect(() => {
        JoinRoom()
    }, [])

    return (
        <Chat socket={socket} />
    )
}

export default ChatPanel;