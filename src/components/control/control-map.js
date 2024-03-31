import { useEffect, useState } from "react";
import axios from "axios";
import L from 'leaflet';
import { MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvent } from "react-leaflet";

const ControlMap = ({ socket, apikey }) => {

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
        "velocity": 0
    })

    const [polystate, setPolystate] = useState([])
    const [points, setPoints] = useState([])
    const [lines, setLines] = useState([])

    const [newpoly, setNewpoly] = useState({
        "title": "",
        "coords": "",
        "color": ""
    })

    const [markers, setMarkers] = useState({
        "title": "",
        "coords": "",
        "type": ""
    })

    const [miles, setMiles] = useState(false)

    useEffect(() => {
        axios.get('https://arina.lol/api/shepardess/location-get').then((res) => {
            setLocdata({
                "accuracy": res.data[0].accuracy,
                "accuracyRounded": (res.data[0].accuracy > 85 ? 100 : res.data[0].accuracy > 65 ? 75 : res.data[0].accuracy > 35 ? 50 : res.data[0].accuracy > 10 ? 25 : 0),
                "altitude": res.data[0].altitude,
                "altitudeRounded": (res.data[0].altitude > 4000 ? 6000 : res.data[0].altitude > 1000 ? 1200 : res.data[0].altitude > 300 ? 600 : res.data[0].altitude > 100 ? 200 : 0),
                "battery": res.data[0].battery,
                "batteryRounded": (res.data[0].battery > 85 ? 90 : res.data[0].battery > 65 ? 70 : res.data[0].battery > 45 ? 50 : res.data[0].battery > 25 ? 30 : res.data[0].battery > 5 ? 10 : 0),
                "lat": res.data[0].lat,
                "lon": res.data[0].lon,
                "velocity": res.data[0].velocity
            })
        })
    }, [])

    useEffect(() => {
        socket.on('toggle_miles', (data) => {
            setMiles(data)
          })
          return () => socket.off('toggle_miles')
    }, [socket, miles, setMiles])

    const MapComp = () => {
        const map = useMap()
        const mapEvent = useMapEvent('contextmenu', (e) => {
            createPoint(e.latlng)
        })
        const eventTwo = useMapEvent('dblclick', (e) => {
            createMarker(e.latlng)
        })

        const createPoint = (latlng) => {
            var arr = [latlng.lat, latlng.lng]
            points.length >= 1 ? setPoints((state) => [...state, arr], createLine(arr)) : setPoints((state) => [...state, arr])
        }

        const createLine = (latlng) => {
            setLines((state) => [...state, [points[points.length - 1], latlng]])
        }

        const createPoly = () => {
            if (newpoly.title !== "" && newpoly.title !== "null" && lines.length >= 3) {
                addPoly()
                setPoints([])
                setLines([])
                setNewpoly({
                    "title": "",
                    "coords": "",
                    "color": ""
                })
            }
        }

        //map based events

        useEffect(() => {
            socket.on('set_poly', (data) => {
                var newstate = []
                data.polygons.forEach((el) => {
                    var correctedBox = []
                    el.coordinates.forEach(li => {
                        correctedBox.push(li.reverse())
                    });
                    newstate.push({"coordinates": correctedBox, "title": el.title, "color": el.color, "id": el.id})
                })
                setPolystate(newstate)
              })
              return () => socket.off('set_poly')
        }, [socket, polystate, setPolystate])
    
        useEffect(() => {
            socket.on('add_poly', (data) => {
                var parsed = JSON.parse(data.coordinates)
                var coord = []
                parsed.forEach((el) => {
                    coord.push(el.reverse())
                })
                var newobj = {
                    "id": data.id,
                    "color": data.color,
                    "title": data.title,
                    "coordinates": coord
                }
                setPolystate((state) => [...state, newobj])
              })
              return () => socket.off('add_poly')
        }, [socket, polystate, setPolystate])
    
        useEffect(() => {
            socket.on('remove_poly', (data) => {
                var newarr = [...polystate]
                newarr.find((el, ind) => {
                    if (el.id === data.id) {
                        newarr.splice(ind, 1)
                    }
                });
                setPolystate(newarr)
              })    
              return () => socket.off('remove_poly')
        }, [socket, polystate, setPolystate])

        useEffect(() => {
            socket.on('update_location', (data) => {
                console.log(data)
                setLocdata({
                    "accuracy": data.acc,
                    "accuracyRounded": (data.acc > 85 ? 100 : data.acc > 65 ? 75 : data.acc > 35 ? 50 : data.acc > 10 ? 25 : 0),
                    "altitude": data.alt,
                    "altitudeRounded": (data.alt > 4000 ? 6000 : data.alt > 1000 ? 1200 : data.alt > 300 ? 600 : data.alt > 100 ? 200 : 0),
                    "battery": data.batt,
                    "batteryRounded": (data.batt > 85 ? 90 : data.batt > 65 ? 70 : data.batt > 45 ? 50 : data.batt > 25 ? 30 : data.batt > 5 ? 10 : 0),
                    "lat": data.lat,
                    "lon": data.lon,
                    "velocity": data.vel
                })
              })
              return () => socket.off('update_location')
        }, [socket, locdata, setLocdata])

        const addPoly = () => {
            var fullcoords = points
            fullcoords.forEach((el) => {
                el.reverse()
            })
            fullcoords.push(points[0])
            var data = {
                "title": newpoly.title,
                "coords": fullcoords,
                "color": newpoly.color
            }
            var parsed = JSON.stringify(fullcoords)
            socket.emit('send_add_poly', {'coordinates': parsed, 'color': data.color, 'title': data.title, 'key': apikey})
        }

        const updatePoly = (id, value) => {
            socket.emit('send_update_poly', {"id": id, "title": value, "key": apikey})
        }

        const removePoly = (id) => {
            socket.emit('send_remove_poly', {"id": id, "key": apikey})
        }

        const highlightPoly = (id) => {
            socket.emit('send_highlight_poly', {"title": id, "type": "normal", "key": apikey})
        }


        const createMarker = (latlng) => {
            var arr = [latlng.lat, latlng.lng]
            setMarkers({"coords": arr, "type": markers.type, "title": markers.title})
        }

        const addMarker = () => {
            var fullcoords = markers.coords
            fullcoords.reverse()
            var data = {
                "title": markers.title,
                "coords": fullcoords,
                "type": markers.type
            }
            var parsed = JSON.stringify(fullcoords)
            socket.emit('send_add_marker', {'coordinates': parsed, 'type': data.type, 'title': data.title, 'key': apikey})
        }

        return (
            <div>
                {polystate?.map((el, ind) => {
                    return (
                        <Polygon key={`warnss-${el.coordinates[0][0]}-${ind}`} fillColor="transparent" weight="1.5" positions={el.coordinates} color={`${el.color}`}>
                            <Tooltip><p>Click to open menu.</p></Tooltip>
                            <Popup>
                                <div style={{display: 'flex'}}>
                                    <input type="text" placeholder="Title" defaultValue={`${el.title}`} id={`polygon-${el.id}`} className="map-input"/>
                                    <button title='Update' style={{backgroundImage: 'url(/images/16icons/upload.png)', backgroundColor: 'white'}} className='analog-button square-button' onClick={() => updatePoly(el.id, document.getElementByID(`polygon-${el.id}`).value)}></button>
                                    <button title='Remove' style={{backgroundImage: 'url(/images/16icons/x-button.png)', backgroundColor: 'pink'}} className='analog-button square-button' onClick={() => removePoly(el.id)}></button>
                                </div>
                                <button style={{width: '100%', textAlign: 'center'}} title='Highlight' className='analog-button square-button' onClick={() => highlightPoly(el.title)}>Highlight</button>
                            </Popup>
                        </Polygon>
                    )
                })}
                <Marker icon={L.icon({iconUrl: '/images/16icons/location-marker.gif', iconSize: [64, 64], iconAnchor: [32, 32], popupAnchor: [0, 0]})} position={[locdata.lat, locdata.lon]} >
                    <Popup>Last known position.</Popup>
                </Marker>
                {points?.map((el, ind) => {
                    var icon = L.icon({iconUrl: '/images/16icons/marker.png', iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [8, 8]})
                    return (
                        <Marker icon={icon} key={`custompoint-${el[0]}-${ind}`} position={el}>
                            <Tooltip><p>Click to open menu.</p></Tooltip>
                            <Popup><button onClick={() => createPoly()}>Close & Create Poly</button></Popup>
                        </Marker>
                    )
                })}
                {lines?.map((el, ind) => {
                    return (
                        <Polyline key={`line-${el[0]}-${ind}`} positions={el}>
                            <Tooltip><p>Click to open menu.</p></Tooltip>
                            <Popup><button onClick={() => createPoly()}>Close & Create Poly</button></Popup>
                        </Polyline>
                    )
                })}
                {markers.coords !== "" ? 
                    <Marker icon={L.icon({iconUrl: `/images/16icons/${markers.type}-marker.png`, iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [8, 8]})} position={markers.coords}>
                        <Tooltip><p>Click to open menu.</p></Tooltip>
                        <Popup><button onClick={() => addMarker()}>Create Marker</button></Popup>
                    </Marker>
                : null}
            </div>
        )
    }

    return (
        <MapContainer style={{height: '100%', zIndex: 2}} center={[41, -88]} zoom={4} doubleClickZoom={false} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png	"
                />
                <TileLayer
                    attribution='&copy; <a href="http://mesonet.agron.iastate.edu/ogc/">IEM</a>'
                    url="https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"
                    opacity={0.50}
                    className="no-invert"
                />
                <div style={{position: 'absolute', zIndex: 401, right: 0}}>
                    <div style={{background: 'url(/images/bgs/green_steel_wide_container.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column'}}>
                        <h2 style={{textAlign: 'center', color: 'darkolivegreen', margin: '15px 0 0'}}>New Polygon Settings</h2>
                        <input className="analog-input" style={{marginTop: '16px'}} type='text' value={newpoly.title} onChange={(e) => setNewpoly({"title": e.currentTarget.value, "color": newpoly.color})} placeholder='Popup Title, required' />
                        <input className="analog-input" type='text' value={newpoly.color} onChange={(e) => setNewpoly({"title": newpoly.title, "color": e.currentTarget.value})} placeholder='Hex color, default: Blue'/>
                    </div>
                    <div style={{background: 'url(/images/bgs/green_steel_wide_container.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column'}}>
                        <h2 style={{textAlign: 'center', color: 'darkolivegreen', margin: '15px 0 0'}}>New Marker Settings</h2>
                        <input className="analog-input" style={{marginTop: '16px'}} type='text' value={markers.title} onChange={(e) => setMarkers({"title": e.currentTarget.value, "coords": markers.coords, "type": markers.type})} placeholder='Marker Title' />
                        <select className='analog-input' defaultValue={"marker"} value={markers.type} onChange={(e) => setMarkers({"title": markers.title, "type": e.currentTarget.value, "coords": markers.type})} name='Marker Type'>
                            <option value={"marker"}>Marker</option>
                            <option value={"tornado"}>Tornado</option>
                            <option value={"bighail"}>Hail</option>
                            <option value={"flood"}>Flood</option>
                            <option value={"shelf"}>Shelf Cloud</option>
                        </select>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', border: 'inset 3px', outline: 'black solid 1px', margin: '5px'}}>
                        <button className="analog-button" onClick={() => socket.emit('send_toggle_miles', {'key': apikey})}>Toggle Milage Counter</button>
                        <p style={{color: 'white'}}><img loading='lazy' src="/images/bgs/status-light.png" width={'16px'} height={'16px'} style={{background: `${miles ? 'lime' : 'darkgreen'}`, borderRadius: '50%'}} />Currently: {miles ? "ON" : "OFF"}</p>
                    </div>
                </div>
            <MapComp/>
        </MapContainer>
    )
}

export default ControlMap;