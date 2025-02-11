import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import '../../css/control.css'

import ControlChat from './control-chat';
import axios from 'axios';

const socket = io.connect('https://arina.lol');

const Control = () => {

    const f = (e) => {
        localStorage.setItem("kaepyi", e.currentTarget.value)
    }

    const MainControl = () => {

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
            "lastUpdate": "",
            "outlook": "none",
            "area": "midwest"
        })
    
        const [newscroll, setNewscroll] = useState("Scrolling text.")
        const [newQRD, setNewQRD] = useState("QRD Title.")
        const [newdesc, setNewdesc] = useState("Description.")
    
        useEffect(() => {
            socket.emit('sync_status')
            socket.emit('sync_description')
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
    
        const changeThreat = (newthreat) => {
            var data = {
                "key": localStorage.getItem("kaepyi"),
                "newtext": newthreat,
                "id": 4
            }
            socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
        }
    
        const changeOutlook = (newoutlook) => {
            var data = {
                "key": localStorage.getItem("kaepyi"),
                "newtext": newoutlook,
                "id": 6
            }
            socket.emit('send_update_desc', {'id': data.id, 'newtext': data.newtext, 'key': data.key})
        }
    
        const changeSector = (newsector) => {
            var data = {
                "key": localStorage.getItem("kaepyi"),
                "newtext": newsector,
                "id": 7
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
              setDesc({
                  "scrolling": data[0].text,
                  "qrd": data[1].text,
                  "desc": data[2].text,
                "threat": data[4].text,
                "lastUpdate": datetext,
                "outlook": data[6].text,
                "area": data[7].text
              })
            })
        
            return () => socket.off('set_desc')
        }, [socket, desc, setDesc])
    
        useEffect(() => {
            socket.on('update_desc', (data) => {
                const vals = ["scrolling", "qrd", "desc", "", "threat", "lastUpdate", "outlook", "area"]
                var newarr = {
                    "scrolling": desc.scrolling,
                    "qrd": desc.qrd,
                    "desc": desc.desc,
                    "threat": desc.threat,
                    "lastUpdate": desc.lastUpdate,
                    "outlook": desc.outlook,
                    "area": desc.area,
                    [`${vals[data.title]}`]: data.newtext
                }
                setDesc(newarr)
            })
            return () => socket.off('update_desc')
        }, [socket, desc, setDesc])

        return (
            <>
                <div className='buttons-flex'>
                    <div className="status-indicators-control">
                        <p style={{color: 'white', gridColumn: 'span 3', padding: 0, margin: 0, textAlign: 'center'}}>Personal Status</p>
                        <div onClick={() => changeStatus("chaseday")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_purple" + (stat?.chaseday ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for it being a chase day" /> <p>Chase Day</p>
                        </div>
                        <div onClick={() => changeStatus("traveling")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_green" + (stat?.traveling ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for traveling" /> <p>Travel</p>
                        </div>
                        <div onClick={() => changeStatus("chasing")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_blue" + (stat?.chasing ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for chasing" /> <p>Chase</p>
                        </div>
                        <div onClick={() => changeStatus("ending")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_orange" + (stat?.ending ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for ending" /> <p>End</p>
                        </div>
                        <div onClick={() => changeStatus("onhold")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_yellow" + (stat?.onhold ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for being on hold" /> <p>On Hold</p>
                        </div>
                        <div onClick={() => changeStatus("emergency")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_red" + (stat?.emergency ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for emergency" /> <p>Emergency</p>
                        </div>
                    </div>
                    <div className="status-indicators-control">
                        <p style={{color: 'white', gridColumn: 'span 3', padding: 0, margin: 0, textAlign: 'center'}}>Main Threat Type</p>
                        <div onClick={() => changeThreat("none")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "none" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for there being no threat" /> <p>No Threat</p>
                        </div>
                        <div onClick={() => changeThreat("tornado")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "tornado" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for the threat being a tornado" /> <p>Tornado</p>
                        </div>
                        <div onClick={() => changeThreat("derecho")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "derecho" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for the threat being a derecho" /> <p>Derecho</p>
                        </div>
                        <div onClick={() => changeThreat("bighail")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "bighail" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for the threat being big hail" /> <p>Big Hail</p>
                        </div>
                        <div onClick={() => changeThreat("highwind")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "highwind" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for the threat being high winds" /> <p>High Wind</p>
                        </div>
                        <div onClick={() => changeThreat("flooding")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "flooding" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for the threat being a flood" /> <p>Flooding</p>
                        </div>
                        <div onClick={() => changeThreat("thunderstormthreat")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "thunderstormthreat" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for the threat being an intense thunderstorm" /> <p>Thunderstorm</p>
                        </div>
                        <div onClick={() => changeThreat("duststorm")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.threat === "duststorm" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="status light for the threat being an intense duststorm" /> <p>Dust Storm</p>
                        </div>
                    </div>
                    <div className="status-indicators-control">
                        <p style={{color: 'white', gridColumn: 'span 3', padding: 0, margin: 0, textAlign: 'center'}}>SPC Outlook</p>
                        <div onClick={() => changeOutlook("none")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.outlook === "none" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="No Threat" /> <p>No Threat</p>
                        </div>
                        <div onClick={() => changeOutlook("thunderstorm")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.outlook === "thunderstorm" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Thunderstorm" /> <p>Thunderstorm</p>
                        </div>
                        <div onClick={() => changeOutlook("marginal")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.outlook === "marginal" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Marginal" title='2% tornado / 5% wind / 5% hail' /> <p>Marginal</p>
                        </div>
                        <div onClick={() => changeOutlook("slight")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.outlook === "slight" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Slight" title='5% tornado / 15-#15% wind / 15-#15% hail' /> <p>Slight</p>
                        </div>
                        <div onClick={() => changeOutlook("enhanced")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.outlook === "enhanced" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Enhanced" title='10-15% tornado / 30-45% wind / 30-45% hail' /> <p>Enhanced</p>
                        </div>
                        <div onClick={() => changeOutlook("moderate")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.outlook === "moderate" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Moderate" title='#15% tornado / #45-60% wind / #45-#60% hail' /> <p>Moderate</p>
                        </div>
                        <div onClick={() => changeOutlook("high")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.outlook === "high" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="High" title='#30-#60% tornado / #60% wind' /> <p>High</p>
                        </div>
                    </div>
                    <div className="status-indicators-control">
                        <p style={{color: 'white', gridColumn: 'span 3', padding: 0, margin: 0, textAlign: 'center'}}>Main Threat Sector</p>
                        <div onClick={() => changeSector("none")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "none" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="No Threat" /> <p>No Threat</p>
                        </div>
                        <div onClick={() => changeSector("southwest")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "southwest" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light" /> <p>Southwest</p>
                        </div>
                        <div onClick={() => changeSector("northwest")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "northwest" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>Northwest</p>
                        </div>
                        <div onClick={() => changeSector("highplains")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "highplains" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>High Plains</p>
                        </div>
                        <div onClick={() => changeSector("newengland")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "newengland" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>New England</p>
                        </div>
                        <div onClick={() => changeSector("northeast")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "northeast" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>Northeast</p>
                        </div>
                        <div onClick={() => changeSector("ohiovalley")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "ohiovalley" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>Ohio Valley</p>
                        </div>
                        <div onClick={() => changeSector("appalachia")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "appalachia" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>Appalachia</p>
                        </div>
                        <div onClick={() => changeSector("deepsouth")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "deepsouth" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>Deep South</p>
                        </div>
                        <div onClick={() => changeSector("greatplains")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "greatplains" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>Great Plains</p>
                        </div>
                        <div onClick={() => changeSector("midwest")} className="status-light-div control-light-div" title='Click to toggle.'>
                            <img loading='lazy' src={`${"/images/lights/light_white" + (desc?.area === "midwest" ? "" : "_off") + ".webp"}`} width="32px" height="32px" alt="Indicator light"/> <p>Midwest</p>
                        </div>
                    </div>
                    <div>
                        <button className='analog-button' style={{width: '100%'}} onClick={() => axios.get('https://arina.lol/api/shepardess/yt-test2')}>UPDATE LIVESTREAMS</button>
                        <p>LAST UPDATE: {desc.lastUpdate} CST</p>
                    </div>
                </div>
                <div className='control-desc'>
                    <div className='control-desc-part'>
                        <textarea type='text' placeholder='Scrolling Text, seperate colors with commas.' defaultValue={desc.scrolling} onChange={(e) => setNewscroll(e.currentTarget.value)} />
                        <button title='Update' onClick={() => changeDescs(0)} style={{backgroundImage: 'url(/images/16icons/upload.png)', height: '100%', backgroundColor: 'white'}} className='analog-button square-button'></button>
                    </div>
                    <div className='control-desc-part'>
                        <textarea type='text' style={{height: '25px'}} placeholder='QRD - Quick run down/title for desc' defaultValue={desc.qrd} onChange={(e) => setNewQRD(e.currentTarget.value)} />
                        <button title='Update' onClick={() => changeQRD(1)} style={{backgroundImage: 'url(/images/16icons/upload.png)', height: '100%', backgroundColor: 'white'}} className='analog-button square-button'></button>
                    </div>
                    <div className='control-desc-part'>
                        <textarea type='text' style={{height: '200px'}} placeholder='Full description text' defaultValue={desc.desc} onChange={(e) => setNewdesc(e.currentTarget.value)} />
                        <button title='Update' onClick={() => changeDescription(2)} style={{backgroundImage: 'url(/images/16icons/upload.png)', height: '100%', backgroundColor: 'white'}} className='analog-button square-button'></button>

                    </div>
                </div>
            </>
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
        const refreshAccounts = () => {
            socket.emit('sync_accounts', {'key': localStorage.getItem("kaepyi")})
        }
        return (
            <div className='control-accounts-wrapper'>
                <p style={{background: 'rgba(55,55,55,1)', color: 'white', fontSize: '10px', textAlign: 'center', margin: 0, padding: 0}}>Accounts (admin only) <img width={'10px'} height={'10px'} src="/images/16icons/refresh8px.png" alt="refresh accounts" title="Refresh Accounts" style={{cursor: 'pointer'}} onClick={() => refreshAccounts()} /> </p>
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
            <div style={{width: 'calc(100% - 10px)', height: 'calc(100% - 10px)', border: 'inset 3px', padding: '2px', background: 'url(/images/bgs/moon-bg.png)', display: 'flex', justifyContent: 'space-between'}}>
                <p style={{color: 'white'}}>Welcome to the control panel!</p>
                <div className='control-account control-desc-part' style={{width: 'fit-content', border: 'none'}}>
                    <input type='password' placeholder='API key here.' defaultValue={localStorage.getItem('kaepyi')} onChange={(e) => f(e)} />
                </div>
            </div>
        )
    }

    return (
        <div className="control-app">
            <div className='logo-container' style={{width: 'calc(100% - 6px)', height: 'calc(100% - 6px)', display: 'grid', gridTemplateColumns: '50% 50%', gridTemplateRows: '50% 50%', alignItems: 'center', justifyContent: 'center', background: 'black', gridColumn: 1, gridRow: 1, border: 'outset 3px'}}>
                <a style={{outline: 'outset 2px'}} href='/home' ><img loading='lazy' height={'24px'} src="/images/bgs/skull-logo.png" alt="logo" /></a>
                <a style={{outline: 'outset 2px'}} href='/control/panels' ><img loading='lazy' height={'24px'} src="/images/16icons/terminalicon.png" alt="logo" /></a>
                <a style={{outline: 'outset 2px'}} href='/control/streams' ><img loading='lazy' height={'24px'} src="/images/16icons/terminallinkicon.png" alt="logo" /></a>
                <a style={{outline: 'outset 2px'}} href='/control/map' ><img loading='lazy' height={'24px'} src="/images/16icons/terminalthumbicon.png" alt="logo" /></a>
            </div>

            <div style={{gridColumn: 'span 2', gridRow: 1}}>
                <Messages/>
            </div>

            <div style={{gridColumn: 1, gridRow: 2}}>
                <Accounts/>
            </div>

            <div style={{gridColumn: 'span 2', gridRow: 2}} className='control-status'>
                <MainControl/>
            </div>
        </div>
    )
}

export default Control;

/*



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

not sure if i really need these anymore, or ever needed them at all tbh

*/