import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io.connect('https://arina.lol');

const Status = () => {

    const [desc, setDesc] = useState(["Connecting", " to ", "server"])

    useEffect(() => {
      socket.emit('sync_description')
    }, [socket])

    useEffect(() => {
      socket.on('set_desc', (data) => {
        var newscroll = data[0].text.split(",")
        setDesc(newscroll)
      })

      return () => socket.off('set_desc')
    }, [socket, desc, setDesc])
  
    useEffect(() => {
      socket.on('update_desc', (data) => {
        if (data.title === 0) {
          var newscroll = data.newtext.split(",")
          setDesc(newscroll)
        }
      })
      return () => socket.off('update_desc')
    }, [socket, desc, setDesc])

    return (
      <>
        <div className='scroller'>
          {desc.map((el, ind) => {
            const colors = ['red', 'yellow', 'lime', '#00ddff', '#bb00ff', 'red', 'orange', 'yellow', 'blue', 'lime']
            return (
              <p key={el} style={{textAlign: 'left', color: `${colors[ind]}`, textShadow: `none`}} className="scrolling-text">
                <i>{el}</i>
              </p>
            )
          })}
        </div>

      </>
    )
}

export default Status;