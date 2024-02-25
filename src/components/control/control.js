import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import '../../css/control.css'
import ControlMap from './control-map';

const socket = io.connect('https://arina.lol');

const Control = () => {

    const [key, setKey] = useState({
        "username": "",
        "key": "key"
    })

    const [scrolling, setScrolling] = useState("WELCOME TO THE CONTROL PANEL!")

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
        "title": "Test Group",
        "icon": "/images/16icons/group.png"
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
            "title": newGroup.title,
            "icon": newGroup.icon
        }
        socket.emit('send_add_group', {'internalname': data.internalname, 'title': data.title, 'icon': data.icon, 'key': data.key})
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
            document.getElementById('stream-sync-light').style.background = 'lime'
            document.getElementById('stream-sync-light').style.boxShadow = '0 0 5px lime'
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

    //map based events

    return (
        <div className="control-app">
            <div className='logo-container' style={{alignItems: 'center', justifyContent: 'center', background: 'black', margin: '25px', gridColumn: 1, gridRow: 1}}>
                <a href='/home' ><img height={'50px'} src="/images/bgs/skull-logo.png" alt="logo" /></a>
            </div>

            <div style={{gridColumn: 2, gridRow: 1, alignItems: 'center', justifyContent: 'center'}} className="top-header-cc">
                <div style={{width: '98%'}} className="scrolling-text-div">
                    <div className='scroller'>
                        <p className='scrolling-text' style={{fontFamily: 'dotty'}}>{scrolling}</p>
                    </div>
                </div>
            </div>

            <div style={{gridColumn: 'span 3', gridRow: 2, display: 'grid', gridTemplateRows: '80% 20%'}} className='control-status'>
                <div className='buttons-flex'>
                    <div className="status-indicators-control">
                        <div onClick={() => changeStatus("chaseday")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_purple" + (stat?.chaseday ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for it being a chase day" /> <p>Chase Day</p>
                        </div>
                        <div onClick={() => changeStatus("traveling")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_green" + (stat?.traveling ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for traveling" /> <p>Traveling</p>
                        </div>
                        <div onClick={() => changeStatus("forecasting")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_cyan" + (stat?.forecasting ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for forecasting" /> <p>Forecasting</p>
                        </div>
                        <div onClick={() => changeStatus("chasing")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_blue" + (stat?.chasing ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for chasing" /> <p>Chasing</p>
                        </div>
                        <div onClick={() => changeStatus("searchandrescue")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_yellow" + (stat?.searchandrescue ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for search & rescue" /> <p>Search & Rescue</p>
                        </div>
                        <div onClick={() => changeStatus("ending")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_orange" + (stat?.ending ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for ending" /> <p>Ending</p>
                        </div>
                        <div onClick={() => changeStatus("emergency")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_red" + (stat?.emergency ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for emergency" /> <p>Emergency</p>
                        </div>
                        <div onClick={() => changeStatus("onhold")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_red" + (stat?.onhold ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for being on hold" /> <p>On Hold</p>
                        </div>
                    </div>
                    <div className="status-indicators-control">
                        <div onClick={() => changeThreat("none")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_white" + (desc?.threat === "none" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for there being no threat" /> <p>No Threat</p>
                        </div>
                        <div onClick={() => changeThreat("tornado")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_white" + (desc?.threat === "tornado" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a tornado" /> <p>Tornado</p>
                        </div>
                        <div onClick={() => changeThreat("derecho")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_white" + (desc?.threat === "derecho" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a derecho" /> <p>Derecho</p>
                        </div>
                        <div onClick={() => changeThreat("bighail")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_white" + (desc?.threat === "bighail" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being big hail" /> <p>Big Hail</p>
                        </div>
                        <div onClick={() => changeThreat("highwind")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_white" + (desc?.threat === "highwind" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being high winds" /> <p>High Wind</p>
                        </div>
                        <div onClick={() => changeThreat("flooding")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_white" + (desc?.threat === "flood" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being a flood" /> <p>Flooding</p>
                        </div>
                        <div onClick={() => changeThreat("thunderstorm")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_white" + (desc?.threat === "thunderstorm" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being an intense thunderstorm" /> <p>Thunderstorm</p>
                        </div>
                        <div onClick={() => changeThreat("duststorm")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img src={`${"/images/lights/light_white" + (desc?.threat === "duststorm" ? "" : "_off") + ".webp"}`} width="50px" height="50px" alt="status light for the threat being an intense duststorm" /> <p>Dust Storm</p>
                        </div>
                    </div>
                    <div className='popup-desc'>
                        <button onClick={() => socket.emit('send_popup', {"key": key.key, "popup": "bighail"})}>Hail Confirmed</button>
                        <button onClick={() => socket.emit('send_popup', {"key": key.key, "popup": "derecho"})}>Derecho Occuring</button>
                        <button onClick={() => socket.emit('send_popup', {"key": key.key, "popup": "highwinds"})}>High Winds Reported</button>
                        <button onClick={() => socket.emit('send_popup', {"key": key.key, "popup": "tornado"})}>Tornado Spotted</button>
                        <button onClick={() => socket.emit('send_popup', {"key": key.key, "popup": "funnel"})}>Funnel Cloud Spotted</button>
                        <button onClick={() => socket.emit('send_popup', {"key": key.key, "popup": "shelfcloud"})}>Shelf Cloud Spotted</button>
                        <button onClick={() => socket.emit('send_popup', {"key": key.key, "popup": "flooding"})}>Flooding Warning</button>
                        <button onClick={() => socket.emit('send_popup', {"key": key.key, "popup": "emergency"})}>Emergency Alert</button>
                    </div>
                </div>

                <div className='control-desc' style={{gridRow: 2}}>
                    <div className='control-desc-part'>
                        <textarea type='text' placeholder='Scrolling Text, seperate colors with commas.' defaultValue={desc.scrolling} onChange={(e) => setNewscroll(e.currentTarget.value)} />
                        <button onClick={() => changeDescs(0)}>Update</button>
                    </div>
                    <div className='control-desc-part'>
                        <textarea type='text' placeholder='QRD - Quick run down/title for desc' defaultValue={desc.qrd} onChange={(e) => setNewQRD(e.currentTarget.value)} />
                        <button onClick={() => changeQRD(1)}>Update</button>
                    </div>
                    <div className='control-desc-part'>
                        <textarea type='text' placeholder='Full description text' defaultValue={desc.desc} onChange={(e) => setNewdesc(e.currentTarget.value)} />
                        <button onClick={() => changeDescription(2)}>Update</button>
                    </div>
                </div>
            </div>

            <div className='control-camera' style={{gridColumn: 'span 3', gridRow: 3}}>
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
                            <div>
                                <p>Add to group:</p>
                                <div style={{border: 'solid white 2px', padding: '3px', margin: '3px'}}>
                                    <select className='analog-input' defaultValue={"null"} name='Groups' onChange={(e) => setNewCamera({
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
                                <input className='analog-input' title='Stream Type' style={{width: '22px'}} min={0} max={3} type='number' placeholder='0' onChange={(e) => setNewCamera({
                                    "internalname": `${newCamera.internalname}`,
                                    "groupname": newCamera.groupname,
                                    "title": `${newCamera.title}`,
                                    "link": `${newCamera.link}`,
                                    "thumblink": `${newCamera.thumblink}`,
                                    "type": `${e.currentTarget.value}`
                                })}/>
                                <p>
                                0 = <img style={{background: 'lime'}} alt='static camera' title='Static Camera' src='/images/16icons/camera.png' width={'16px'} height={'16px'}/><br/>
                                1 = <img style={{background: 'lime'}} alt='car/moving camera' title='Car/Moving Camera' src='/images/16icons/carstream.png' width={'16px'} height={'16px'}/><br/>
                                2 = <img style={{background: 'lime'}} alt='screenshare' title='Screenshare' src='/images/16icons/audiostream.png' width={'16px'} height={'16px'}/><br/>
                                3 = <img style={{background: 'lime'}} alt='other' title='Other' src='/images/16icons/other.png' width={'16px'} height={'16px'}/>
                                </p>
                            </div>
                        </div>
                        <button className='analog-button' onClick={() => sendNewStream()}>Submit</button>
                    </div>
                    <div className='cc-control-stream-box' style={{height: 'min-content', gridColumn: 'span 3'}}>
                        <h3 className='invert-text' style={{margin: 0}}>Add Group:</h3>
                        <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input className='analog-input' style={{width: '100%'}} type='text' placeholder='group internal name' onChange={(e) => setNewGroup({
                            "internalname": `${e.currentTarget.value}`,
                            "title": newGroup.groupname,
                            "icon": newGroup.icon
                        })}/>
                        </div>
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
                    </div>
                    {streams.length > 0 ? streams.map((el, ind) => {
                        return (
                            <div key={el.id} className='cc-control-stream-box'>
                                <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                    <p style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} className='invert-text'>{el.title}</p>
                                    <p className='analog-input'>Stream #{ind}</p>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid gray 2px'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-right', background: 'black', color: 'lime', border: 'inset 3px'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <p style={{paddingLeft: '3px', fontSize: '12px'}}>ACTIVE:</p>
                                            <button className='led-light' title={`Stream is ${el.active === 0 ? "inactive" : "active"}, click to toggle! (visual effect only)`} id={`stream-active-light-${el.id}`} onClick={() => changeStream("active", el.id, !el.active)} style={{cursor: 'pointer', outlineOffset: '-1px', background: `${el.active === 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active === 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`, margin: '4px'}}></button>
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
                                    <p>Title:</p>
                                    <input className='analog-input' type='text' placeholder='stream title name' id={`store-new-title-${el.id}`} defaultValue={el.title}/><button title='Update' style={{backgroundImage: 'url(/images/16icons/upload.png)', backgroundColor: 'white'}} className='analog-button square-button' onClick={() => changeStream('title', el.id, document.getElementById(`store-new-title-${el.id}`).value)}></button>
                                </div>
                                <div style={{gridRow: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'solid gray 2px'}}>
                                    <p>Link:</p>
                                    <input className='analog-input' type='text' placeholder='stream link' id={`store-new-link-${el.id}`} defaultValue={el.link}/><button title='Update' style={{backgroundImage: 'url(/images/16icons/upload.png)', backgroundColor: 'white'}} className='analog-button square-button' onClick={() => changeStream('link', el.id, document.getElementById(`store-new-link-${el.id}`).value)}></button>
                                </div>
                                <div style={{gridRow: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <p>Thumb:</p>
                                    <input className='analog-input' type='text' placeholder='thumbnail link' id={`store-new-thumblink-${el.id}`} defaultValue={el.thumblink}/><button title='Update' style={{backgroundImage: 'url(/images/16icons/upload.png)', backgroundColor: 'white'}} className='analog-button square-button' onClick={() => changeStream('thumblink', el.id, document.getElementById(`store-new-thumblink-${el.id}`).value)}></button>
                                </div>
                                <img style={{border: 'inset 3px'}} src={`${el.thumblink}`} height={'100px'} alt='thumbnail' />
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
                                <button className='analog-button' style={{backgroundColor: 'darkred'}} onClick={() => deleteStream(el.id)}>Remove</button>
                            </div>
                        )
                    }) : null}
                </div>
                <div className='sync-notifier'>
                    <h3>Synced to server: </h3>
                    <div id='stream-sync-light' className='led-light' style={{background: 'darkgreen', boxShadow: '0 0 2px darkgreen'}}></div>
                </div>
            </div>

            <div className='control-account control-desc-part' style={{gridColumn: 3, gridRow: 1}}>
                <input type='text' placeholder='Account name.' onChange={(e) => setKey({"username": e.currentTarget.value, "key": key.key})} />
                <input type='password' placeholder='API key here.' onChange={(e) => setKey({"username": key.username, "key": e.currentTarget.value})} />
            </div>

            <div className='map-controls' style={{background: 'lightgray', border: 'outset 3px', outline: '2px black solid'}}>
                <h2 style={{color: 'black', fontFamily: 'ms ui gothic', textAlign: 'center'}}>Map Controls</h2>
                <h3 style={{color: 'black', fontFamily: 'ms ui gothic', textAlign: 'center'}}>Right click to begin making points for a polygon. Double click to place a marker.</h3>
                <div style={{width: 'calc(100% - 12px)', height: 'calc(100% - 12px)', border: 'inset 3px', padding: '3px', background: 'black'}}>
                    <ControlMap socket={socket} apikey={key.key}/>
                </div>
            </div>
        </div>
    )
}

export default Control;