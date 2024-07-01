import { MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvent } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import L from 'leaflet';

const socket = io.connect('https://arina.lol');

const MapWrapper = () => {

    const f = (e) => {
        localStorage.setItem("kaepyi", e.currentTarget.value)
    }

    const ControlMap = () => {

        const MapCont = ({ socket, apikey }) => {
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
                socket.emit('sync_poly')
            }, [])

            useEffect(() => {
                socket.on('toggle_miles', (data) => {
                    setMiles(data)
                })
                return () => socket.off('toggle_miles')
            }, [socket, miles, setMiles])

            const MapComp = () => {
                const [newpoly, setNewpoly] = useState({
                    "title": "",
                    "color": "pink"
                })

                const [markers, setMarkers] = useState({
                    "title": "",
                    "coords": "",
                    "type": "marker",
                    "link": ""
                })

                useMapEvent('contextmenu', (e) => {
                    createPoint(e.latlng)
                })
                useMapEvent('dblclick', (e) => {
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
                    setMarkers({"coords": arr, "type": markers.type, "title": markers.title, "link": markers.link})
                }

                const addMarker = () => {
                    var fullcoords = markers.coords
                    fullcoords.reverse()
                    var data = {
                        "title": markers.title,
                        "coords": fullcoords,
                        "type": markers.type,
                        "link": markers.link
                    }
                    var parsed = JSON.stringify(fullcoords)
                    socket.emit('send_add_marker', {'coordinates': parsed, 'type': data.type, 'title': data.title, 'link': data.link, 'key': apikey})
                }

                const cancelPoly = () => {
                    setPoints([])
                    setLines([])
                    setNewpoly({"title": '', "color": ''})
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
                                    <Popup>
                                    <div style={{background: 'url(/images/bgs/green_steel_wide_container.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column'}}>
                                        <h2 style={{textAlign: 'center', color: 'darkolivegreen', margin: '15px 0 0', textShadow: 'none'}}>New Polygon Settings</h2>
                                        <input className="analog-input" style={{marginTop: '16px'}} type='text' value={newpoly.title} onChange={(e) => setNewpoly({"title": e.currentTarget.value, "color": newpoly.color})} placeholder='Popup Title, required' />
                                        <select style={{width: '100%'}} className='analog-input' defaultValue={"pink"} name='Color' onChange={(e) => setNewpoly({"title": newpoly.title, "color": e.currentTarget.value})}>
                                            <option style={{color: 'red'}} value={"red"}>Target Area</option>
                                            <option style={{color: 'purple'}} value={"purple"}>Tornado Risk</option>
                                            <option style={{color: 'lime'}} value={"lime"}>Hail Risk</option>
                                            <option style={{color: 'lightblue'}} value={"lightblue"}>Winds Risk</option>
                                            <option style={{color: 'cyan'}} value={"cyan"}>Derecho Risk</option>
                                            <option style={{color: 'yellow'}} value={"yellow"}>Future Outlook</option>
                                            <option style={{color: 'orange'}} value={"orange"}>Far Future Outlook</option>
                                            <option style={{color: 'pink'}} value={"pink"}>Special</option>
                                            <option style={{color: 'aliceblue'}} value={"aliceblue"}>Special 2</option>
                                            <option style={{color: 'lightcoral'}} value={"lightcoral"}>Special 3</option>
                                            <option style={{color: 'mediumorchid'}} value={"mediumorchid"}>Special 4</option>
                                            <option style={{color: 'bisque'}} value={"bisque"}>Special 5</option>
                                            <option style={{color: 'chocolate'}} value={"chocolate"}>Special 6</option>
                                            <option style={{color: 'darkseagreen'}} value={"darkseagreen"}>Special 7</option>
                                            <option style={{color: 'deeppink'}} value={"deeppink"}>Special 8</option>
                                            <option style={{color: 'white'}} value={"white"}>Special 9</option>
                                        </select>
                                        <button onClick={() => createPoly()}>Close & Create Poly</button>
                                        <button onClick={() => cancelPoly()}>Cancel Poly</button>
                                    </div>
                                    </Popup>
                                </Marker>
                            )
                        })}
                        {lines?.map((el, ind) => {
                            return (
                                <Polyline key={`line-${el[0]}-${ind}`} positions={el}>
                                    <Tooltip><p>Click to open menu.</p></Tooltip>
                                    <Popup>
                                    <div style={{background: 'url(/images/bgs/green_steel_wide_container.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column'}}>
                                        <h2 style={{textAlign: 'center', color: 'darkolivegreen', margin: '15px 0 0', textShadow: 'none'}}>New Polygon Settings</h2>
                                        <input className="analog-input" style={{marginTop: '16px'}} type='text' value={newpoly.title} onChange={(e) => setNewpoly({"title": e.currentTarget.value, "color": newpoly.color})} placeholder='Popup Title, required' />
                                        <select style={{width: '100%'}} className='analog-input' defaultValue={"pink"} name='Color' onChange={(e) => setNewpoly({"title": newpoly.title, "color": e.currentTarget.value})}>
                                            <option style={{color: 'red'}} value={"red"}>Target Area</option>
                                            <option style={{color: 'purple'}} value={"purple"}>Tornado Risk</option>
                                            <option style={{color: 'lime'}} value={"lime"}>Hail Risk</option>
                                            <option style={{color: 'lightblue'}} value={"lightblue"}>Winds Risk</option>
                                            <option style={{color: 'cyan'}} value={"cyan"}>Derecho Risk</option>
                                            <option style={{color: 'yellow'}} value={"yellow"}>Future Outlook</option>
                                            <option style={{color: 'orange'}} value={"orange"}>Far Future Outlook</option>
                                            <option style={{color: 'pink'}} value={"pink"}>Special</option>
                                            <option style={{color: 'aliceblue'}} value={"aliceblue"}>Special 2</option>
                                            <option style={{color: 'lightcoral'}} value={"lightcoral"}>Special 3</option>
                                            <option style={{color: 'mediumorchid'}} value={"mediumorchid"}>Special 4</option>
                                            <option style={{color: 'bisque'}} value={"bisque"}>Special 5</option>
                                            <option style={{color: 'chocolate'}} value={"chocolate"}>Special 6</option>
                                            <option style={{color: 'darkseagreen'}} value={"darkseagreen"}>Special 7</option>
                                            <option style={{color: 'deeppink'}} value={"deeppink"}>Special 8</option>
                                            <option style={{color: 'white'}} value={"white"}>Special 9</option>
                                        </select>
                                        <button onClick={() => createPoly()}>Close & Create Poly</button>
                                        <button onClick={() => cancelPoly()}>Cancel Poly</button>
                                    </div>
                                    </Popup>
                                </Polyline>
                            )
                        })}
                        {markers.coords !== "" ? 
                            <Marker icon={L.icon({iconUrl: `/images/16icons/${markers.type}-marker.png`, iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [8, 8]})} position={markers.coords}>
                                <Tooltip><p>Click to open menu.</p></Tooltip>
                                <Popup>
                                    <div style={{background: 'url(/images/bgs/green_steel_wide_container.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column'}}>
                                        <h2 style={{textAlign: 'center', color: 'darkolivegreen', margin: '15px 0 0'}}>New Marker Settings</h2>
                                        <input className="analog-input" style={{marginTop: '16px'}} type='text' value={markers.title} onChange={(e) => setMarkers({"title": e.currentTarget.value, "coords": markers.coords, "type": markers.type, "link": markers.link})} placeholder='Marker Title' />
                                        <input className="analog-input" style={{marginTop: '16px'}} type='text' value={markers.link} onChange={(e) => setMarkers({"title": markers.title, "coords": markers.coords, "type": markers.type, "link": e.currentTarget.value})} placeholder='Link (optional)' />
                                        <select className='analog-input' defaultValue={"marker"} value={markers.type} onChange={(e) => setMarkers({"title": markers.title, "type": e.currentTarget.value, "coords": markers.coords, "link": markers.link})} name='Marker Type'>
                                            <option value={"marker"}>Marker</option>
                                            <option value={"lightning"}>Lightning</option>
                                            <option value={"flood"}>Flood</option>
                                            <option value={"bighail"}>Hail</option>
                                            <option value={"supercell"}>Supercell</option>
                                            <option value={"tornado"}>Tornado</option>
                                            <option value={"derecho"}>Derecho</option>
                                            <option value={"shelf"}>Shelf Cloud</option>
                                            <option value={"tropicalstorm"}>Tropical Storm</option>
                                            <option value={"hurricane"}>Hurricane</option>
                                            <option value={"eyewall"}>Eyewall</option>
                                            <option value={"other"}>Other</option>
                                        </select>
                                    </div>
                                    <button onClick={() => addMarker()}>Create Marker</button>
                                    <button onClick={() => setMarkers({"title": '', "type": 'marker', "coords": [0, 0], "link": ''})}>Cancel Marker</button>
                                </Popup>
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
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', border: 'inset 3px', outline: 'black solid 1px', margin: '5px'}}>
                                <button className="analog-button" onClick={() => socket.emit('send_toggle_miles', {'key': apikey})}>Toggle Milage Counter</button>
                                <p style={{color: 'white'}}><img loading='lazy' src="/images/bgs/status-light.png" width={'16px'} height={'16px'} style={{background: `${miles ? 'lime' : 'darkgreen'}`, borderRadius: '50%'}} />Currently: {miles ? "ON" : "OFF"}</p>
                            </div>
                        </div>
                    <MapComp/>
                </MapContainer>
            )
        }

        return (
            <div className='map-controls' style={{background: 'lightgray', border: 'outset 3px', outline: '2px black solid'}}>
                <h2 style={{color: 'black', textAlign: 'center'}}>Map Controls</h2>
                <h3 style={{color: 'black', textAlign: 'center'}}>Right click to begin making points for a polygon. Double click to place a marker.</h3>
                <div style={{width: 'calc(100% - 12px)', height: 'calc(100% - 12px)', border: 'inset 3px', padding: '3px', background: 'black'}}>
                    <MapCont socket={socket} apikey={localStorage.getItem("kaepyi")}/>
                </div>
            </div>
        )
    }

    const Accounts = () => {
        const [accounts, setAccounts] = useState([])

        useEffect(() => {
            socket.emit('sync_accounts', {'key': localStorage.getItem("kaepyi")})
        }, [])

        useEffect(() => {
            socket.on('set_accounts', (data) => {
              setAccounts(data)
            })
            return () => socket.off('set_accounts')
        }, [socket, accounts, setAccounts])
    
        useEffect(() => {
            socket.on('update_accounts', (data) => {
                setAccounts(data)
            })
            return () => socket.off('update_accounts')
        }, [socket, accounts, setAccounts])
        const permissions = ['lights', 'popups', 'texts', 'posts', 'markers', 'polygons', 'streams', 'accounts']
        const togglePermission = (newvalue, permission, username) => {
            console.log(newvalue, permission, username)
        } 
        return (
            <div className='control-accounts-wrapper'>
                <p style={{background: 'rgba(55,55,55,1)', color: 'white', fontSize: '10px', textAlign: 'center', margin: 0, padding: 0}}>Accounts (admin only)</p>
                {accounts.map((el, ind) => {
                    return (
                        <div key={`apiaccount-${ind}`} style={{background: 'blue', width: 'calc(100% - 4px)', height: '154px', border: 'solid black 2px'}}>
                            <div style={{display: 'flex'}}>
                                <img src='/images/16icons/avatar.png' width={'24px'} height={'24px'} alt='decor' />
                                <p style={{color: 'white', padding: 0, margin: 0, fontSize: '10px'}}>{el.username}</p>
                            </div>
                            <p style={{color: 'white', padding: 0, margin: 0, fontSize: '10px'}}>Creator: {el.createdby}</p>
                            <p style={{color: 'white', padding: 0, margin: 0, fontSize: '10px'}}>{el.createdat}</p>
                            <div style={{display: 'grid', gridTemplateColumns: '25% 25% 25% 25%'}}>
                                {permissions.map((li, ind2) => {
                                    const checked = el.permissions.includes(li)
                                    return (
                                        <>
                                            <label htmlFor={`checkbox-${ind}-${ind2}`}><img src={`/images/permissions/perm-${li}.png`} alt={`${li}`} title={`Toggle ${li} permission.`} /></label>
                                            {checked ? 
                                                <input id={`checkbox-${ind}-${ind2}`} type='checkbox' name={`${li}`} value={true} onChange={(e) => togglePermission(e.currentTarget.value, e.currentTarget.name, el.username)} checked />
                                            :
                                                <input id={`checkbox-${ind}-${ind2}`} type='checkbox' name={`${li}`} value={false} onChange={(e) => togglePermission(e.currentTarget.value, e.currentTarget.name, el.username)} />
                                            }
                                        </>
                                    )
                                })

                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const Messages = () => {
        return (
            <div style={{width: 'calc(100% - 10px)', height: 'calc(100% - 10px)', border: 'inset 3px', padding: '2px', background: 'url(/images/bgs/moon-bg.png)'}}>
                <p style={{color: 'white'}}>Welcome to the control panel!</p>
            </div>
        )
    }

    return (
        <div className="control-app">
            <div className='logo-container' style={{width: 'calc(100% - 6px)', height: 'calc(100% - 6px)', display: 'grid', gridTemplateColumns: '50% 50%', gridTemplateRows: '50% 50%', alignItems: 'center', justifyContent: 'center', background: 'black', gridColumn: 1, gridRow: 1, border: 'outset 3px'}}>
                <a style={{outline: 'outset 2px'}} href='/home' ><img loading='lazy' height={'24px'} src="/images/bgs/skull-logo.png" alt="logo" /></a>
                <a style={{outline: 'outset 2px'}} href='/control/panels' ><img loading='lazy' height={'24px'} src="/images/16icons/terminalicon.png" alt="logo" /></a>
                <a style={{outline: 'outset 2px'}} href='/control/streams' ><img loading='lazy' height={'24px'} src="/images/16icons/terminallinkicon.png" alt="logo" /></a>
                <a style={{outline: 'outset 2px'}} href='/control' ><img loading='lazy' height={'24px'} src="/images/16icons/control.png" alt="logo" /></a>
            </div>

            <div className='control-account control-desc-part' style={{gridColumn: 3, gridRow: 1}}>
                <input type='password' placeholder='API key here.' value={localStorage.getItem('kaepyi')} onChange={(e) => f(e)} />
            </div>

            <div style={{gridColumn: 2, gridRow: 1}}>
                <Messages/>
            </div>

            <div style={{gridColumn: 1, gridRow: 2}}>
                <Accounts/>
            </div>

            <div style={{gridColumn: 'span 2', gridRow: 2}}>
                <ControlMap/>
            </div>
        </div>
    )
}

export default MapWrapper;