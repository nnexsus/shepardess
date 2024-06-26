import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io.connect('https://arina.lol');

const Status = () => {

    const [stat, setStat] = useState({
        "chaseday": false,
        "traveling": false,
        "forecasting": false,
        "chasing": false,
        "searchandrescue": false,
        "emergency": false,
        "ending": false,
        "onhold": false
    })

    const [desc, setDesc] = useState({
      "scrolling": ["Connecting", " to ", "server"],
      "threat": "none",
      "outlook": "marginal",
      "area": "midwest"
    })

    useEffect(() => {
      socket.emit('sync_status')
      socket.emit('sync_description')
    }, [socket])

    useEffect(() => {
        socket.on('set_stat', (data) => {
          setStat({
            "chaseday": data[0].status,
            "traveling": data[1].status,
            "forecasting": data[2].status,
            "chasing": data[3].status,
            "searchandrescue": data[4].status,
            "emergency": data[5].status,
            "ending": data[6].status,
            "onhold": data[7].status
          })
        })
    
        return () => socket.off('set_stat')
      }, [socket, stat, setStat])
    
      useEffect(() => {
        socket.on('update_stat', (data) => {
          const newdata = {
            "chaseday": stat.chaseday,
            "traveling": stat.traveling,
            "forecasting": stat.forecasting,
            "chasing": stat.chasing,
            "searchandrescue": stat.searchandrescue,
            "emergency": stat.emergency,
            "ending": stat.ending,
            "onhold": stat.onhold,
            [data.title]: data.newstatus
          }
          setStat(newdata)
        })
    
        return () => socket.off('update_stat')
      }, [socket, stat, setStat])

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
        <div className="status-indicators" style={{justifyContent: 'space-between'}}>
            <img loading='lazy' className={`${desc?.recentChange === 6 ? "updated" :  ""}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/" + desc.outlook + "-notitle.gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/" + desc.outlook + ".gif"}`} 
            src={`${"/images/lights/" + desc.outlook + ".gif"}`} width="100%" alt={`SPC has issued a ${desc.outlook} risk today.`} />

            <img loading='lazy' className={`${desc?.recentChange === 7 ? "updated" :  ""}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/" + desc.area + "-notitle.gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/" + desc.area + ".gif"}`} 
            src={`${"/images/lights/" + desc.area + ".gif"}`} width="100%" alt={`Todays risk is primarily in the ${desc.area} reigon(s).`} />

            <img loading='lazy' className={`${desc?.recentChange === 4 ? "updated" :  ""}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/" + desc.threat + "-notitle.gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/" + desc.threat + ".gif"}`} 
            src={`${"/images/lights/" + desc.threat + ".gif"}`} width="100%" alt={`todays threat type: ${desc.threat} threat.`} />

            <img loading='lazy' className={`${stat?.chaseday ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${stat?.chaseday ? "/images/lights/derecho-notitle.gif" :  "/images/lights/chaseday-off.gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/chaseday" + (stat?.chaseday ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/chaseday" + (stat?.chaseday ? "" : "-off") + ".gif"}`} width="100%" alt="status light for it being a chase day" />

            <img loading='lazy' className={`${stat?.traveling ? "updated" :  "off"} hidden-indicators`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/traveling" + (stat?.traveling ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/traveling" + (stat?.traveling ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/traveling" + (stat?.traveling ? "" : "-off") + ".gif"}`} width="100%" alt="status light for traveling" />

            <img loading='lazy' className={`${stat?.chasing ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/chasing" + (stat?.chasing ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/chasing" + (stat?.chasing ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/chasing" + (stat?.chasing ? "" : "-off") + ".gif"}`} width="100%" alt="status light for chasing" />

            <img loading='lazy' className={`${stat?.onhold ? "updated" :  "off"} hidden-indicators`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/onhold" + (stat?.onhold ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/onhold" + (stat?.onhold ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/onhold" + (stat?.onhold ? "" : "-off") + ".gif"}`} width="100%" alt="status light for being on hold" />

            <img loading='lazy' className={`${stat?.ending ? "updated" :  "off"} hidden-indicators`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/ending" + (stat?.ending ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/ending" + (stat?.ending ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/ending" + (stat?.ending ? "" : "-off") + ".gif"}`} width="100%" alt="status light for ending the chase" />

            <img loading='lazy' className={`${stat?.emergency ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${stat?.emergency ? "/images/lights/emergency-notitle.gif" :  "/images/lights/emergency-off.gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/emergency" + (stat?.emergency ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/emergency" + (stat?.emergency ? "" : "-off") + ".gif"}`} width="100%" alt="status light for emergency" />
        </div>
      </>
    )
}

export default Status;