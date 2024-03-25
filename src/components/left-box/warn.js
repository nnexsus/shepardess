import { useEffect, useState } from "react"
import axios from "axios"


const Warn = () => {
    const [warning, setWarning] = useState({
        "features": [
            {"id": 0,
            "properties": {
                "event": "Loading",
                "headline": "Loading",
                "areaDesc": "Loading",
                "instruction": "Loading",
                "severity": "Loading"
            }}
        ]
    })
    
    const getWarnings = () => {
        axios.get("https://api.weather.gov/alerts/active?status=actual&message_type=alert&region_type=land&urgency=Immediate,Expected&severity=Extreme,Severe&certainty=Observed,Likely,Possible&limit=25").then((res) => {
            setWarning(res.data)
        }).catch((e) => {
            setWarning({
                "features": [
                    {"id": 0,
                    "properties": {
                        "event": "Error",
                        "headline": "Error",
                        "areaDesc": "Error",
                        "instruction": "Error",
                        "severity": "Extreme"
                    }}
                ]
            })
        })
    }

    const expand = (ind) => {
        document.getElementById(`expandwarn-p-${ind}`).style.webkitLineClamp = 100;
        document.getElementById(`expandwarn-${ind}`).remove()
    }
    
    useEffect(() => {
        getWarnings()
    }, [])
    
    return (
        <div className="warn-container" style={{backgroundImage: 'url(/images/bgs/pipes.png)', backgroundSize: '128px'}}>
            {warning !== null ?
                <div className="warncontainer">
                    {warning.features.map((warn, ind) => {
                        var pos = [8, 0, 0]
                        var lat = warn.geometry?.coordinates[0][0][1]
                        var lon = warn.geometry?.coordinates[0][0][0]
                        pos[1] = (Math.floor((lon + 180) / 360 * Math.pow(2, pos[0])))
                        pos[2] = (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, pos[0])))
                        //pos[1] = ((Math.pow(2, pos[0])) * ((warn.geometry?.coordinates[0][0][0] + 180) / 360)).toFixed(0)
                        //pos[2] = ((Math.pow(2, pos[0])) * (1 - (Math.log(Math.tan(warn.geometry?.coordinates[0][0][1]) + (1 / Math.cos(warn.geometry?.coordinates[0][0][1]))) / Math.PI)) / 2).toFixed(0)
                        var path = "M"
                        warn.geometry?.coordinates[0].forEach((el) => {
                          path = path + `${el[0]} ${el[1]}L`
                        })
                        path = path + "z"
                        console.log(path)
                        const bgcol = `${warn.properties.severity === "Moderate" ? '#F4D8CD' :  /*possible*/ warn.properties.severity === "Severe" ? '#EDB183' : /*likely*/ warn.properties.severity === "Extreme" ? '#F15152' : /*observed*/ '#79C7C5'}`
                        return (
                            <div style={{backgroundColor: `${bgcol}`, border: 'inset 3px', margin: '10px'}} key={warn.id}>
                                <h2 style={{display: 'flex', alignItems: 'center'}}><img loading='lazy' alt="decor" height={'32px'} width={'32px'} src={`/images/warns/${warn.properties.event.replace(" ", "-")}.png`} />{warn.properties.event}</h2>
                                <p>{warn.properties.headline}</p>
                                <p id={`expandwarn-p-${ind}`} className="past-desc" style={{WebkitLineClamp: 2}}>{warn.properties.instruction}</p>
                                <button id={`expandwarn-${ind}`} className='past-expand' onClick={() => expand(ind)}>Expand <img loading='lazy' style={{marginLeft: '3px'}} width={'24px'} height={'24px'} alt='decor' src='/images/bgs/Book.ico' /></button>
                                <div>
                                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                                        <path fillRule="evenodd" fill="transparent" strokeLinejoin="round" stroke="green" strokeWidth="1.5" 
                                        d={`${path}`}>
                                        </path>
                                    </svg>
                                    <img src={`https://tile.openstreetmap.org/${pos[0]}/${pos[1]}/${pos[2]}.png`} />
                                </div>
                            </div>
                        )
                    })}
                </div> 
            : null}
        </div>
    )
}

export default Warn;