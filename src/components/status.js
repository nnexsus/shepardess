import { useEffect, useState } from "react"


const Status = ({ socket }) => {

    const [stat, setStat] = useState({
        "chaseday": false,
        "traveling": false,
        "forecasting": false,
        "chasing": false,
        "searchandrescue": false,
        "emergency": false,
        "ending": false
    })

    const [desc, setDesc] = useState({
      "threat": "none"
    })

    useEffect(() => {
        socket.on('set_stat', (data) => {
          setStat({
            "chaseday": data[0].status,
            "traveling": data[1].status,
            "forecasting": data[2].status,
            "chasing": data[3].status,
            "searchandrescue": data[4].status,
            "emergency": data[5].status,
            "ending": data[6].status
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
            "qrd": data[1].text,
            "full": data[2].text,
            "featured": data[3].text,
            "threat": data[4].text,
            "recentChange": 0
          })
        })
  
        return () => socket.off('set_desc')
    }, [socket, desc, setDesc])
  
    useEffect(() => {
      socket.on('update_desc', (data) => {
          const titles = ['scrolling', 'qrd', 'full', 'featured', 'threat']
          const newdata = {
            "scrolling": desc.scrolling,
            "qrd": desc.qrd,
            "full": desc.full,
            "featured": desc.featured,
            "threat": desc.threat,
            "recentChange": data.title,
            [titles[data.title]]: data.newtext
          }
          setDesc(newdata, setTimeout(() => {
            const newdata = {
              "scrolling": desc.scrolling,
              "qrd": desc.qrd,
              "full": desc.full,
              "featured": desc.featured,
              "threat": desc.threat,
              "recentChange": 10,
              [titles[data.title]]: data.newtext
            }
            setDesc(newdata)
          }, [2500]))
        })
        return () => socket.off('update_desc')
    }, [socket, desc, setDesc])

    return (
        <div className="status-indicators" style={{justifyContent: 'space-between'}}>
            <img className={`${stat?.chaseday ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${stat?.chaseday ? "/images/lights/derecho-notitle.gif" :  "/images/lights/chaseday-off.gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/chaseday" + (stat?.chaseday ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/chaseday" + (stat?.chaseday ? "" : "-off") + ".gif"}`} width="100%" alt="status light for it being a chase day" />

            <img className={`${desc?.recentChange === 4 ? "updated" :  ""}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/" + desc.threat + "-notitle.gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/" + desc.threat + ".gif"}`} 
            src={`${"/images/lights/" + desc.threat + ".gif"}`} width="100%" alt={`todays threat type: ${desc.threat} threat.`} />

            <img className={`${stat?.traveling ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/traveling" + (stat?.traveling ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/traveling" + (stat?.traveling ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/traveling" + (stat?.traveling ? "" : "-off") + ".gif"}`} width="100%" alt="status light for traveling" />

            <img className={`${stat?.forecasting ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/forecasting" + (stat?.forecasting ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/forecasting" + (stat?.forecasting ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/forecasting" + (stat?.forecasting ? "" : "-off") + ".gif"}`} width="100%" alt="status light for forecasting" />

            <img className={`${stat?.chasing ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/chasing" + (stat?.chasing ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/chasing" + (stat?.chasing ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/chasing" + (stat?.chasing ? "" : "-off") + ".gif"}`} width="100%" alt="status light for chasing" />

            <img className={`${stat?.searchandrescue ? "updated" :  "off"}`}
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/searchandrescue" + (stat?.searchandrescue ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/searchandrescue" + (stat?.searchandrescue ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/searchandrescue" + (stat?.searchandrescue ? "" : "-off") + ".gif"}`} width="100%" alt="status light for search & rescue" />

            <img className={`${stat?.onhold ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/onhold" + (stat?.onhold ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/onhold" + (stat?.onhold ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/onhold" + (stat?.onhold ? "" : "-off") + ".gif"}`} width="100%" alt="status light for being on hold" />

            <img className={`${stat?.ending ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/ending" + (stat?.ending ? "-notitle" : "-off") + ".gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/ending" + (stat?.ending ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/ending" + (stat?.ending ? "" : "-off") + ".gif"}`} width="100%" alt="status light for ending the chase" />

            <img className={`${stat?.emergency ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${stat?.emergency ? "/images/lights/emergency-notitle.gif" :  "/images/lights/emergency-off.gif"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/emergency" + (stat?.emergency ? "" : "-off") + ".gif"}`} 
            src={`${"/images/lights/emergency" + (stat?.emergency ? "" : "-off") + ".gif"}`} width="100%" alt="status light for emergency" />
        </div>
    )
}

export default Status;