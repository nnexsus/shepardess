import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import '../../css/control.css'
import ControlMap from './control-map';
import axios from 'axios';

const socket = io.connect('https://arina.lol');

const Control = () => {

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
        "desc": "",
        "lastUpdate": ""
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
        "title": "Test Group",
        "icon": "/images/16icons/group.png"
    })

    const [watchers, setWatchers] = useState([])
    const [newWatcher, setNewWatcher] = useState("")

    useEffect(() => {
        socket.emit('sync_status')
        socket.emit('sync_description')
        socket.emit('sync_stream')
        socket.emit('sync_group')
        socket.emit('sync_poly')
        socket.emit('sync_watchers')
    }, [])

    //update functions
    const changeStatus = (status) => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
            "newstatus": !stat[`${status}`],
            "title": status
        }
        socket.emit('send_update_status', {'title': `${data.title}`, 'newstatus': data.newstatus, 'key': `${data.key}`})
    }

    const changeDescs = (id) => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
            "newtext": newscroll,
            "id": id
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const changeQRD = (id) => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
            "newtext": newQRD,
            "id": id
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const changeDescription = (id) => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
            "newtext": newdesc,
            "id": id
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const changeFeatured = (id) => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
            "newtext": id,
            "id": 3
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const changeStream = (attribute, id, newvalue) => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
            "attribute": attribute,
            "id": id,
            "newvalue": newvalue
        }
        socket.emit('send_update_stream', {'attribute': data.attribute, 'id': data.id, 'newvalue': data.newvalue, 'key': data.key})
    }

    const sendNewStream = () => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
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
            "key": localStorage.getItem("kaepyi"),
            "id": id
        }
        socket.emit('send_remove_stream', {'id': data.id, 'user': data.user, 'key': data.key})
    }

    const sendNewGroup = () => {
        const data = {
            "key": localStorage.getItem("kaepyi"),
            "internalname": newGroup.internalname,
            "title": newGroup.title,
            "icon": newGroup.icon
        }
        socket.emit('send_add_group', {'internalname': `${Date.now()}`, 'title': data.title, 'icon': data.icon, 'key': data.key})
    }

    const deleteGroup = (id) => {
        const data = {
            "key": localStorage.getItem("kaepyi"),
            "id": id
        }
        socket.emit('send_remove_group', {'internalname': data.id, 'key': data.key})
    }

    const changeThreat = (newthreat) => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
            "newtext": newthreat,
            "id": 4
        }
        socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
    }

    const sendNewWatcher = () => {
        var data = {
            "key": localStorage.getItem("kaepyi"),
            "forHandle": newWatcher,
        }
        axios.post('https://arina.lol/api/shepardess/yt-test3', data).then((res) => {
            console.log(res.data)
        })
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
            var date = new Date(parseInt(data[5].text))
            var datetext = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            console.log(date, " -- ", datetext)
          setDesc({
            "threat": data[4].text,
            "scrolling": data[0].text,
            "qrd": data[1].text,
            "desc": data[2].text,
            "lastUpdate": datetext
          })
        })
    
        return () => socket.off('set_desc')
    }, [socket, desc, setDesc])

    useEffect(() => {
        socket.on('update_desc', (data) => {
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
                    var newarr = [...streams]
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

    useEffect(() => {
        socket.on('set_watchers', (data) => {
            setWatchers(data)
        })
    }, [socket, watchers, setWatchers])

    const f = (e) => {
        localStorage.setItem("kaepyi", e.currentTarget.value)
    }

    //map based events

    return (
        <div className="control-app">
            <div className='logo-container' style={{alignItems: 'center', justifyContent: 'center', background: 'black', margin: '25px', gridColumn: 1, gridRow: 1}}>
                <a href='/home' ><img loading='lazy' height={'50px'} src="/images/bgs/skull-logo.png" alt="logo" /></a>
            </div>

            <div className='control-account control-desc-part' style={{gridColumn: 3, gridRow: 1}}>
                <input type='password' placeholder='API key here.' value={localStorage.getItem('kaepiy')} onChange={(e) => f(e)} />
            </div>

            <div style={{gridColumn: 'span 3', gridRow: 2}} className='control-status'>
                <div className='buttons-flex'>
                    <div className="status-indicators-control">
                        <div onClick={() => changeStatus("chaseday")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_purple" + (stat?.chaseday ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for it being a chase day" /> <p>Chase Day</p>
                        </div>
                        <div onClick={() => changeStatus("traveling")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_green" + (stat?.traveling ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for traveling" /> <p>Travel</p>
                        </div>
                        <div onClick={() => changeStatus("forecasting")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_cyan" + (stat?.forecasting ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for forecasting" /> <p>Forecast</p>
                        </div>
                        <div onClick={() => changeStatus("chasing")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_blue" + (stat?.chasing ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for chasing" /> <p>Chase</p>
                        </div>
                        <div onClick={() => changeStatus("searchandrescue")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_yellow" + (stat?.searchandrescue ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for search & rescue" /> <p>S & R</p>
                        </div>
                        <div onClick={() => changeStatus("ending")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_orange" + (stat?.ending ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for ending" /> <p>End</p>
                        </div>
                        <div onClick={() => changeStatus("emergency")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_red" + (stat?.emergency ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for emergency" /> <p>Emergency</p>
                        </div>
                        <div onClick={() => changeStatus("onhold")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_red" + (stat?.onhold ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for being on hold" /> <p>On Hold</p>
                        </div>
                    </div>
                    <div className="status-indicators-control">
                        <div onClick={() => changeThreat("none")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "none" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for there being no threat" /> <p>No Threat</p>
                        </div>
                        <div onClick={() => changeThreat("tornado")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "tornado" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a tornado" /> <p>Tornado</p>
                        </div>
                        <div onClick={() => changeThreat("derecho")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "derecho" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a derecho" /> <p>Derecho</p>
                        </div>
                        <div onClick={() => changeThreat("bighail")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "bighail" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being big hail" /> <p>Big Hail</p>
                        </div>
                        <div onClick={() => changeThreat("highwind")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "highwind" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being high winds" /> <p>High Wind</p>
                        </div>
                        <div onClick={() => changeThreat("flooding")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "flooding" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a flood" /> <p>Flooding</p>
                        </div>
                        <div onClick={() => changeThreat("thunderstorm")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "thunderstorm" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being an intense thunderstorm" /> <p>Thunderstorm</p>
                        </div>
                        <div onClick={() => changeThreat("duststorm")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "duststorm" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being an intense duststorm" /> <p>Dust Storm</p>
                        </div>
                    </div>
                    <div>
                        <button className='analog-button' style={{width: '100%'}} onClick={() => axios.get('https://arina.lol/api/shepardess/yt-test2')}>UPDATE LIVESTREAMS</button>
                        <p>LAST UPDATE: {desc.lastUpdate} CST</p>
                    </div>
                    <div className='popup-desc'>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency001"})}>E001: Technical Issues</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency002"})}>E002: Car Function Issues</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency003"})}>E003: Car Damage Issues</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency004"})}>E004: Stranded</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency005"})}>E005: Injury</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency006"})}>E006: Situation Comprimise</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency007"})}>E007: DESPERATION CALL</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency008"})}>E008: S&R Assist!</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency009"})}>E009: PDS!</button>
                        <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "popup": "emergency010"})}>E010: Unwarned tor!</button>
                    </div>
                </div>
                <div className='control-desc'>
                    <div className='control-desc-part'>
                        <textarea type='text' placeholder='Scrolling Text, seperate colors with commas.' defaultValue={desc.scrolling} onChange={(e) => setNewscroll(e.currentTarget.value)} />
                        <button title='Update' onClick={() => changeDescs(0)} style={{backgroundImage: 'url(/images/16icons/upload.png)', height: '100%', backgroundColor: 'white'}} className='analog-button square-button'></button>
                    </div>
                    <div className='control-desc-part'>
                        <textarea type='text' style={{height: '80px'}} placeholder='QRD - Quick run down/title for desc' defaultValue={desc.qrd} onChange={(e) => setNewQRD(e.currentTarget.value)} />
                        <button title='Update' onClick={() => changeQRD(1)} style={{backgroundImage: 'url(/images/16icons/upload.png)', height: '100%', backgroundColor: 'white'}} className='analog-button square-button'></button>
                    </div>
                    <div className='control-desc-part'>
                        <textarea type='text' style={{height: '200px'}} placeholder='Full description text' defaultValue={desc.desc} onChange={(e) => setNewdesc(e.currentTarget.value)} />
                        <button title='Update' onClick={() => changeDescription(2)} style={{backgroundImage: 'url(/images/16icons/upload.png)', height: '100%', backgroundColor: 'white'}} className='analog-button square-button'></button>

                    </div>
                </div>
            </div>

            <div className='control-camera control-collapsed' id='control-camera' style={{gridColumn: 'span 3', gridRow: 3}}>
                <div className='stream-container'>
                <div className='cc-control-stream-box' style={{height: 'min-content', gridColumn: 'span 3'}}>
                        <h3 className='invert-text' style={{margin: 0}}>Add Stream:</h3>
                        <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input className='analog-input' style={{width: '100%'}} type='text' placeholder='stream title name' onChange={(e) => setNewCamera({
                            "internalname": `${newCamera.internalname}`,
                            "groupname": newCamera.groupname,
                            "title": `${e.currentTarget.value}`,
                            "link": `${newCamera.link}`,
                            "thumblink": `${newCamera.thumblink}`,
                            "type": `${newCamera.type}`
                        })}/>
                        </div>
                        <div style={{gridRow: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input className='analog-input' style={{width: '100%'}} type='text' placeholder='stream link' onChange={(e) => setNewCamera({
                            "internalname": `${newCamera.internalname}`,
                            "groupname": newCamera.groupname,
                            "title": `${newCamera.title}`,
                            "link": `${e.currentTarget.value}`,
                            "thumblink": `${newCamera.thumblink}`,
                            "type": `${newCamera.type}`
                        })}/>
                        </div>
                        <div style={{gridRow: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input className='analog-input' style={{width: '100%'}} type='text' placeholder='thumbnail link' onChange={(e) => setNewCamera({
                            "internalname": `${newCamera.internalname}`,
                            "groupname": newCamera.groupname,
                            "title": `${newCamera.title}`,
                            "link": `${newCamera.link}`,
                            "thumblink": `${e.currentTarget.value}`,
                            "type": `${newCamera.type}`
                        })}/>
                        </div>
                        <div style={{gridRow: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input className='analog-input' style={{width: '100%'}} type='text' placeholder='stream author or watcher youtube handle' onChange={(e) => setNewCamera({
                            "internalname": `${e.currentTarget.value}`,
                            "groupname": newCamera.groupname,
                            "title": newCamera.title,
                            "link": newCamera.link,
                            "thumblink": newCamera.thumblink,
                            "type": newCamera.type
                        })}/>
                        </div>
                        <div style={{gridRow: 5, display: 'grid', gridTemplateColumns: '60% 40%', alignItems: 'center', justifyContent: 'space-between'}}>
                            <p style={{margin: 0, gridColumn: 'span 2'}}><i>If you are making an automatically updating stream, please create the watcher FIRST before the stream.</i></p>
                            <div>
                                <p>Add to group:</p>
                                <div style={{border: 'solid white 2px', padding: '3px', margin: '3px'}}>
                                    <select style={{width: '100%'}} className='analog-input' defaultValue={"null"} name='Groups' onChange={(e) => setNewCamera({
                                        "internalname": `${newCamera.internalname}`,
                                        "groupname": e.currentTarget.value,
                                        "title": `${newCamera.title}`,
                                        "link": `${newCamera.link}`,
                                        "thumblink": `${newCamera.thumblink}`,
                                        "type": `${newCamera.type}`
                                    })}>
                                        <option value={"null"}>None</option>
                                        {groups.map((el) => {
                                            return (
                                                <option key={el.internalname} value={el.internalname}>{el.title}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className='analog-input' style={{border: 'solid white 2px', padding: '3px', margin: '3px'}}>
                                <input className='analog-input' title='Stream Type' style={{width: '22px'}} min={0} max={4} type='number' placeholder='0' onChange={(e) => setNewCamera({
                                    "internalname": `${newCamera.internalname}`,
                                    "groupname": newCamera.groupname,
                                    "title": `${newCamera.title}`,
                                    "link": `${newCamera.link}`,
                                    "thumblink": `${newCamera.thumblink}`,
                                    "type": `${e.currentTarget.value}`
                                })}/>
                                <p>
                                0 = <img loading='lazy' style={{background: 'lime'}} alt='static camera' title='Static Camera' src='/images/16icons/camera.png' width={'16px'} height={'16px'}/><br/>
                                1 = <img loading='lazy' style={{background: 'lime'}} alt='car/moving camera' title='Car/Moving Camera' src='/images/16icons/carstream.png' width={'16px'} height={'16px'}/><br/>
                                2 = <img loading='lazy' style={{background: 'lime'}} alt='screenshare' title='Screenshare' src='/images/16icons/audiostream.png' width={'16px'} height={'16px'}/><br/>
                                3 = <img loading='lazy' style={{background: 'lime'}} alt='other' title='Other' src='/images/16icons/other.png' width={'16px'} height={'16px'}/>
                                4 = <img loading='lazy' style={{background: 'lime'}} alt='video (not live)' title='Video (not live)' src='/images/16icons/videoicon.png' width={'16px'} height={'16px'}/>
                                </p>
                            </div>
                        </div>
                        <button className='analog-button' onClick={() => sendNewStream()}>Submit</button>
                    </div>
                    <div className='cc-control-stream-box' style={{height: 'min-content', gridColumn: 'span 3'}}>
                        <h3 className='invert-text' style={{margin: 0}}>Add Group:</h3>
                        <div style={{gridRow: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input className='analog-input' style={{width: '100%'}} type='text' placeholder='group title' onChange={(e) => setNewGroup({
                            "internalname": newGroup.internalname,
                            "title": `${e.currentTarget.value}`,
                            "icon": newGroup.icon
                        })}/>
                        <div style={{gridRow: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input className='analog-input' style={{width: '100%'}} type='text' placeholder='icon link 16x16' onChange={(e) => setNewGroup({
                            "internalname": newGroup.internalname,
                            "title": newGroup.title,
                            "icon": `${e.currentTarget.value}`
                        })}/>
                        </div>
                        </div>
                        <button className='analog-button' onClick={() => sendNewGroup()}>Submit</button>
                        <div style={{border: 'inset 3px', maxHeight: '210px', overflowY: 'scroll'}}>
                            {groups?.map((el) => {
                                return (
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <img loading='lazy' height={'32px'} width={'32px'} style={{border: 'solid  2px'}} src={el.icon} />
                                        <p style={{overflow: 'hidden', textOverflow: 'ellipsis', marginLeft: '5px', marginRight: '5px'}}>{el.title}</p>
                                        <button style={{color: 'white', background: 'darkred'}} className='analog-button'>Remove</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='cc-control-stream-box' style={{height: 'min-content', gridColumn: 'span 3'}}>
                        <h3 className='invert-text' style={{margin: 0}}>Add Watcher:</h3>
                        <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input className='analog-input' style={{width: '100%'}} type='text' placeholder='channel @ handle (do not include @)' onChange={(e) => setNewWatcher(e.currentTarget.value)}/>
                        </div>
                        <button className='analog-button' onClick={() => sendNewWatcher()}>Submit</button>
                        <div style={{border: 'inset 3px', maxHeight: '210px', overflowY: 'scroll'}}>
                            {watchers?.map((el) => {
                                return (
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <img loading='lazy' height={'40px'} width={'40px'} style={{borderRadius: '50%', border: 'solid lime 2px'}} src={el.pfp} />
                                        <p style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>@{el.handle}</p>
                                        <button style={{color: 'white', background: 'darkred'}} className='analog-button'>Remove</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {streams.length > 0 ? streams.map((el, ind) => {
                        return (
                            <div key={el.id} className='cc-control-stream-box'>
                                <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                    <p style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%'}} className='invert-text'>{el.title}</p>
                                    <p className='analog-input'>STR-{ind}</p>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 2px'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-right', background: 'black', color: 'lime', border: 'inset 3px'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <p style={{paddingLeft: '3px', fontSize: '12px'}}>ACTIVE:</p>
                                            <button className='led-light' title={`Stream is ${el.active === 0 ? "inactive" : "active"}, click to toggle!)`} id={`stream-active-light-${el.id}`} onClick={() => changeStream("active", el.id, !el.active)} style={{cursor: 'pointer', outlineOffset: '-1px', background: `${el.active === 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active === 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`, margin: '4px'}}></button>
                                        </div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <p style={{paddingLeft: '3px', fontSize: '12px'}}>FEATURED:</p>
                                            <button className='led-light' title={`Stream is not featured click to set!`} id={`stream-featured-light-${el.internalname}`} onClick={() => changeFeatured(el.internalname)} style={{cursor: 'pointer', outlineOffset: '-1px', background: "#3d3902", boxShadow: "0 0 2px #3d3902", margin: '4px'}}></button>
                                        </div>
                                    </div>
                                    <select className='analog-input' defaultValue={el.type} onChange={(e) => changeStream('type', el.id, e.currentTarget.value)} name="Stream Type">
                                        <option value="0">Static Camera</option>
                                        <option value="1">Car Camera</option>
                                        <option value="2">Screenshare</option>
                                        <option value="3">Other</option>
                                    </select>
                                </div>
                                <div style={{gridRow: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'solid gray 2px'}}>
                                    <img style={{width: '16px', height: '16px'}} alt='decor' src='/images/16icons/terminalicon.png'/>
                                    <input style={{width: '100%'}} className='analog-input' type='text' placeholder='stream title name' id={`store-new-title-${el.id}`} defaultValue={el.title}/><button title='Update' style={{backgroundImage: 'url(/images/16icons/upload.png)', backgroundColor: 'white'}} className='analog-button square-button' onClick={() => changeStream('title', el.id, document.getElementById(`store-new-title-${el.id}`).value)}></button>
                                </div>
                                <div style={{gridRow: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'solid gray 2px'}}>
                                    <img style={{width: '16px', height: '16px'}} alt='decor' src='/images/16icons/terminallinkicon.png'/>
                                    <input style={{width: '100%'}} className='analog-input' type='text' placeholder='stream link' id={`store-new-link-${el.id}`} defaultValue={el.link}/><button title='Update' style={{backgroundImage: 'url(/images/16icons/upload.png)', backgroundColor: 'white'}} className='analog-button square-button' onClick={() => changeStream('link', el.id, document.getElementById(`store-new-link-${el.id}`).value)}></button>
                                </div>
                                <div style={{gridRow: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <img style={{width: '16px', height: '16px'}} alt='decor' src='/images/16icons/terminalthumbicon.png'/>
                                    <input style={{width: '100%'}} className='analog-input' type='text' placeholder='thumbnail link' id={`store-new-thumblink-${el.id}`} defaultValue={el.thumblink}/><button title='Update' style={{backgroundImage: 'url(/images/16icons/upload.png)', backgroundColor: 'white'}} className='analog-button square-button' onClick={() => changeStream('thumblink', el.id, document.getElementById(`store-new-thumblink-${el.id}`).value)}></button>
                                </div>
                                <img loading='lazy' style={{border: 'inset 3px'}} src={`${el.thumblink}`} height={'100px'} alt='thumbnail' />
                                <div style={{gridRow: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'solid gray 2px'}}>
                                    <p>Group:</p>
                                    <select className='analog-input' defaultValue={el.groupname} onChange={(e) => changeStream('groupname', el.id, e.currentTarget.value)} name='Groups'>
                                        <option value={"NULL"}>None</option>
                                        {groups.map((el) => {
                                            return (
                                                <option key={el.internalname} value={el.internalname}>{el.title}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className='popup-desc'>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `$`, "popup": "bighail"})}>Hail Confirmed</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `$`, "popup": "derecho"})}>Derecho Occuring</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `$`, "popup": "highwinds"})}>High Winds Reported</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `$`, "popup": "tornado"})}>Tornado Spotted</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `$`, "popup": "funnel"})}>Funnel Cloud Spotted</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `$`, "popup": "shelfcloud"})}>Shelf Cloud Spotted</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `$`, "popup": "flooding"})}>Flooding Warning</button>
                                </div>
                                <button className='analog-button' style={{backgroundColor: 'darkred', color: 'white'}} onClick={() => deleteStream(el.id)}>Remove</button>
                            </div>
                        )
                    }) : null}
                </div>
                <button className='analog-button' onClick={() => document.getElementById('control-camera').classList.toggle('control-collapsed')}>Toggle Collapse</button>
            </div>

            <div className='map-controls' style={{background: 'lightgray', border: 'outset 3px', outline: '2px black solid'}}>
                <h2 style={{color: 'black', textAlign: 'center'}}>Map Controls</h2>
                <h3 style={{color: 'black', textAlign: 'center'}}>Right click to begin making points for a polygon. Double click to place a marker.</h3>
                <div style={{width: 'calc(100% - 12px)', height: 'calc(100% - 12px)', border: 'inset 3px', padding: '3px', background: 'black'}}>
                    <ControlMap socket={socket} apikey={localStorage.getItem("kaepyi")}/>
                </div>
            </div>
        </div>
    )
}

export default Control;