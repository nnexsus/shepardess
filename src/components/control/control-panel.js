import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import ControlMap from './control-map';

import '../../css/control-panel.css'

const socket = io.connect('https://arina.lol');

const ControlPanel = () => {

    const [key, setKey] = useState({
        "username": "",
        "key": "key"
    })

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
        "threat": "none",
        "scrolling": "",
        "qrd": "",
        "desc": ""
    })

    const [newscroll, setNewscroll] = useState("Scrolling text.")
    const [newQRD, setNewQRD] = useState("QRD Title.")
    const [newdesc, setNewdesc] = useState("Description.")

    const [streams, setStreams] = useState([])

    const [newCamera, setNewCamera] = useState({
        "internalname": `cam-${Date.now()}`,
        "groupname": 0,
        "title": "New Camera",
        "link": "https://nnexsus.net/",
        "thumblink": "https://nnexsus.net/images/panels/inits/3-31-23.webp",
        "type": 0
    })

    const [groups, setGroups] = useState([])

    const [newGroup, setNewGroup] = useState({
        "internalname": 'testgroup',
        "title": "Test Group"
    })

    useEffect(() => {
        socket.emit('sync_status')
        socket.emit('sync_description')
        socket.emit('sync_stream')
        socket.emit('sync_group')
        socket.emit('sync_poly')
    }, [])

    //update functions
    const changeStatus = (status) => {
        var data = {
            "key": key.key,
            "user": key.username,
            "newstatus": !stat[`${status}`],
            "title": status
        }
        socket.emit('send_update_status', {'title': `${data.title}`, 'newstatus': data.newstatus, 'key': `${data.key}`})
    }

    const changeDescs = (id) => {
        var data = {
            "key": key.key,
            "user": key.username,
            "newtext": newscroll,
            "id": id
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const changeQRD = (id) => {
        var data = {
            "key": key.key,
            "user": key.username,
            "newtext": newQRD,
            "id": id
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const changeDescription = (id) => {
        var data = {
            "key": key.key,
            "user": key.username,
            "newtext": newdesc,
            "id": id
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const changeFeatured = (id) => {
        var data = {
            "key": key.key,
            "user": key.username,
            "newtext": id,
            "id": 3
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const changeStream = (attribute, id, newvalue) => {
        var data = {
            "key": key.key,
            "user": key.username,
            "attribute": attribute,
            "id": id,
            "newvalue": newvalue
        }
        socket.emit('send_update_stream', {'attribute': data.attribute, 'id': data.id, 'newvalue': data.newvalue, 'key': data.key})
    }

    const sendNewStream = () => {
        var data = {
            "key": key.key,
            "user": key.username,
            "internalname": newCamera.internalname,
            "groupname": newCamera.groupname,
            "title": newCamera.title,
            "link": newCamera.link,
            "thumblink": newCamera.thumblink,
            "type": newCamera.type,
        }
        socket.emit('send_add_stream', {'internalname': data.internalname, 'title': data.title, 'groupname': data.groupname, 'author': data.user, 'link': data.link, 'thumblink': data.thumblink, 'type': data.type, 'key': data.key})
    }

    const deleteStream = (id) => {
        const data = {
            "key": key.key,
            "user": key.username,
            "id": id
        }
        socket.emit('send_remove_stream', {'id': data.id, 'user': data.user, 'key': data.key})
    }

    const sendNewGroup = () => {
        const data = {
            "key": key.key,
            "user": key.username,
            "internalname": newGroup.internalname,
            "title": newGroup.title
        }
        socket.emit('send_add_group', {'internalname': data.internalname, 'title': data.title, 'key': data.key})
    }

    const deleteGroup = (id) => {
        const data = {
            "key": key.key,
            "user": key.username,
            "id": id
        }
        socket.emit('send_remove_group', {'internalname': data.id, 'key': data.key})
    }

    const changeThreat = (newthreat) => {
        var data = {
            "key": key.key,
            "user": key.username,
            "newtext": newthreat,
            "id": 4
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    //socket.io listeners and state set

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
          setDesc({
            "threat": data[4].text,
            "scrolling": data[0].text,
            "qrd": data[1].text,
            "desc": data[2].text
          })
        })
    
        return () => socket.off('set_desc')
    }, [socket, desc, setDesc])

    useEffect(() => {
        socket.on('update_desc', (data) => {
            console.log(data)
            if (data.title === 4) {
                setDesc({
                    "threat": data.newtext
                })
            }
        })
        return () => socket.off('update_desc')
    }, [socket, desc, setDesc])


    useEffect(() => {
        socket.on('set_stream', (data) => {
          setStreams(data)
        })
    
        return () => socket.off('set_stream')
    }, [socket, streams, setStreams])
    
    useEffect(() => {
        socket.on('update_stream', (data) => {
            streams.map((el, ind) => {
                if (el.id === data.id) {
                    const si =  el
                    const newdata = {
                        "title": si.title,
                        "id": si.id,
                        "internalname": si.internalname,
                        "groupname": si.groupname,
                        "thumblink": si.thumblink,
                        "link": si.link,
                        "type": si.type,
                        "author": si.author,
                        [data.attribute]: data.newvalue
                    }
                    var newarr = streams
                    newarr[ind] = newdata
                    setStreams(newarr)
                }
            })
          })    
          return () => socket.off('update_stream')
    }, [socket, streams, setStreams])

    useEffect(() => {
        socket.on('add_stream', (data) => {
            setStreams((state) => [
                ...state,
                {
                    "title": data.title,
                    "id": data.id,
                    "internalname": data.internalname,
                    "groupname": data.groupname,
                    "thumblink": data.thumblink,
                    "link": data.link,
                    "type": data.type,
                    "author": data.author,
                }
            ]);
          })

          return () => socket.off('add_stream')
    }, [socket, streams, setStreams])

    useEffect(() => {
        socket.on('remove_stream', (data) => {
            var newarr = []
            streams.map((el) => {
                if (el.id !== data.id) {
                    newarr.push(el)
                }
            })
            setStreams(newarr)
          })    
          return () => socket.off('remove_stream')
    }, [socket, streams, setStreams])


    useEffect(() => {
        socket.on('set_groups', (data) => {
          setGroups(data)
        })
    
        return () => socket.off('set_groups')
    }, [socket, groups, setGroups])
    
    useEffect(() => {
        socket.on('add_group', (data) => {
            setGroups((state) => [
                ...state,
                {
                    "internalname": data.internalname, 
                    "title": data.title
                }
            ]);
          })

          return () => socket.off('add_group')
    }, [socket, groups, setGroups])
    
    useEffect(() => {
        socket.on('remove_group', (data) => {
            groups.map((el) => {
                var newarr = []
                if (el.id !== data.id) {
                    newarr.push(el)
                }
                setGroups(newarr)
            })
          })
          return () => socket.off('remove_group')
    }, [socket, groups, setGroups])

    return (
        <div style={{height: '100%', overflowY: 'hidden'}}>
            <div className='sync-notifier' style={{position: 'fixed', background: 'lightgray'}}>
                <div className='control-account control-desc-part'>
                    <input type='text' placeholder='Account name.' onChange={(e) => setKey({"username": e.currentTarget.value, "key": key.key})} />
                    <input type='text' placeholder='API key here.' onChange={(e) => setKey({"username": key.username, "key": e.currentTarget.value})} />
                </div>
            </div>
        <div className="control-app" style={{display: 'grid', gridTemplateColumns: '100% 20%', width:'200%'}}>
            <div style={{display: 'grid', gridTemplateColumns: '50% 50% 50%', width: '100%', margin: 0, height: '100%', outline: 'none'}} className='control-status'>
                <div className="status-indicators-control si-control-panel" style={{gridTemplateColumns: '33% 33% 34%'}}>
                    <div onClick={() => changeStatus("chaseday")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_purple" + (stat?.chaseday ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for it being a chase day, its off" /> <p>Chase Day</p>
                    </div>
                    <div onClick={() => changeStatus("traveling")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_green" + (stat?.traveling ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for traveling, its off" /> <p>Traveling</p>
                    </div>
                    <div onClick={() => changeStatus("forecasting")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_cyan" + (stat?.forecasting ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for forecasting, its off" /> <p>Forecasting</p>
                    </div>
                    <div onClick={() => changeStatus("chasing")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_blue" + (stat?.chasing ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for chasing, its off" /> <p>Chasing</p>
                    </div>
                    <div onClick={() => changeStatus("searchandrescue")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_yellow" + (stat?.searchandrescue ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for search & rescue, its off" /> <p>Search & Rescue</p>
                    </div>
                    <div onClick={() => changeStatus("ending")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_orange" + (stat?.ending ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for ending, its off" /> <p>Ending</p>
                    </div>
                    <div onClick={() => changeStatus("emergency")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_red" + (stat?.emergency ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for emergency, its off" /> <p>Emergency</p>
                    </div>
                    <div onClick={() => changeStatus("onhold")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_red" + (stat?.onhold ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for onhold, its off" /> <p>On Hold</p>
                    </div>
                </div>
                <div className="status-indicators-control si-control-panel" style={{gridTemplateColumns: '33% 33% 34%'}}>
                    <div onClick={() => changeThreat("none")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_white" + (desc?.threat === "none" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for there being no threat, its off" /> <p>No Threat</p>
                    </div>
                    <div onClick={() => changeThreat("tornado")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_white" + (desc?.threat === "tornado" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a tornado, its off" /> <p>Tornado</p>
                    </div>
                    <div onClick={() => changeThreat("derecho")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_white" + (desc?.threat === "derecho" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a derecho, its off" /> <p>Derecho</p>
                    </div>
                    <div onClick={() => changeThreat("bighail")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_white" + (desc?.threat === "bighail" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being big hail, its off" /> <p>Big Hail</p>
                    </div>
                    <div onClick={() => changeThreat("highwind")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_white" + (desc?.threat === "highwind" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being high winds, its off" /> <p>High Wind</p>
                    </div>
                    <div onClick={() => changeThreat("flooding")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_white" + (desc?.threat === "flood" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a flood, its off" /> <p>Flooding</p>
                    </div>
                    <div onClick={() => changeThreat("thunderstorm")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_white" + (desc?.threat === "thunderstorm" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being an intense thunderstorm" /> <p>Thunderstorm</p>
                    </div>
                    <div onClick={() => changeThreat("duststorm")} className="status-light-div control-light-div" title='Click to toggle.'>
                        <img src={`${"/images/lights/light_white" + (desc?.threat === "duststorm" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being an intense duststorm" /> <p>Dust Storm</p>
                    </div>
                </div>
                <div className='map-controls' style={{background: 'lightgray', border: 'outset 3px', outline: '2px black solid', gridRow: 1, gridColumn: 3}}>
                    <h2 style={{color: 'black', fontFamily: 'ms ui gothic', textAlign: 'center'}}>Map Controls</h2>
                    <h3 style={{color: 'black', fontFamily: 'ms ui gothic', textAlign: 'center'}}>Right click to begin making points for a polygon. Double click to place a marker.</h3>
                    <div style={{width: 'calc(100% - 12px)', height: 'calc(100% - 12px)', border: 'inset 3px', padding: '3px', background: 'black'}}>
                        <ControlMap socket={socket} apikey={key.key}/>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default ControlPanel;