import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io.connect('https://arina.lol');

const StreamsWrapper = () => {

    const f = (e) => {
        localStorage.setItem("kaepyi", e.currentTarget.value)
    }

    const ControlStreams = () => {

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
            socket.emit('sync_stream')
            socket.emit('sync_group')
            socket.emit('sync_watchers')
        }, [])

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

        const sendNewWatcher = () => {
            var data = {
                "key": localStorage.getItem("kaepyi"),
                "forHandle": newWatcher,
            }
            axios.post('https://arina.lol/api/shepardess/yt-test3', data).then((res) => {
                console.log(res.data)
            })
        }

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

        return (
            <div className='control-camera' id='control-camera' style={{gridColumn: 'span 2', gridRow: 3}}>
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
                            {groups?.map((el, ind) => {
                                return (
                                    <div key={`streamscroll-${ind}`} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                            {watchers?.map((el, ind) => {
                                return (
                                    <div key={`streamwatcher-${ind}`} style={{display: 'flex', justifyContent: 'space-between'}}>
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
                                            <button className='led-light' title={`Stream is not featured click to set!`} id={`stream-featured-light-${el.internalname}`} onClick={() => changeStream("active", el.id, (el.active === 2 ? 1 : 2))} style={{cursor: 'pointer', outlineOffset: '-1px', background: "#3d3902", boxShadow: "0 0 2px #3d3902", margin: '4px'}}></button>
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
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `${el.id}`, "popup": "bighail"})}>Hail Confirmed</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `${el.id}`, "popup": "derecho"})}>Derecho Occuring</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `${el.id}`, "popup": "highwinds"})}>High Winds Reported</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `${el.id}`, "popup": "tornado"})}>Tornado Spotted</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `${el.id}`, "popup": "funnel"})}>Funnel Cloud Spotted</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `${el.id}`, "popup": "shelfcloud"})}>Shelf Cloud Spotted</button>
                                    <button onClick={() => socket.emit('send_popup', {"key": localStorage.getItem("kaepyi"), "stream": `${el.id}`, "popup": "flooding"})}>Flooding Warning</button>
                                </div>
                                <button className='analog-button' style={{backgroundColor: 'darkred', color: 'white'}} onClick={() => deleteStream(el.id)}>Remove</button>
                            </div>
                        )
                    }) : null}
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
                <a style={{outline: 'outset 2px'}} href='/control' ><img loading='lazy' height={'24px'} src="/images/16icons/control.png" alt="logo" /></a>
                <a style={{outline: 'outset 2px'}} href='/control/map' ><img loading='lazy' height={'24px'} src="/images/16icons/terminalthumbicon.png" alt="logo" /></a>
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
                <ControlStreams/>
            </div>
        </div>
    )
}

export default StreamsWrapper;