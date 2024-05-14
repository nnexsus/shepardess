import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import L from 'leaflet';

const socket = io.connect('https://arina.lol');

const polycolors = {
    "Special Weather Statement": "purple",
    "Winter Storm Warning": "white",
    "Winter Weather Advisory": "aliceblue",
    "Flood Warning": "lime",
    "Flash Flood Warning": "lime",
    "Rip Current Statement": "navy",
    "Lake Wind Advisory": "blue"
}

const Map = () => {

    const [polystate, setPolystate] = useState([])
    const [warns, setWarns] = useState([])
    const [markerstate, setMarkerstate] = useState([])
    const [outlooks, setOutlooks] = useState([])

    const [locdata, setLocdata] = useState({
        "accuracy": 100,
        "accuracyRounded": 100,
        "altitude": 100,
        "altitudeRounded": 200,
        "battery": 100,
        "batteryRounded": 90,
        "lat": 41,
        "lon": -88,
        "time": 1704814987,
        "velocity": 0,
        "miles": 0
    })

    const riskTypeColors = {
        "TORNADO": {
            "02": '#05b334',
            "05": '#7d3514',
            '10': '#e6c717',
            '15': '#d18904',
            '30': '#c7083b',
            '45': '#ff03cd',
            '60': '#ff99fc'
        },
        "HAIL": {
            "05": '#4ecf59',
            '15': '#ede137',
            '30': '#edad37',
            '45': '#d65036',
            '60': '#db4899'
        },
        "WIND": {
            '05': '#69a0b5',
            '15': '#6191b8',
            '30': '#508dbf',
            '45': '#3f8fd1',
            '60': '#0c8bf2'
        }
    }

    const dayDesc = ["", "today", "tomorrow"]
    
    const updateWarnings = () => {
        var updateWarn = [] 
        axios.get('https://api.weather.gov/alerts/active?status=actual&message_type=alert&region_type=land&urgency=Immediate,Expected&severity=Extreme,Severe,Moderate&certainty=Observed,Likely&limit=50').then((res) => {
            res?.data?.features?.forEach((el) => {
                var correctedBox = []
                el?.geometry?.coordinates[0].forEach(li => {
                    correctedBox.push(li.reverse())
                });
                updateWarn.push({"coordinates": correctedBox, "color": `${polycolors[`${el?.properties?.event}`]}`, "event": el?.properties?.even, "areaDesc": el?.properties?.areaDesc, "headline": el?.properties?.headline})
            })
        })
        setWarns(updateWarn)

        setTimeout(() => {
            updateWarnings()
        }, [600000])
    }

    const addRisk = (type, day) => {
        const fixOutlooks = (ol, type, day) => {
            var outs = []
            ol.forEach((li) => {
                var riskcol = li.substring(0, 2)
                var final = []
                var olarr = li.split(" ")
                olarr.forEach((el) => {
                    if(el.length === 8 && el !== '99999999') {
                        final.push([parseFloat(`${el.substring(0, 2)}.${el.substring(2, 4)}`), parseFloat(`-${(parseFloat(el.substring(4, 6)) <= 40 ? '1' + el.substring(4, 6) : el.substring(4, 6))}.${el.substring(6, 8)}`)])
                        console.log([parseFloat(`${el.substring(0, 2)}.${el.substring(2, 4)}`), parseFloat(`-${(parseFloat(el.substring(4, 6)) <= 40 ? '1' + el.substring(4, 6) : el.substring(4, 6))}.${el.substring(6, 8)}`)])
                    }
                })
                outs.push({"coordinates": final, "color": riskTypeColors[`${type}`][`${riskcol}`], "desc": `${riskcol}% chance for ${type} given by the SPC for ${dayDesc[day]}`})
            })
            setOutlooks(outs)
        }

        axios.get(`https://api.weather.gov/products?wmoid=WUUS0${day}&type=PTS&limit=1`).then((res) => {
            axios.get(res.data["@graph"][0]["@id"]).then((res) => {
                var outs = []
                res.data.productText?.match(/\n\.{3}\s(.*?)(?:\n+.*)*?\n*\&{2}/g)?.forEach((el) => {
                    var risk = "none"
                    el.split("0.").forEach((li) => {
                        if (li.includes("...")) {
                            risk = li.split("..")[1]
                        } else if (risk.includes(type)) {
                            outs.push(li)
                        }
                    })
                })
                fixOutlooks(outs, type, day)
            })
        })
    }

    useEffect(() => {
        socket.emit('sync_location')
        socket.emit('sync_poly')
        updateWarnings()
    }, [])


    useEffect(() => {
        socket.on('set_poly', (data) => {
            var newstate = []
            data.polygons.forEach((el) => {
                var correctedBox = []
                el.coordinates.forEach(li => {
                    correctedBox.push(li.reverse())
                });
                newstate.push({"coordinates": correctedBox, "title": el.title, "color": el.color})
            })
            setPolystate(newstate)

            var mark = []
            data.markers.forEach((el) => {
                mark.push({"coordinates": el.coordinates?.reverse(), "title": el.title, "type": el.type, "link": el.link})
            })
            setMarkerstate(mark)
          })
          return () => socket.off('set_poly')
    }, [polystate, setPolystate])

    useEffect(() => {
        socket.on('add_poly', (data) => {
            var correctedBox = []
            JSON.parse(data.coordinates).forEach(li => {
                correctedBox.push(li.reverse())
            });
            setPolystate((state) => [...state, {"coordinates": correctedBox, "title": data.title, "color": data.color}])
          })
          return () => socket.off('add_poly')
    }, [polystate, setPolystate])

    useEffect(() => {
        socket.on('remove_poly', (data) => {
            var newarr = [...polystate]
            polystate.find((el, ind) => {
                if (el.id === data.id) {
                    newarr.splice(ind, 1)
                    return true;
                }
            });
            setPolystate(newarr)
          })    
          return () => socket.off('remove_poly')
    }, [polystate, setPolystate])

    useEffect(() => {
        socket.on('set_location', (data) => {
            setLocdata({
                "accuracy": data[0].accuracy,
                "accuracyRounded": (data[0].accuracy > 85 ? 100 : data[0].accuracy > 65 ? 75 : data[0].accuracy > 35 ? 50 : data[0].accuracy > 10 ? 25 : 0),
                "altitude": data[0].altitude,
                "altitudeRounded": (data[0].altitude > 4000 ? 6000 : data[0].altitude > 1000 ? 1200 : data[0].altitude > 300 ? 600 : data[0].altitude > 100 ? 200 : 0),
                "battery": data[0].battery,
                "batteryRounded": (data[0].battery > 85 ? 90 : data[0].battery > 65 ? 70 : data[0].battery > 45 ? 50 : data[0].battery > 25 ? 30 : data[0].battery > 5 ? 10 : 0),
                "lat": data[0].lat,
                "lon": data[0].lon,
                "velocity": data[0].velocity,
                "miles": data[0].tmiles
            })
          })
          return () => socket.off('set_location')
    }, [locdata, setLocdata])

    useEffect(() => {
        socket.on('update_location', (data, miles) => {
            setLocdata({
                "accuracy": data.acc,
                "accuracyRounded": (data.acc > 85 ? 100 : data.acc > 65 ? 75 : data.acc > 35 ? 50 : data.acc > 10 ? 25 : 0),
                "altitude": data.alt,
                "altitudeRounded": (data.alt > 4000 ? 6000 : data.alt > 1000 ? 1200 : data.alt > 300 ? 600 : data.alt > 100 ? 200 : 0),
                "battery": data.batt,
                "batteryRounded": (data.batt > 85 ? 90 : data.batt > 65 ? 70 : data.batt > 45 ? 50 : data.batt > 25 ? 30 : data.batt > 5 ? 10 : 0),
                "lat": data.lat,
                "lon": data.lon,
                "velocity": data.vel,
                "miles": miles
            })
          })
          return () => socket.off('update_location')
    }, [locdata, setLocdata])

    const MapComp = () => {

        const map = useMap()

        const locate = () => {
            map.setView([locdata.lat, locdata.lon], map.getZoom())
        }

        var locationIcon = L.icon({iconUrl: '/images/16icons/location-marker.gif', iconSize: [64, 64], iconAnchor: [32, 32], popupAnchor: [0, 0]})

        return (
            <div>
                <Marker icon={locationIcon} position={[locdata.lat, locdata.lon]} >
                    <Popup>Last known position. <br/>({`LAT: ${locdata.lat}, LON: ${locdata.lon}`})<br/> <a href="#stream-22" style={{color: 'lightblue'}}>Live cam</a></Popup>
                </Marker>
                <svg>
                    <defs>
                    <linearGradient id="Gradient-1" x1="3%" y1="4%" x2="6%" y2="6%">
                        <stop offset="0%" stop-color= "black" />
                        <stop offset="50%" stop-color= "#50508b" />
                    </linearGradient>
                    <linearGradient id="repeat" href="#Gradient-1" spreadMethod="repeat" />
                    </defs>
                </svg>
                <div id="map-details" className="map-details" style={{zIndex: 402}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '12px'}}>
                        <img loading='lazy' title="Accuracy of the last GPS location. Ironically, the accuracy is not usually accurate, and should be much higher." alt="decor" height={'24px'} width={'24px'} src={`/images/accuracy/accuracy-${locdata.accuracyRounded}.png`} />
                        <p>{locdata.accuracy}%</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '12px'}}>
                        <img loading='lazy' title="Current altitude." alt="decor" height={'24px'} width={'24px'} src={`/images/altitudes/altitude-${locdata.altitudeRounded}.png`} />
                        <p>{locdata.altitude}ft</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '12px'}}>
                        <img loading='lazy' title="Phone battery percentage." alt="phone battery percentage" height={'24px'} width={'24px'} src={`/images/phones/phone-${locdata.batteryRounded}.png`} />
                        <p>{locdata.battery}%</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3'}}>
                        <button className="map-menu-button" onClick={() => locate()}>Locate</button>
                        <button className="map-menu-button" onClick={() => document.querySelectorAll('.no-invert').forEach((el) => el.classList.toggle('hidden'))}>Radar</button>
                        <button className="map-menu-button" onClick={() => document.querySelectorAll('.leaflet-marker-icon').forEach((el) => el.classList.toggle('hidden'))}>Icons</button>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3'}}>
                        <button className="map-menu-button" onClick={() => addRisk("TORNADO", 1)}>Torn</button>
                        <button className="map-menu-button" onClick={() => addRisk("HAIL", 1)}>Hail</button>
                        <button className="map-menu-button" onClick={() => addRisk("WIND", 1)}>Wind</button>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3'}}>
                        <button className="map-menu-button" onClick={() => addRisk("TORNADO", 2)}>2Tor</button>
                        <button className="map-menu-button" onClick={() => addRisk("HAIL", 2)}>2Hail</button>
                        <button className="map-menu-button" onClick={() => addRisk("WIND", 2)}>2Wind</button>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', flexDirection: 'column', overflowY: 'scroll', gridColumn: 'span 3', maxHeight: '100%', background: 'black'}}>
                        <p style={{textAlign: 'center'}}>Map Key: </p>
                        <p style={{color: 'white'}}><b style={{color: 'red'}}>■</b> - Target Area</p>
                        <p style={{color: 'white'}}><b style={{color: 'lime'}}>■</b> - Greater Hail Risk</p>
                        <p style={{color: 'white'}}><b style={{color: 'purple'}}>■</b> - Greater Tornado Risk</p>
                        <p style={{color: 'white'}}><b style={{color: 'steelblue'}}>■</b> - Greater Damaging Winds Risk</p>
                        <p style={{color: 'white'}}><b style={{color: 'cyan'}}>■</b> - Greater Derecho Risk</p>
                        <p style={{color: 'white'}}><b style={{color: 'orange'}}>■</b> - Future Potential Severe Risk</p>
                        <p style={{color: 'white'}}><b style={{color: 'yellow'}}>■</b> - Far Future Potential Severe Risk</p>
                        <p style={{color: 'white'}}><b style={{color: 'pink'}}>■</b> - Special, click to check outlook.</p>
                    </div>
                    <button style={{gridColumn: 2}} className="map-menu-button hanging-buttons" onClick={() => document.getElementById('map-details').classList.toggle('key-show')}>Key</button>
                </div>

                <div className="car-details" style={{zIndex: 402, display: 'flex', justifyContent: 'flex-start'}}>
                    <img loading='lazy' src="/images/16icons/miles-counter.png" width={'20'} height={'24'} alt="decor" />
                    <p title={`~${locdata.miles.toFixed(1)} miles traveled this trip.`} style={{width: '46px', height: '24px', color: 'black', backgroundImage: 'url(/images/16icons/miles-counter-center.png)', backgroundSize: '46px 24px', lineHeight: '20px', textAlign: 'center'}}>{locdata.miles.toFixed(2)}mi</p>
                    <img loading='lazy' src="/images/16icons/miles-counter-end.png" width={'8'} height={'24'} alt="decor" />
                </div>
            </div>
        )
    }

    const Polygons = () => {

        const map = useMap()

        useEffect(() => {
            socket.on('highlight_poly', (data) => {
                map.eachLayer((la) => {
                    if (la?.getPopup()?.options?.children === data.title) {
                        var center = la.getCenter()
                        var name = data.title.replace(/\s+/g, '')
                        document.querySelectorAll(`.classname-${name}`).forEach((el) => {
                            el.classList.add('highlight-polygon')
                        })
                        map.panTo(center, {animate: true, duration: 1})
                        setTimeout(() => {
                            document.querySelectorAll(`.highlight-polygon`)?.forEach((el) => {
                                el.classList.remove('highlight-polygon')
                            })
                        }, [10000])
                    }
                })
              })
              return () => socket.off('highlight_poly')
        }, [map])

        return (
            <div>
                {outlooks?.map((el, ind) => {
                    if(el.coordinates?.length > 0) {
                        return (
                            <Polygon key={`warning-outlook-${ind}`} fillColor={el.color} opacity={0.6} weight="1.5" positions={el.coordinates} color={el.color}>
                                <Popup>{el.desc}</Popup>
                            </Polygon>
                        ) 
                    } else {
                        return (
                            <></>
                        )
                    }
                })}
                {polystate?.map((el, ind) => {
                    var name = el.title.replace(/\s+/g, '')
                    return (
                        <Polygon key={`warnss-${el.coordinates[0][0]}-${ind}`} className={`classname-${name}`} fillColor="transparent" weight="1.5" positions={el.coordinates} color={`${el.color}`}>
                            <Popup>{el.title}</Popup>
                        </Polygon>
                    )
                })}
                {warns?.map((el, ind) => {
                    if(el?.coordinates?.length > 0) {
                        return (
                            <Polygon key={`warning-${el.coordinates[0][0]}-${ind}`} className={`classname-${el.event?.replace(/\s+/g, '')}`} fill={"transparent"} weight="1.5" positions={el.coordinates} color={`${el.color}`}>
                                <Popup><p>{`${el.headline}`}<br/>{`${el.areaDesc}`}</p></Popup>
                            </Polygon>
                        ) 
                    } else {
                        return (
                            <></>
                        )
                    }
                })}
                {markerstate?.map((el, ind) => {
                    const Link = () => {
                        return (
                            <a href={`${el.link}`}><img src={`${el.link}`} alt="decor" width={'240px'} height={'120px'} /></a>
                        )
                    }
                    return (
                        <Marker key={`mark-${el.coordinates[0]}-${ind}`} icon={L.icon({iconUrl: `/images/16icons/${el.type}-marker.png`, iconSize: [16, 16], iconAnchor: [8, 0], popupAnchor: [0, 0]})} position={el.coordinates} >
                            <Popup><p>{el.title}<br/>{el?.link !== null ? <Link/> : null}</p></Popup>
                        </Marker>
                    )
                })}
            </div>
        )
    }

    return (
        <div style={{zIndex: 1, background: 'gray'}}>
            <MapContainer style={{height: '100%', zIndex: 2}} center={[41, -88]} zoom={4} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TileLayer
                    attribution='&copy; <a href="http://mesonet.agron.iastate.edu/ogc/">IEM</a>'
                    url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
                    opacity={0.50}
                    className="no-invert"
                />
                <MapComp/>
                <Polygons/>
            </MapContainer>
        </div>
    )
}

export default Map;