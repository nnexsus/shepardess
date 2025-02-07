import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io.connect('https://arina.lol');

const Status = () => {

    const [desc, setDesc] = useState({
      "scrolling": ["Connecting", " to ", "server"],
      "threat": "none",
      "outlook": "marginal",
      "area": "midwest"
    })

    useEffect(() => {
      socket.emit('sync_description')
    }, [socket])

    useEffect(() => {
      socket.on('set_desc', (data) => {
        var newscroll = data[0].text.split(",")
        setDesc({
          "scrolling": newscroll,
          "threat": data[4].text,
          "outlook": data[6].text,
          "area": data[7].text,
          "recentChange": 0,
        })
      })

      return () => socket.off('set_desc')
    }, [socket, desc, setDesc])
  
    useEffect(() => {
      socket.on('update_desc', (data) => {
          const vals = ["scrolling", "qrd", "desc", "", "threat", "lastUpdate", "outlook", "area"]
          var newarr = {
              "scrolling": desc.scrolling,
              "qrd": desc.qrd,
              "desc": desc.desc,
              "threat": desc.threat,
              "recentChange": desc.lastUpdate,
              "outlook": desc.outlook,
              "area": desc.area,
              [`${vals[data.title]}`]: data.newtext
          }
          setDesc(newarr, setTimeout(() => {
            var newarr = {
              "scrolling": desc.scrolling,
              "qrd": desc.qrd,
              "desc": desc.desc,
              "threat": desc.threat,
              "outlook": desc.outlook,
              "area": desc.area,
              "recentChange": 10,
              [`${vals[data.title]}`]: data.newtext
            }
            setDesc(newarr)
          }, [2500]))
        })
        return () => socket.off('update_desc')
    }, [socket, desc, setDesc])

    return (
      <>
        <div className='scroller'>
          {desc?.scrolling?.map((el, ind) => {
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