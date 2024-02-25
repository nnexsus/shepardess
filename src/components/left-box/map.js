import { useEffect, useState } from "react";
import axios from "axios";
import L from 'leaflet';
import { MapContainer, Marker, Pane, Polygon, Popup, TileLayer, Tooltip, useMap, useMapEvent } from "react-leaflet";

const polycolors = {
    "Special Weather Statement": "purple",
    "Winter Storm Warning": "white",
    "Winter Weather Advisory": "aliceblue",
    "Flood Warning": "lime",
    "Flash Flood Warning": "lime",
    "Rip Current Statement": "navy",
    "Lake Wind Advisory": "blue"
}

const Map = ({ socket }) => {

    const [polystate, setPolystate] = useState([])
    const [warns, setWarns] = useState([])
    const [markerstate, setMarkerstate] = useState([])

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
    useEffect(() => {
        updateWarnings()
        socket.emit('sync_location')
    }, [])

    const updateWarnings = () => {
        var updateWarn = [] 
        axios.get('https://api.weather.gov/alerts/active?status=actual&message_type=alert&region_type=land&urgency=Immediate,Expected&severity=Extreme,Severe,Moderate&certainty=Observed,Likely&limit=50').then((res) => {
            res?.data?.features?.map((el) => {
                var correctedBox = []
                el?.geometry?.coordinates[0].forEach(li => {
                    correctedBox.push(li.reverse())
                });
        
                updateWarn.push({"coordinates": correctedBox, "color": `${polycolors[`${el?.properties?.event}`]}`, "event": el?.properties?.event})
            })
        })
        setWarns(updateWarn)

        setTimeout(() => {
            updateWarnings()
        }, [600000])
    }

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
    }, [socket, locdata, setLocdata])

    const MapComp = () => {

        const map = useMap()

        const locate = () => {
            map.setView([locdata.lat, locdata.lon], map.getZoom())
        }

        //map based events

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
        }, [socket, locdata, setLocdata])

        var locationIcon = L.icon({iconUrl: '/images/16icons/location-marker.gif', iconSize: [64, 64], iconAnchor: [33, 20], popupAnchor: [0, 0]})

        return (
            <div>
                <Marker icon={locationIcon} position={[locdata.lat, locdata.lon]} >
                    <Popup>Last known position.</Popup>
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
                <div className="map-details" style={{zIndex: 402}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '12px'}}>
                        <img title="Accuracy of the last GPS location. Ironically, the accuracy is not usually accurate, and should be much higher." alt="decor" height={'24px'} width={'24px'} src={`/images/accuracy/accuracy-${locdata.accuracyRounded}.png`} />
                        <p>{locdata.accuracy}%</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '12px'}}>
                        <img title="Current altitude." alt="decor" height={'24px'} width={'24px'} src={`/images/altitudes/altitude-${locdata.altitudeRounded}.png`} />
                        <p>{locdata.altitude}ft</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '12px'}}>
                        <img title="Phone battery percentage." alt="phone battery percentage" height={'24px'} width={'24px'} src={`/images/phones/phone-${locdata.batteryRounded}.png`} />
                        <p>{locdata.battery}%</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gridColumn: 'span 3'}}>
                        <button className="map-menu-button" onClick={() => locate()}>Locate</button>
                        <button className="map-menu-button" onClick={() => document.querySelectorAll('.no-invert').forEach((el) => el.classList.toggle('hidden'))}>Radar</button>
                        <button className="map-menu-button" onClick={() => document.querySelectorAll('.leaflet-marker-icon').forEach((el) => el.classList.toggle('hidden'))}>Icons</button>
                    </div>
                </div>

                <div className="car-details" style={{zIndex: 402, display: 'flex', justifyContent: 'flex-start'}}>
                    <img src="/images/16icons/miles-counter.png" width={'20'} height={'24'} alt="decor" />
                    <p title={`~${locdata.miles.toFixed(1)} miles traveled this trip.`} style={{fontFamily: 'ms ui gothic', width: '46px', height: '24px', color: 'black', backgroundImage: 'url(/images/16icons/miles-counter-center.png)', backgroundSize: '46px 24px', lineHeight: '20px', textAlign: 'center'}}>{locdata.miles.toFixed(2)}mi</p>
                    <img src="/images/16icons/miles-counter-end.png" width={'8'} height={'24'} alt="decor" />
                </div>
            </div>
        )
    }

    const Polygons = () => {

        const map = useMap()

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
                    mark.push({"coordinates": el.coordinates?.reverse(), "title": el.title, "type": el.type})
                })
                setMarkerstate(mark)
              })
              return () => socket.off('set_poly')
        }, [socket, polystate, setPolystate])
    
        useEffect(() => {
            socket.on('add_poly', (data) => {
                setPolystate((state) => [...state, data])
              })
              return () => socket.off('add_poly')
        }, [socket, polystate, setPolystate])
    
        useEffect(() => {
            socket.on('remove_poly', (data) => {
                var newarr = polystate
                polystate.find((el, ind) => {
                    console.log(el.id + " == " + data.id + " at: " + ind)
                    if (el.id === data.id) {
                        newarr.splice(ind, 1)
                        return true;
                    }
                });
                console.log(newarr)
                setPolystate(newarr)
              })    
              return () => socket.off('remove_poly')
        }, [socket, polystate, setPolystate])

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
        }, [socket])

        return (
            <div>
                {polystate?.map((el, ind) => {
                    var name = el.title.replace(/\s+/g, '')
                    return (
                        <Polygon key={`warnss-${el.coordinates[0][0]}-${ind}`} className={`classname-${name}`} fillColor="transparent" weight="1" positions={el.coordinates} color={`${el.color}`}>
                            <Popup>{el.title}</Popup>
                        </Polygon>
                    )
                })}
                {warns?.map((el, ind) => {
                    if(el?.coordinates?.length > 0) {
                        return (
                            <Polygon key={`warning-${el.coordinates[0][0]}-${ind}`} className={`classname-${el.event.replace(/\s+/g, '')}`} fillColor="transparent" weight="1" positions={el.coordinates} color={`${el.color}`}>
                                <Popup>{el.event}</Popup>
                            </Polygon>
                        )
                    }
                })}
                {markerstate?.map((el, ind) => {
                    return (
                        <Marker key={`mark-${el.coordinates[0]}-${ind}`} icon={L.icon({iconUrl: `/images/16icons/${el.type}-marker.png`, iconSize: [16, 16], iconAnchor: [8, 0], popupAnchor: [0, 0]})} position={el.coordinates} >
                            <Popup>{el.title}</Popup>
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