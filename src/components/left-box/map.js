import { MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
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

    const windColors = {
        "<5%": '#fff',
        '5-10': '#008c00',
        '10-20': '#00ce00',
        '20-30': '#80ff00',
        '30-40': '#ffff00',
        '40-50': '#ffd800',
        '50-60': '#ce8600',
        '60-70': '#ff8000',
        '70-80': '#ce0000',
        '80-90': '#8c0000',
        ">90%": '#8c008c'
    }
    const opactiyLevels = {
        "<5%": 0.1,
        '5-10': 0.12,
        '10-20': 0.12,
        '20-30': 0.13,
        '30-40': 0.14,
        '40-50': 0.17,
        '50-60': 0.18,
        '60-70': 0.2,
        '70-80': 0.2,
        '80-90': 0.2,
        ">90%": 0.3
    }

    const dayDesc = ["", "today", "tomorrow"]

    useEffect(() => {
        socket.emit('sync_location')
        socket.emit('sync_poly')
    }, [])

    const MapComp = () => {

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
        const map = useMap()

        const locate = () => {
            navigator.geolocation.getCurrentPosition((res) => {
                map.setView([res.coords.latitude, res.coords.longitude])
            }, (err) => console.log(err), {enableHighAccuracy: false, timeout: 5000, maximumAge: 0})
        }

        var locationIcon = L.icon({iconUrl: '/images/16icons/location-marker.gif', iconSize: [64, 64], iconAnchor: [32, 32], popupAnchor: [0, 0]})

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

        const OutlookPolys = () => {
            return (
                <>
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
                </>
            )
        }

        const Cone = () => {
            const [cones, setCones] = useState([])

            const loadCone = () => {
                if(cones.length === 0) {
                    axios.get('https://utility.arcgis.com/sharing/kml?url=http://www.nhc.noaa.gov/gis/kml/nhc_active.kml').then((res) => {
                        if (res.data.networkLinks.length === 0) return false
                        return res.data.networkLinks[4].href
                    }).then((conelink) => {
                        if (!conelink) return
                        axios.get(`https://utility.arcgis.com/sharing/kml?url=${conelink}`).then((res2) => {
                            return res2.data
                        }).then((kml) => {
                            setCones([{"geometry": kml.featureCollection?.layers[0]?.featureSet?.features[0]?.geometry?.rings[0], "attributes": kml.featureCollection?.layers[0]?.featureSet?.features[0]?.attributes}])
                        })
                    })
                } else {
                    setCones([])
                }
            }

            return (
                <>
                    <button className="map-menu-button" title="Draws current tropical storm warning cones." onClick={() => loadCone()}>Cones</button>
                {cones.map((el, ind) => {
                    var rev = []
                    el.geometry.forEach((li) => {
                        rev.push(li.reverse())
                    })
                    return (
                        <Polygon className="zindex-502" key={`tropicstormcone-${ind}`} fillOpacity={1} weight={1.85} positions={rev} color="red">
                            <Popup>Cone of uncertainty for {el.attributes.storm}. Last issued update: {el.attributes.advisoryDate}. The cone of uncertainty is a defined area issued by the National Hurricane Center for possible areas the center of the tropical storm or hurricane could move into. It is NOT the expected damaging path or area at risk; for that information, activate the Winds layer.</Popup>
                        </Polygon>
                    )
                }) }
                </>
            )
        }
        
        const Track = () => {
            const [tracks, setTracks] = useState([])

            const loadTrack = () => {
                if(tracks.length === 0) {
                    axios.get('https://utility.arcgis.com/sharing/kml?url=http://www.nhc.noaa.gov/gis/kml/nhc_active.kml').then((res) => {
                        if (res.data.networkLinks.length === 0) return false
                        return res.data.networkLinks[5].href
                    }).then((conelink) => {
                        if (!conelink) return
                        axios.get(`https://utility.arcgis.com/sharing/kml?url=${conelink}`).then((res2) => {
                            return res2.data
                        }).then((kml) => {
                            setTracks([kml.featureCollection?.layers[1]?.featureSet?.features[0]?.geometry?.paths[0]])
                        })
                    })
                } else {
                    setTracks([])
                }
            }

            return (
                <>
                    <button className="map-menu-button" title="Draws current tropical storm expected tracks." onClick={() => loadTrack()}>Track</button>
                {tracks.map((el, ind) => {
                    var rev = []
                    el.forEach((li) => {
                        rev.push(li.reverse())
                    })
                    return (
                        <Polyline className="zindex-503" key={`tropicstormtrack-${ind}`} fillOpacity={1} weight={2.85} positions={rev} color="white"><Popup>Tropical Storm</Popup></Polyline>
                    )
                }) }
                </>
            )
        }

        const Wind = () => {
            const [winds, setWinds] = useState([])

            const loadWinds = () => {
                if (winds.length === 0) {
                    axios.get('https://utility.arcgis.com/sharing/kml?url=http://www.nhc.noaa.gov/gis/kml/nhc_active.kml').then((res) => {
                        if (res.data.networkLinks.length === 0) return false
                        return res.data.networkLinks[0].href
                    }).then((conelink) => {
                        if (!conelink) return
                        axios.get(`https://utility.arcgis.com/sharing/kml?url=${conelink}`).then((res2) => {
                            return res2.data
                        }).then((kml) => {
                            setWinds(kml.featureCollection?.layers[0]?.featureSet?.features)
                        })
                    })
                } else {
                    setWinds([])
                }
            }

            return (
                <>
                    <button className="map-menu-button" title="Draws current tropical storm wind percentage areas (MAY LAG)." onClick={() => loadWinds()}>Winds</button>
                {winds.map((el, ind) => {
                    var re = []
                    el.geometry.rings.forEach((li) => {
                        var rev = []
                        li.forEach((la, ind) => {
                            if (ind % 2 !== 0) {
                                rev.push(la.reverse())
                            }
                        })
                        re.push(rev)
                    })
                    return (
                        <>
                            {re.map((li, ind2) => {
                                return (
                                    <Polygon className="zindex-501" key={`tropicstormwinds-${ind}-${ind2}-${(Math.random() * 100)}`} fillOpacity={opactiyLevels[`${el.attributes.description}`]} weight={2.85} positions={li} color={windColors[`${el.attributes.description}`]}><Popup>{el.attributes.description} chance of tropical storm winds (winds in excess of 34kts).</Popup></Polygon>
                                )
                            })}
                        </>
                    )
                }) }
                </>
            )
        }

        return (
            <div>
                <Marker icon={locationIcon} position={[locdata.lat, locdata.lon]} >
                    <Popup>Last known position. <br/>({`LAT: ${locdata.lat}, LON: ${locdata.lon}`})<br/> <a href="#stream-22" style={{color: 'lightblue'}}>Live cam</a></Popup>
                </Marker>
                <OutlookPolys/>
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
                    <button className="map-menu-button" style={{gridColumn: 2, gridRow: 1}} onClick={() => document.getElementById('map-details').classList.toggle('control-show')}>Control</button>
                    <div style={{gridColumn: 'span 3', background: 'url(/images/bgs/green_steel_wide_container_top.png)', backgroundSize: '100% 100%', display: 'grid', gridTemplateColumns: '33% 34% 33%', height: '100%'}}>
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
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3', background: 'url(/images/bgs/green_steel_wide_container_center.png)', backgroundSize: '100% 100%'}}>
                        <button className="map-menu-button" title="Moves the map to your general position (may take a second)." onClick={() => locate()}>Center</button>
                        <button className="map-menu-button" title="Toggles the radar layer on/off." onClick={() => document.querySelectorAll('.no-invert').forEach((el) => el.classList.toggle('hidden'))}>Radar</button>
                        <button className="map-menu-button" title="Toggles the marker and icon layers on/off." onClick={() => document.querySelectorAll('.leaflet-marker-icon').forEach((el) => el.classList.toggle('hidden'))}>Icons</button>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3', background: 'url(/images/bgs/green_steel_wide_container_center.png)', backgroundSize: '100% 100%'}}>
                        <p>SPC Risk Type Outlooks</p>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3', background: 'url(/images/bgs/green_steel_wide_container_center.png)', backgroundSize: '100% 100%'}}>
                        <button className="map-menu-button" title="Draws todays SPC Tornado risk." onClick={() => addRisk("TORNADO", 1)}>Torn</button>
                        <button className="map-menu-button" title="Draws todays SPC Hail risk." onClick={() => addRisk("HAIL", 1)}>Hail</button>
                        <button className="map-menu-button" title="Draws todays SPC Wind risk." onClick={() => addRisk("WIND", 1)}>Wind</button>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3', background: 'url(/images/bgs/green_steel_wide_container_center.png)', backgroundSize: '100% 100%'}}>
                        <button className="map-menu-button" title="Draws tomorrows SPC Tornado risk." onClick={() => addRisk("TORNADO", 2)}>2Tor</button>
                        <button className="map-menu-button" title="Draws tomorrows SPC Hail risk." onClick={() => addRisk("HAIL", 2)}>2Hail</button>
                        <button className="map-menu-button" title="Draws tomorrows SPC Wind risk." onClick={() => addRisk("WIND", 2)}>2Wind</button>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3', background: 'url(/images/bgs/green_steel_wide_container_center.png)', backgroundSize: '100% 100%'}}>
                        <p>Tropical Storm Data</p>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3', background: 'url(/images/bgs/green_steel_wide_container_center.png)', backgroundSize: '100% 100%'}}>
                        <Track/>
                        <Cone/>
                        <Wind/>
                    </div>
                    <div className="hanging-buttons" style={{display: 'flex', flexWrap: 'wrap', overflowY: 'scroll', gridColumn: 'span 3', maxHeight: '100%', padding: '0 16px', background: 'url(/images/bgs/green_steel_wide_container_center.png)', backgroundSize: '100% 100%'}}>
                        <p style={{textAlign: 'center'}}>Key: </p>
                        <p style={{color: 'white'}}><b title="Target Area" style={{color: 'red'}}>■</b></p>
                        <p style={{color: 'white'}}><b title="Greater Hail Risk" style={{color: 'lime'}}>■</b></p>
                        <p style={{color: 'white'}}><b title="Greater Tornado Risk" style={{color: 'purple'}}>■</b></p>
                        <p style={{color: 'white'}}><b title="Greater Damaging Winds Risk" style={{color: 'steelblue'}}>■</b></p>
                        <p style={{color: 'white'}}><b title="Greater Derecho Risk" style={{color: 'cyan'}}>■</b></p>
                        <p style={{color: 'white'}}><b title="Future Potential Severe Risk" style={{color: 'orange'}}>■</b></p>
                        <p style={{color: 'white'}}><b title="Far Future Potential Severe Risk" style={{color: 'yellow'}}>■</b></p>
                        <p style={{color: 'white'}}><b title="Special, click to check." style={{color: 'pink'}}>■</b></p>
                    </div>
                    <div style={{gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '33% 34% 33%', background: 'url(/images/bgs/green_steel_wide_container_bottom.png)', backgroundSize: '100% 100%'}}>
                        <button className="map-menu-button hanging-buttons" style={{gridColumn: 2}} onClick={() => document.getElementById('map-details').classList.toggle('key-show')}>Key</button>
                    </div>
                </div>

                <div className="car-details" style={{zIndex: 402, display: 'flex', justifyContent: 'flex-start'}}>
                    <img loading='lazy' src="/images/16icons/miles-counter.png" width={'20'} height={'24'} alt="decor" />
                    <p title={`~${locdata.miles.toFixed(1)} miles traveled this trip.`} style={{width: '46px', height: '24px', color: 'black', backgroundImage: 'url(/images/16icons/miles-counter-center.png)', backgroundSize: '46px 24px', lineHeight: '20px', textAlign: 'center'}}>{locdata.miles.toFixed(2)}mi</p>
                    <img loading='lazy' src="/images/16icons/miles-counter-end.png" width={'8'} height={'24'} alt="decor" />
                </div>
            </div>
        )
    }

    const WarningPolys = () => {
        const [warns, setWarns] = useState([])

        const updateWarnings = () => {
            console.log("Updating warnings")
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

        useEffect(() => {
            updateWarnings()
        }, [])

        return (
            <>
                {warns?.map((el, ind) => {
                    if(el?.coordinates?.length > 0) {
                        return (
                            <Polygon key={`warning-${el.coordinates[0][0]}-${ind}`} className={`classname-${el.event?.replace(/\s+/g, '')}`} fillOpacity={0.2} weight="1.85" positions={el.coordinates} color={`${el.color}`}>
                                <Popup><p>{`${el.headline}`}<br/>{`${el.areaDesc}`}</p></Popup>
                            </Polygon>
                        ) 
                    } else {
                        return (
                            <></>
                        )
                    }
                })}
            </>
        )
    }

    const SpecialPolys = () => {

        const [polystate, setPolystate] = useState([])
        const [markerstate, setMarkerstate] = useState([])
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

        return (
            <>
                {markerstate?.map((el, ind) => {
                    const Link = () => {
                        return (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <a style={{color: 'lightblue'}} href={`${el.link}`}>Open Source</a>
                                <iframe src={`${el.link}`} alt="decor" width={'240px'} height={'120px'} />
                                <button style={{border: 'outset 2px', outline: 'black 1px solid', background: 'darkgreen', color: 'white'}} onClick={() => document.getElementsByClassName('leaflet-popup-close-button')[0].click()}>Close</button>
                            </div>
                        )
                    }
                    return (
                        <Marker key={`mark-${el.coordinates[0]}-${ind}`} icon={L.icon({iconUrl: `/images/16icons/${el.type}-marker.png`, iconSize: [16, 16], iconAnchor: [8, 0], popupAnchor: [0, 0]})} position={el.coordinates} >
                            <Popup><p>{el.title}<br/>{el?.link !== null ? <Link/> : null}</p></Popup>
                        </Marker>
                    )
                })}
                {polystate?.map((el, ind) => {
                    var name = el.title.replace(/\s+/g, '')
                    return (
                        <Polygon key={`warnss-${el.coordinates[0][0]}-${ind}`} className={`classname-${name}`} fillOpacity={0.1} weight="1.85" positions={el.coordinates} color={`${el.color}`}>
                            <Popup>{el.title}</Popup>
                        </Polygon>
                    )
                })}
            </>
        )
    }

    const Polygons = () => {
        return (
            <>
                <WarningPolys/>
                <SpecialPolys/>
            </>
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