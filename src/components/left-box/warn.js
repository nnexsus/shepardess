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
    const [warningStore, setWarningStore] = useState(null)
    
    const getWarnings = () => {
        axios.get("https://api.weather.gov/alerts/active?status=actual&message_type=alert&region_type=land&urgency=Immediate,Expected&severity=Extreme,Severe&certainty=Observed,Likely,Possible&limit=250").then((res) => {
            setWarning(res.data)
            setWarningStore(res.data)
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

    const WarnCategories = {
        "tornado": {
            "color": "pink",
            "img": "tornado-pattern.png"
        },
        "hail": {
            "color": "lime",
            "img": "hail-pattern.png"
        },
        "flood": {
            "color": "lime",
            "img": "rain-pattern.png"
        },
        "wind": {
            "color": "blue",
            "img": "wind-pattern.png"
        },
        "snow": {
            "color": "lightblue",
            "img": "snow-pattern.png"
        },
        "winter": {
            "color": "lightblue",
            "img": "snow-pattern.png"
        },
        "thunderstorm": {
            "color": "yellow",
            "img": "lightning-pattern.png"
        },
        "special": {
            "color": "purple",
            "img": "rain-pattern.png"
        },
        "loading": {
            "color": "purple",
            "img": "rain-pattern.png"
        }
    }

    const FilterCategories = {
        "severe": ["Tornado Warning",
            "Tornado Watch",
            "Severe Thunderstorm Warning",
            "Severe Thunderstorm Watch",
            "Severe Weather Statement",
            "Wind Advisory",
            "Storm Warning",
            "Storm Watch",
            "High Wind Warning",
            "High Wind Watch",
            "Special Weather Statement",
            "Extreme Wind Warning"],
        "flood": ["Coastal Flood Advisory",
            "Coastal Flood Statement",
            "Coastal Flood Warning",
            "Coastal Flood Watch",
            "High Surf Advisory",
            "High Surf Warning",
            "Lake Wind Advisory",
            "Lakeshore Flood Advisory",
            "Lakeshore Flood Statement",
            "Lakeshore Flood Warning",
            "Lakeshore Flood Watch",
            "Law Enforcement Warning",
            "Gale Warning",
            "Gale Watch",
            "Special Marine Warning",
            "Flash Flood Statement",
            "Flash Flood Warning",
            "Flash Flood Watch",
            "Flood Advisory",
            "Flood Statement",
            "Flood Warning",
            "Flood Watch",
            "Urban And Small Stream Flood Advisory",
            "Beach Hazards Statement",
            "Low Water Advisory",
            "Marine Weather Statement",
            "Hazardous Seas Warning",
            "Hazardous Seas Watch"],
        "winter": ["Wind Chill Advisory",
            "Wind Chill Warning",
            "Wind Chill Watch",
            "Winter Storm Warning",
            "Winter Storm Watch",
            "Winter Weather Advisory",
            "Snow Squall Warning",
            "Ice Storm Warning",
            "Lake Effect Snow Advisory",
            "Lake Effect Snow Warning",
            "Lake Effect Snow Watch",
            "Heavy Freezing Spray Warning",
            "Heavy Freezing Spray Watch",
            "Freeze Warning",
            "Freeze Watch",
            "Freezing Fog Advisory",
            "Freezing Rain Advisory",
            "Freezing Spray Advisory",
            "Frost Advisory",
            "Avalanche Advisory",
            "Avalanche Warning",
            "Avalanche Watch",
            "Blizzard Warning",
            "Blizzard Watch"],
        "fire": ["Red Flag Warning",
            "Fire Warning",
            "Fire Weather Watch",
            "Extreme Fire Danger"],
        "tropical": ["Tropical Depression Local Statement",
            "Tropical Storm Local Statement",
            "Tropical Storm Warning",
            "Tropical Storm Watch",
            "Tsunami Advisory",
            "Tsunami Warning",
            "Tsunami Watch",
            "Typhoon Local Statement",
            "Typhoon Warning",
            "Typhoon Watch",
            "Typhoon Local Statement",
            "Typhoon Warning",
            "Typhoon Watch",
            "Hurricane Force Wind Warning",
            "Hurricane Force Wind Watch",
            "Hurricane Local Statement",
            "Hurricane Warning",
            "Hurricane Watch",
            "Storm Surge Warning",
            "Storm Surge Watch"],
        "temperature": ["Wind Chill Advisory",
            "Wind Chill Warning",
            "Wind Chill Watch",
            "Heavy Freezing Spray Warning",
            "Heavy Freezing Spray Watch",
            "Freeze Warning",
            "Freeze Watch",
            "Freezing Fog Advisory",
            "Freezing Rain Advisory",
            "Freezing Spray Advisory",
            "Frost Advisory",
            "Heat Advisory",
            "Excessive Heat Warning",
            "Excessive Heat Watch",
            "Extreme Cold Warning",
            "Extreme Cold Watch",
            "Hard Freeze Warning",
            "Hard Freeze Watch",
            "Brisk Wind Advisory"],
        "smoke": ["Air Quality Alert",
            "Ashfall Advisory",
            "Ashfall Warning",
            "Dense Fog Advisory",
            "Dense Smoke Advisory",
            "Dust Advisory",
            "Dust Storm Warning",
            "Blowing Dust Advisory",
            "Blowing Dust Warning"],
        "other": ["Tsunami Advisory",
            "Tsunami Warning",
            "Tsunami Watch",
            "Rip Current Statement"]
    }

    const expand = (ind) => {
        document.getElementById(`expandwarn-p-${ind}`).style.webkitLineClamp = 100;
        document.getElementById(`expandwarn-${ind}`).remove()
    }
    
    useEffect(() => {
        getWarnings()
    }, [])

    const setFilter = (val) => {
        var sorted = []
        const sorting = (el) => {
            FilterCategories[`${val}`].forEach((li) => {
                if (el.properties.headline.includes(li)) return sorted.push(el)
            })
        }
        warningStore.features.forEach((el) => {
            sorting(el)
        })
        setWarning({features: sorted})
    }
    
    return (
        <div className="warn-container" style={{backgroundImage: 'url(/images/bgs/pipes.png)', backgroundSize: '128px'}}>
            {warning !== null ?
                <>
                    <div className="thick-scroller" style={{display: 'flex', overflowX: 'scroll', marginTop: '8px'}}>
                        <button className="filter-button" onClick={() => setFilter("severe")}><img src="/images/warns/lightning.png" alt="decor" width={'32px'} height={'32px'} />Severe</button>
                        <button className="filter-button" onClick={() => setFilter("winter")}><img src="/images/warns/snow.png" alt="decor" width={'32px'} height={'32px'} />Winter</button>
                        <button className="filter-button" onClick={() => setFilter("flood")}><img src="/images/warns/rain.png" alt="decor" width={'32px'} height={'32px'} />Waters</button>
                        <button className="filter-button" onClick={() => setFilter("fire")}><img src="/images/warns/fire.png" alt="decor" width={'32px'} height={'32px'} />Fire</button>
                        <button className="filter-button" onClick={() => setFilter("tropical")}><img src="/images/warns/hurricane.png" alt="decor" width={'32px'} height={'32px'} />Tropical</button>
                        <button className="filter-button" onClick={() => setFilter("temperature")}><img src="/images/warns/heat.png" alt="decor" width={'32px'} height={'32px'} />Temps</button>
                        <button className="filter-button" onClick={() => setFilter("smoke")}><img src="/images/warns/.png" alt="decor" width={'32px'} height={'32px'} />Smoke/Dust/Fog</button>
                        <button className="filter-button" onClick={() => setFilter("other")}><img src="/images/warns/.png" alt="decor" width={'32px'} height={'32px'} />Other</button>
                    </div>
                    <div className="warncontainer">
                        {warning.features.map((warn, ind) => {
                            var warnex = (warn.properties.headline?.match(/\b(tornado|thunderstorm|flood|blizzard|snow|winter|wind|hail|dust|smoke|special)\b/i))
                            var warntype = ""
                            if (warnex !== null) {
                                warntype = warnex[0].toLowerCase()
                            }
                            var pos = [8, 0, 0]
                            var lat = warn.geometry?.coordinates[0][0][1]
                            var lon = warn.geometry?.coordinates[0][0][0]
                            pos[1] = (Math.floor((lon + 180) / 360 * Math.pow(2, pos[0])))
                            pos[2] = (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, pos[0])))
                            var path = "M"
                            warn.geometry?.coordinates[0].forEach((el) => {
                            path = path + `${el[0]} ${el[1]}L`
                            })
                            path = path + "z"
                            var svg = path.length > 5
                            const bgcol = `${warn.properties.severity === "Moderate" ? '#F4D8CD' :  /*possible*/ warn.properties.severity === "Severe" ? '#EDB183' : /*likely*/ warn.properties.severity === "Extreme" ? '#F15152' : /*observed*/ '#79C7C5'}`
                            return (
                                <div style={{backgroundColor: `${bgcol}`, border: 'inset 3px', margin: '10px'}} key={warn.id}>
                                    <h2 style={{display: 'flex', alignItems: 'center'}}><img loading='lazy' alt="decor" height={'32px'} width={'32px'} src={`/images/warns/${warn.properties.event.replace(" ", "-")}.png`} />{warn.properties.event}</h2>
                                    <p>{warn.properties.headline}</p>
                                    <p id={`expandwarn-p-${ind}`} className="past-desc" style={{WebkitLineClamp: 2}}>{warn.properties.instruction}</p>
                                    <button id={`expandwarn-${ind}`} className='past-expand' onClick={() => expand(ind)}>Expand <img loading='lazy' style={{marginLeft: '3px'}} width={'24px'} height={'24px'} alt='decor' src='/images/bgs/Book.ico' /></button>
                                    <div>
                                        {svg ?
                                            <svg viewBox={`${lon - 0.703125} ${lat - 0.703125} 1.40625 1.40625`} width="100%" height="100%">
                                                <defs>
                                                    <pattern id="img1" patternUnits="userSpaceOnUse" width={`${(1.40625 / 8)}`} height={`${(1.40625 / 8)}`}>
                                                        <image href={`/images/16icons/${WarnCategories[`${warntype}`]?.img}`} x="0" y="0" width={`${(1.40625 / 8)}`} height={`${(1.40625 / 8)}`}/>
                                                    </pattern>
                                                </defs>
                                                <image style={{filter: 'invert(1) hue-rotate(180deg) contrast(1.1)'}} width={1.40625} height={1.40625} x={lon - 0.703125} y={lat - 0.703125} href={`https://tile.openstreetmap.org/${pos[0]}/${pos[1]}/${pos[2]}.png`} />
                                                <path style={{transform: `translate(${((lon - 0.703125) + (lon + 1.40625))}px, 0px) scale(-1, 1)`}} fillRule="evenodd" fill={`url(#img1)`} strokeLinecap="round" strokeLinejoin="round" stroke={`${WarnCategories[`${warntype}`]?.color}`} strokeWidth="0.0075" 
                                                d={`${path}`}>
                                                </path>
                                            </svg>
                                        : null}
                                    </div>
                                    <p>View more here: <a href="https://www.weather.gov" target="_blank" rel="noreferrer">https://www.weather.gov</a></p>
                                </div>
                            )
                        })}
                    </div>
                </>
            : null}
        </div>
    )
}

export default Warn;