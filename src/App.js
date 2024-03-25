import { Suspense, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import LeftPanel from './components/left-box/leftpanel';
import ChatPanel from './components/chat/chatpanel';
import Stream from './components/stream';
import Status from './components/status';

import './css/homepage.css';
import './css/left-box.css';
import './css/status.css';

const texts = [
  "Hi!! Welcome to Shepardess!! If you're new and would like a quick, tutorial... I could show you around!",
  "Yeah! I'll show you! This is the bottom section, and right now its on the map. This shows my current location, NWS warnings, radar, custom areas, and a lot more!! A lot happens here, it's a very important panel!",
  "You can expand or contract the bottom section by hitting the double arrow button, or swap the map for another panel with these red buttons.",
  "Next is the chat panel!! It's anonymous, so you can enter any name to join!! It's optional, though, so you don't have to join.",
  "These up here are the status indicators. They're a really fast way to know what's going on!! If one of these images has a title, then that means it's active!",
  "Hmm... this is pretty much it, then. This is the stream panel. All you have to do is click an entry and it'll connect you to the stream right here!",
  "I think you're all set!! Just watch for popups on the site! They will notify if a stream has a funnel cloud, tornado, shelf cloud, hail, etc. on it currently!! Enjoy Shepardess!!"
]
 //[rowS, rowE], [colS, colE] -- except for button, which is [colS, colE], [row]
const gridhazel = [[[9, 11], [9, 11]], [[4, 11], [12, 11]], [[4, 11], [12, 11]], [[15, 15], [7, 11]], [[6, 6], [6, 6]], [[1, 1], [8, 8]]]
const gridbubble = [[[12, 16], [7, 11]], [[7, 13], [7, 12]], [[7, 13], [7, 12]], [[17, 21], [3, 7]], [[9, 13], [3, 8]], [[1, 5], [3, 8]]]
const gridbutton = [[[8, 12], [13]], [[8, 11], [13]], [[8, 11], [13]], [[17, 21], [14]], [[5, 10], [10]], [[1, 4], [12]]]
const highlightid = ['tutorial-panel', 'bottom-panel', 'bottom-panel', 'chat-panelh', 'status-highlight', 'status-highlight', 'status-highlight', 'main-sliding-container']

const App = () => {

  var socket = io.connect('https://arina.lol');

  const [popup, setPopup] = useState({
    "popup": "tornado",
    "active": false
  })

  const [tutorial, setTutorial] = useState({
    "active": false,
    "stage": 0,
    "text": texts[0],
    "gridhazel": gridhazel[0],
    "gridbubble": gridbubble[0],
    "gridbutton": gridbutton[0]
  })

  const tutorialAdvance = () => {
    var newnum = tutorial.stage + 1
    var newarr = {
      "active": true,
      "stage": newnum,
      "text": texts[newnum],
      "gridhazel": gridhazel[newnum],
      "gridbubble": gridbubble[newnum],
      "gridbutton": gridbutton[newnum]
    }
    if ((newnum) >= 6) {
      newarr = {
        "active": false,
        "stage": newnum,
        "text": "",
        "gridhazel": gridhazel[0],
        "gridbubble": gridbubble[0],
        "gridbutton": gridbutton[0]
      }
      localStorage.setItem('tutorial', 'false')
    }
    document.getElementById(`${highlightid[newnum]}`).style.zIndex = 501
    setTutorial(newarr)
  }

  const tutorialSkip = () => {
    var newarr = {
      "active": false,
      "stage": 0,
      "text": "",
      "gridhazel": gridhazel[0],
      "gridbubble": gridbubble[0],
      "gridbutton": gridbutton[0]
    }
    setTutorial(newarr)
    localStorage.setItem('tutorial', 'false')
  }

  useEffect(() => {
    if(localStorage.getItem('tutorial') !== 'false') {
      setTutorial({
        "active": true,
        "stage": 0,
        "text": texts[0],
        "gridhazel": gridhazel[0],
        "gridbubble": gridbubble[0],
        "gridbutton": gridbutton[0]
      })
    }
  }, [])

  useEffect(() => {
    socket.on('receive_popup', (data) => {
      setPopup({
        active: true,
        "popup": data
      }, setTimeout(() => {
        setPopup({
          "popup": "none",
          active: false
        })
      }, [6000]))
    })

    return () => socket.off('receive_popup')
  }, [socket])

  const toggleGroup = (id) => {
    document.getElementById(`${id}`).classList.toggle('group-grid-default')
    document.getElementById(`${id}`).classList.toggle('group-grid')
  }

  const popupWarnings = {
    "tornado": "Tornado spotted and confirmed!",
    "flood": "Flooding occuring right now!",
    "bighail": "Large hail occuring right now!",
    "derecho": "Derecho occuring right now!",
    "highwind": "High Winds of 65mph (29m/s, 56kts) or high just confirmed!",
    "funnelcloud": "Funnel cloud spotted!",
    "emergency": "Emergency",
    "shelfcloud": "Shelf cloud confirmed!"
  }

  const Fallback = () => {
    return (
      <div>
        <img alt='fallback loading logo' src='/images/bgs/skull-logo-mini.png' />
      </div>
    )
  }

  const CenterPanel = () => {

    const socket = io.connect('https://arina.lol')

    useEffect(() => {
      console.log("Center rerender")
      socket.emit('sync_stream')
      socket.emit('sync_group')
    }, [])

  useEffect(() => {
    document.getElementById('main-sliding-container').classList.remove('sliding-expanded')
  }, [])

  const LeftBox = () => {

    const [panel, setPanel] = useState("map")

    return (
      <div className="left-box">
        <div className="left-buttons">
          <img loading='lazy' className='expand-button left-expand' alt='expand' src='/images/16icons/up-button.png' title='Expand/Contract bottom container.' style={{pointerEvents: 'all', cursor: 'pointer'}} onClick={() => document.getElementById('main-sliding-container').classList.toggle('sliding-expanded')} />
          <button onClick={() => setPanel("map")} >Map <img loading='lazy' alt='decor icon' src='/images/16icons/map.png' className='left-button-icon'/></button>
          <button onClick={() => setPanel("warn")} >Warn <img loading='lazy' alt='decor icon' src='/images/16icons/warn.png' className='left-button-icon'/></button>
          <button onClick={() => setPanel("past")} >Past <img loading='lazy' alt='decor icon' src='/images/16icons/past.png' className='left-button-icon'/></button>
          <button onClick={() => setPanel("social")} >Social <img loading='lazy' alt='decor icon' src='/images/16icons/social.png' className='left-button-icon'/></button>
          <button onClick={() => setPanel("contact")} >About+ <img loading='lazy' alt='decor icon' src='/images/16icons/contact.png' className='left-button-icon'/></button>
          <button className='account-leftpanel-button' onClick={() => setPanel("settings")} >Account <img loading='lazy' alt='decor icon' src='/images/16icons/settings.png' className='left-button-icon'/></button>
          <button className='chat-leftpanel-button' onClick={() => setPanel("chat")} >Chat <img loading='lazy' alt='decor icon' src='/images/16icons/chat.png' className='left-button-icon'/></button>
        </div>
        <div style={{gridRow: 3}} className="left-viewer">
          <div className="scrolling-text-div" style={{paddingBottom: '12px', zIndex: 3}}>
            <p className="static-text">{panel.toUpperCase()}</p>
          </div>
          <Suspense fallback={<Fallback/>}>
            <LeftPanel panel={panel}/>
          </Suspense>
        </div>
      </div>
    )
  }

  const StreamContainer = () => {
    const [activestream, setActiveStream] = useState([null, null, null, null])
    const [multistream, setMultiStream] = useState(false)

    const openStream = (el) => {
      setActiveStream([el, null, null, null])
    }
  
    const closeStream = () => {
      setActiveStream([null, null, null, null])
      socket.emit('sync_group')
      socket.emit('sync_stream')
    }

    const toggleMulti = () => {
      setActiveStream([activestream[0], null, null, null])
      setMultiStream(!multistream)
    }

    const openStreamMulti = (el, pos) => {
      var newarr = [...activestream]
      newarr[pos] = el
      setActiveStream(newarr)
    }

    const Group = (ids) => {
      return (
          <div className="group-container-outer">
              <div className='group-container'>
                  {ids.ids.length > 0 ? ids.ids.map((el) => {
                      const camtype = ['camera', 'carstream', 'audiostream', 'other']
                      const camtypetext = ['Static Camera', 'Car Camera', 'Screenshare', 'Other']
                      return (
                      <div key={`${el.id}`} className="group-stream-box" id={`stream-${el.id}`}>
                          <div className='group-control-stream-box' onClick={() => openStream(el)}>
                              <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                  <img loading='lazy' alt="decor" className='group-led-light' src="/images/bgs/status-light.png" title={`Camera is ${el.active === 0 ? "off" : "active"}`} id={`stream-active-light-${el.id}`} style={{outlineOffset: '-1px', background: `${el.active === 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active === 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`}} />
                                  <div style={{overflow: 'hidden', margin: '0px 8px', width: '100%'}}>
                                      <p className="group-cam-title stream-title" title={`${el.title}-{ID: #${el.id}}`} type='text'>{el.title}<b style={{fontSize: '12px', margin: '0 4px', color: 'darkgray'}}>{`ID:${el.id}`}</b></p>
                                  </div>
                                  <img loading='lazy' title={`${camtypetext[el.type]}`} src={`/images/16icons/${camtype[el.type]}.png`} alt='decor' className="type-image" />
                              </div>
                              <div style={{gridRow: 'span 2', width: 'calc(100% - 21px)', height: 'calc(100% - 11px)', aspectRatio: '1/1', borderStyle: 'inset', borderWidth: '4px', borderColor: '#879987 #B6FFB6 #B6FFB6 #879987 ', backgroundImage: `url(${el.thumblink})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                              <div style={{height: '100%', width: '100%', background: 'repeating-linear-gradient(to top, rgba(255, 255, 255, 0.2) 0px 2px, transparent 2px 4px)', backdropFilter: `${el.active === 0 ? "grayscale(1)" : "grayscale(0)"}`}}></div></div>
                              <div className='handle' style={{position: 'absolute', alignItems: 'center', bottom: '10px'}}>
                                  <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-left.png'/>
                                  <p title={`${el.internalname}`} style={{height: '22px', margin: 0, backgroundImage: 'url(/images/bgs/handlebox-center.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', fontFamily: 'ms ui gothic', lineHeight: '22px', color: '#3a5212'}}>{el.internalname}</p>
                                  <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-right.png'/>
                              </div>
                          </div>
                      </div>
                      )
                  }): null}
              </div>
          </div>
      )
  }

    const Streams = () => {
      const [streams, setStreams] = useState([])
      const [groups, setGroups] = useState([])
      const [streamgroup, setStreamgroup] = useState([])
  
      useEffect(() => {
        socket.on('set_stream', (data) => {
          var streamsarr = []
          var groupsarr = []
          data.forEach((el) => {
            if (el.groupname !== null && el.groupname !== "NULL") {
              groupsarr.push(el)
            } else {
              streamsarr.push(el)
            }
          })
          setStreams(streamsarr)
          setStreamgroup(groupsarr)
        })
    
        return () => socket.off('set_stream')
      }, [socket, streams, setStreams])
    
      useEffect(() => {
        socket.on('update_stream', (data) => {
            streams.forEach((el, ind) => {
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
            streams.forEach((el) => {
                if (el.id !== data.id) {
                    newarr.push(el)
                }
            })
            setStreams(newarr)
            newarr = []
            streamgroup.forEach((el) => {
                if (el.id !== data.id) {
                    newarr.push(el)
                }
            })
            setStreamgroup(newarr)
          })
          return () => socket.off('remove_stream')
      }, [socket, streams, setStreams, streamgroup, setStreamgroup])
    
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
              groups.forEach((el) => {
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
          <div id='feed-panel' style={{height: 'calc(100% - 20px)', padding: '10px'}}>
            <div className='stream-container'>
                {groups.length > 0 ? groups.map((el) => {
                  var info = []
                  streamgroup.forEach((il) => {
                    if (il.groupname === el.internalname) {
                      info.push({
                        "id": il.id,
                        "internalname": il.internalname,
                        "title": il.title,
                        "link": il.link,
                        "active": il.active,
                        "type": il.type,
                        "author": il.author,
                        "groupname": il.groupname,
                        "thumblink": il.thumblink
                      })
                    }
                  })
                  return (
                    <fieldset style={{minInlineSize: 'auto', paddingBlockStart: 0, paddingBlockEnd: 0, paddingInlineStart: 0, paddingInlineEnd: 0, margin: 0, border: 'solid white 2px'}} key={el.id} id={`group-default-${el.id}`} className="group-grid">
                      <Group ids={info} group={el.title}/>
                      <legend title='Click to expand.' style={{background: 'rgba(0,0,0,0.75)', maxWidth: '175px', textAlign: 'center', color: 'lime', fontFamily: 'ms ui gothic', cursor: 'pointer', textDecoration: 'underline', textShadow: '1px 1px 5px #000, -1px 1px 5px #000, -1px -1px 5px #000, 1px -1px 5px #000'}} onClick={() => toggleGroup(`group-default-${el.id}`)}><img style={{paddingRight: '5px'}} src={`${el.icon}`} alt="decor" width={'16px'} height={'16px'} />{el.title}</legend>
                    </fieldset>
                  )
                }) : null}
                {streams.length > 0 ? streams.map((el) => {
                    const camtype = ['camera', 'carstream', 'audiostream', 'other']
                    const camtypetext = ['Static Camera', 'Car Camera', 'Screenshare', 'Other']
                    return (
                      <div key={el.id} className='stream-box-container' style={{overflow: 'hidden', marginBottom: '10px'}}>
                        <div id={`stream-${el.id}`} className='control-stream-box' style={{cursor: `${el.active === 0 ? 'default' : 'pointer'}`, alignItems: 'stretch'}} onClick={() => openStream(el)}>
                            <div id={`stream-thumb-${el.id}`} style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <img loading='lazy' src='/images/bgs/status-light.png' className='stream-status-light' alt={`Camera is ${el.active === 0 ? "off." : "active."}`} title={`Camera is ${el.active === 0 ? "off" : "active"}`} id={`stream-active-light-${el.id}`} style={{background: `${el.active === 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active === 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`, borderRadius: '50%'}} />
                                <div className='stream-title-container' style={{overflow: 'hidden', margin: '4px 9px', width: '100%'}}>
                                  <p className='stream-title' title={`${el.title}-{ID: #${el.id}}`} type='text'>{el.title}<b style={{fontSize: '12px', margin: '0 4px', color: 'darkgray'}}>{`ID:${el.id}`}</b></p>
                                </div>
                                <img loading='lazy' title={`${camtypetext[el.type]}`} src={`/images/16icons/${camtype[el.type]}.png`} alt='decor' className='stream-status-light' />
                            </div>
                            <div style={{gridRow: 'span 2', width: 'calc(100% - 16px)', height: 'calc(100% - 16px)', aspectRatio: '1/1', borderStyle: 'inset', borderWidth: '4px', borderColor: '#879987 #B6FFB6 #B6FFB6 #879987 ', backgroundImage: `url(${el.thumblink})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                              <div style={{height: '100%', width: '100%', background: 'repeating-linear-gradient(to top, rgba(255, 255, 255, 0.1) 0px 2px, transparent 2px 4px)', backdropFilter: `${el.active === 0 ? "grayscale(1)" : "grayscale(0)"}`}}></div>
                            </div>
                            <div className='handle' style={{position: 'absolute', alignItems: 'center', bottom: '12px'}}>
                              <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-left.png'/>
                              <p title={`${el.internalname}`} style={{height: '22px', margin: 0, backgroundImage: 'url(/images/bgs/handlebox-center.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', fontFamily: 'ms ui gothic', lineHeight: '22px', color: '#3a5212'}}>{el.internalname}</p>
                              <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-right.png'/>
                            </div>
                        </div>
                      </div>
                    )
                }) : null}
            </div>
          </div>
      )
    }

    const StreamList = (pos) => {
      const [streams, setStreams] = useState([])

      useEffect(() => {
        socket.emit('sync_stream')
      }, [])
  
      useEffect(() => {
        socket.on('set_stream', (data) => {
          setStreams(data)
        })
    
        return () => socket.off('set_stream')
      }, [socket, streams, setStreams])

      return (
        <div className='stream-list' style={{display: 'flex', flexDirection: 'column', overflow: 'hidden', overflowY: 'scroll', margin: '10px', padding: '10px', outline: 'inset 3px'}}>
          {streams.length > 0 ? streams.map((el) => {
              const camtype = ['camera', 'carstream', 'audiostream', 'other']
              const camtypetext = ['Static Camera', 'Car Camera', 'Screenshare', 'Other']
              return (
                <div key={el.id} className='stream-list-container' style={{marginBottom: '10px'}}>
                  <div id={`stream-${el.id}`} className='control-stream-list' style={{cursor: `${el.active === 0 ? 'default' : 'pointer'}`, alignItems: 'stretch'}} onClick={() => openStreamMulti(el, pos.pos)}>
                      <div id={`stream-thumb-${el.id}`} style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', border: 'solid gray 1px', borderRadius: '3px', padding: '3px', background: 'rgba(125,125,125,0.4)'}}>
                          <img loading='lazy' src='/images/bgs/status-light.png' className='stream-status-light' alt={`Camera is ${el.active === 0 ? "off." : "active."}`} title={`Camera is ${el.active === 0 ? "off" : "active"}`} id={`stream-active-light-${el.id}`} style={{background: `${el.active === 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active === 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`, borderRadius: '50%'}} />
                          <div className='stream-title-container' style={{overflow: 'hidden', margin: '4px 9px', width: '100%'}}>
                            <p className='stream-title' title={`${el.title}-{ID: #${el.id}}`} type='text'>{el.title}<b style={{fontSize: '12px', margin: '0 4px', color: 'darkgray'}}>{`ID:${el.id}`}</b></p>
                          </div>
                          <img loading='lazy' title={`${camtypetext[el.type]}`} src={`/images/16icons/${camtype[el.type]}.png`} alt='decor' className='stream-status-light' />
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', bottom: '12px'}}>
                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-left-inverse.png'/>
                        <p title={`${el.internalname}`} style={{height: '22px', margin: 0, backgroundImage: 'url(/images/bgs/handlebox-center-inverse.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', fontFamily: 'ms ui gothic', lineHeight: '22px', color: '#3a5212'}}>{el.internalname}</p>
                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-right-inverse.png'/>

                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-left-inverse.png'/>
                        <p title={`${el.groupname}`} style={{height: '22px', margin: 0, backgroundImage: 'url(/images/bgs/handlebox-center-inverse.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', fontFamily: 'ms ui gothic', lineHeight: '22px', color: '#3a5212'}}>Tag: {el.groupname !== null ? el.groupname : "None"}</p>
                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-right-inverse.png'/>
                      </div>
                  </div>
                </div>
              )
          }) : null}
        </div>
      )
    }

    const dragHSliderOne = (e) => {
      e.preventDefault()
      if (e.pageX !== 0) {
        document.getElementById('multi-stream-container').style.gridTemplateColumns = `calc(${((e.pageX / window.innerWidth) * 100).toFixed(1)}% - 4px) 3px calc(${(100 - ((e.pageX / window.innerWidth) * 100)).toFixed(1)}% - 4px)`
      } 
    }
  
    const dragVSliderOne = (e) => {
      e.preventDefault()
      if (e.pageY !== 0) {
        document.getElementById('multi-stream-container').style.gridTemplateRows = `calc(${((e.pageY / e.target.offsetParent.clientHeight) * 100).toFixed(1)}% - 4px) 3px calc(${(100 - ((e.pageY / e.target.offsetParent.clientHeight) * 100)).toFixed(1)}% - 4px)`
      } 
    }

    return (
      <>
        {activestream[0] !== null ?
          <div id='single-stream' style={{height: 'calc(100% - 20px)'}}>
            <div style={{position: 'absolute'}}>
              <img src='/images/16icons/x-button.png' width={'32px'} height={'32px'} alt='close stream' onClick={() => closeStream()} style={{cursor: 'pointer'}} />
              <img src='/images/16icons/multi-button.png' className='mobile-hide' width={'32px'} height={'32px'} alt='close stream' onClick={() => toggleMulti()} style={{cursor: 'pointer'}} />
            </div>
              {multistream ? 
                <div id='multi-stream-container' style={{display: 'grid', gridTemplateColumns: 'calc(50% - 4px) 3px calc(50% - 4px)', gridTemplateRows: 'calc(50% - 4px) 3px calc(50% - 4px)', height: '103%', gap: '5px'}}>
                  <Stream stream={activestream[0]} />
                  {activestream[1] !== null ? <Stream stream={activestream[1]} /> : <StreamList pos={1}/>}
                  <div draggable className='grid-slider' style={{gridRowStart: 1, gridRowEnd: 4, gridColumn: 2, border: 'blue 1px dashed', height: '100%', cursor: 'ew-resize'}}
                  onDrag={(e) => dragHSliderOne(e)}
                  ></div>
                  {activestream[2] !== null ? <Stream stream={activestream[2]} /> : <StreamList pos={2}/>}
                  {activestream[3] !== null ? <Stream stream={activestream[3]} /> : <StreamList pos={3}/>}
                  <div draggable className='grid-slider' style={{gridColumnStart: 1, gridColumnEnd: 4, gridRow: 2, border: 'blue 1px dashed', height: '100%', cursor: 'ns-resize'}}
                  onDrag={(e) => dragVSliderOne(e)}
                  ></div>
                </div>
              : <Stream stream={activestream[0]} />}
          </div>
        : <Streams/>}
      </>
    )
  }

    return (
      <div id='main-sliding-container' style={{gridColumn: 3, gridRowStart: 2, gridRowEnd: 7}} className="feeds-container sliding-expanded">
        <StreamContainer/>

        <div style={{gridRow: 2}} className="left-section" id='bottom-panel'>
            <LeftBox/>
        </div>
      </div>
    )
  }

  const Featured = () => {
    const socket = io.connect("https://arina.lol")

    const [featured, setFeatured] = useState("")
    const [all, setAll] = useState([])

    useEffect(() => {
      socket.emit("sync_description")
      socket.emit("sync_stream")
    }, [])

    useEffect(() => {
      socket.on('set_desc', (data) => {
        setFeatured(data[3].text)
      })

      return () => socket.off('set_desc')
  }, [socket, featured, setFeatured])

  useEffect(() => {
    socket.on('set_stream', (data) => {
      setAll(data)
    })

    return () => socket.off('set_stream')
  }, [socket, all, setAll])

    return (
      <div style={{gridColumn: 1, gridRowStart: 1, gridRowEnd: 4, height: '97%'}} className="description-section">
      <div className='logo-container' style={{gridColumn: 1, gridRow: 1, width: '100%'}}>
        <h1 style={{fontFamily: 'blurpix', color: 'white', margin: 0, textShadow: '3px 1px 3px black', fontSize: '27px', fontStyle: 'italic', fontWeight: 400, width: '100%', height: '100%', textAlign: 'center', background: 'url(/images/bgs/skull-logo-final.png)', backgroundSize: 'cover', backgroundPosition: 'center', lineHeight: '96px'}}>SHEPARDESS</h1>
      </div>
      <div style={{width: '100%', backgroundImage: 'url(/images/bgs/darkbluesteel_widecontainer.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}}>
        <p style={{textAlign: 'center', fontFamily: 'ms ui gothic', color: 'rgb(34 97 101)', fontWeight: '700', fontSize: '18px'}}>Featured Stream:</p>
      </div>
      {all.length > 0 ? all.map((el) => {
          const camtype = ['camera', 'carstream', 'audiostream', 'camera']
          const camtypetext = ['Static Camera', 'Car Camera', 'Screenshare', 'Other']
          if (el.internalname === featured) {
            return (
              <div key={`fstreambox-${el.id}`} className="group-stream-box featured-hover" style={{width: '180px', height: '180px', backgroundImage: "url(/images/bgs/orange_steel_container.png)", backgroundSize: '100% 100%'}} id={`stream-${el.id}`}>
                  <div id={`featuredstream`} className='group-control-stream-box' style={{margin: '0 6px'}} onClick={() => document.getElementById(`stream-${el.id}`).click()}>
                      <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                          <img loading='lazy' src='/images/bgs/status-light.png' width={'16px'} height={'16px'} alt={`Camera is ${el.active === 0 ? "off." : "active."}`} title={`Camera is ${el.active === 0 ? "off" : "active"}`} id={`stream-active-light-${el.id}`} style={{background: `${el.active === 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active === 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`, borderRadius: '50%'}} />
                          <div style={{overflow: 'hidden', margin: '0 11px', width: '100%'}}>
                            <p className="group-cam-title stream-title" title={`${el.title}`} type='text'>{el.title}</p>
                          </div>
                          <img loading='lazy' title={`${camtypetext[el.type]}`} src={`/images/16icons/${camtype[el.type]}.png`} alt='decor' style={{height: '16px', width: '16px'}} className="type-image" />
                      </div>
                      <div style={{gridRow: 'span 2', width: 'calc(100% - 22px)', height: 'calc(100% - 4px)', aspectRatio: '1/1', borderStyle: 'inset', borderWidth: '4px', borderColor: '#999387 #ffeab6 #ffeab6 #999387 ', backgroundImage: `url(${el.thumblink})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                      <div style={{height: '100%', width: '100%', background: 'repeating-linear-gradient(to top, rgba(255, 255, 255, 0.1) 0px 2px, transparent 2px 4px)', backdropFilter: `${el.active === 0 ? "grayscale(1)" : "grayscale(0)"}`}}></div></div>
                      <div className='handle' style={{position: 'absolute', alignItems: 'center', bottom: '12px'}}>
                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-left-gold.png'/>
                        <p title={`${el.internalname}`} style={{height: '22px', margin: 0, backgroundImage: 'url(/images/bgs/handlebox-center-gold.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', fontFamily: 'ms ui gothic', lineHeight: '22px', color: 'rgb(79 81 15)'}}>{el.internalname}</p>
                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-right-gold.png'/>
                      </div>
                  </div>
              </div>
            )
          }
      }) : <div style={{width: '180px'}}></div>}
    </div>
    )
  }

  const QRD = () => {
    const socket = io.connect("https://arina.lol")

    const [desc, setDesc] = useState({
      "scrolling": ["SYNCING TO SERVER...", "PLEASE WAIT..."],
      "qrd": "Syncing to server...",
      "full": "Syncing to server...",
      "featured": "",
      "threat": "none",
      "recentChange": 0
    })

    useEffect(() => {
      socket.emit("sync_description")
    }, [])

  useEffect(() => {
      socket.on('set_desc', (data) => {
        var newscroll = data[0].text.split(",")
        setDesc({
          "scrolling": newscroll,
          "qrd": data[1].text,
          "full": data[2].text,
          "featured": data[3].text,
          "threat": data[4].text,
          "recentChange": 0
        })
      })

      return () => socket.off('set_desc')
  }, [socket, desc, setDesc])

  useEffect(() => {
    socket.on('update_desc', (data) => {
        const titles = ['scrolling', 'qrd', 'full', 'featured', 'threat']
        var newvalue = data.newtext
        if(data.title === 0) {
          newvalue = newvalue.split(',')
        }
        const newdata = {
          "scrolling": desc.scrolling,
          "qrd": desc.qrd,
          "full": desc.full,
          "featured": desc.featured,
          "threat": desc.threat,
          "recentChange": data.title,
          [titles[data.title]]: newvalue
        }
        setDesc(newdata, setTimeout(() => {
          const newdata = {
            "scrolling": desc.scrolling,
            "qrd": desc.qrd,
            "full": desc.full,
            "featured": desc.featured,
            "threat": desc.threat,
            "recentChange": 10,
            [titles[data.title]]: newvalue
          }
          setDesc(newdata)
        }, [2500]))
      })
      return () => socket.off('update_desc')
  }, [socket, desc, setDesc])

    return (
      <div className='qrd-section' style={{gridColumn: 1, gridRowStart: 4, gridRowEnd: 7, overflow: 'scroll', height: '97%', background: 'url(/images/bgs/BlackThatch.png)', border: 'outset 3px', outline: 'black 1px solid', outlineOffset: '-1px'}}>
        <div className='description-banner'>
            <img loading='lazy' src='/images/bgs/opendir.gif' alt='decor' style={{margin: '0 8px 0 4px'}} width={'18px'} height={'18px'} /><p style={{fontFamily: 'ms ui gothic'}}>INFO</p>
        </div>
        <div style={{padding: '4px'}}>
                <div className='description-qrd'>
                    <h4 style={{fontFamily: 'ms ui gothic'}}>
                        <img loading='lazy' src={`${desc?.qrd?.split('|')[1]}`} style={{maxWidth: '32px', maxHeight: '32px'}} alt='qrd decor'/>
                        {desc?.qrd?.split('|')[0]}
                    </h4>
                </div>
            <hr style={{height: '1px', borderBottom: 'solid 1px white'}} />
            <div className='description-full'>
                <p style={{fontFamily: 'ms ui gothic'}}>
                  {desc?.full?.split('|')[0]}
                  <br/>
                  <img loading='lazy' src={`${desc?.full?.split('|')[1]}`} alt='description decor'/>
                </p>
            </div>
        </div>
    </div>
    )
  }

  const dragHSliderOne = (e) => {
    e.preventDefault()
    var curr = (document.getElementById('main-container').style.gridTemplateColumns).toString()
    var matches = curr.matchAll(/(\d+(\.\d+)?)%/gm)
    var currarr = []
    for (const match of matches) {
      currarr.push(match[1])
    }
    if (e.pageX !== 0 && ((e.pageX / window.innerWidth) * 100).toFixed(1) >= 13 && ((e.pageX / window.innerWidth) * 100).toFixed(1) <= 40) {
      document.getElementById('main-container').style.gridTemplateColumns = `calc(${((e.pageX / window.innerWidth) * 100).toFixed(1)}% - 5px) 5px ${((100 - currarr[2]) - ((e.pageX / window.innerWidth) * 100)).toFixed(1)}% 5px calc(${currarr[2]}% - 5px)`
    } 
  }

  const dragHSliderTwo = (e) => {
    e.preventDefault()
    var curr = (document.getElementById('main-container').style.gridTemplateColumns).toString()
    var matches = curr.matchAll(/(\d+(\.\d+)?)%/gm)
    var currarr = []
    for (const match of matches) {
      currarr.push(match[1])
    }
    if (e.pageX !== 0 && (Math.abs((currarr[0]) - ((e.pageX / window.innerWidth) * 100)).toFixed(1)) >= 38 && (Math.abs((currarr[0]) - ((e.pageX / window.innerWidth) * 100)).toFixed(1)) <= 70) {
      document.getElementById('main-container').style.gridTemplateColumns = `calc(${currarr[0]}% - 5px) 5px ${Math.abs((currarr[0]) - ((e.pageX / window.innerWidth) * 100)).toFixed(1)}% 5px calc(${Math.abs((100 - (e.pageX / window.innerWidth) * 100)).toFixed(1)}% - 5px)`
    } 
  }

  return (
    <div className="App">
      {tutorial.active ?
        <div className='mobile-hide' style={{position: 'fixed', width: '100%', height: '100%', zIndex: 500}}>
          <div style={{position: 'absolute', top: 0, backdropFilter: 'saturate(0) brightness(0.8)', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(20, 5%)', gridTemplateRows: 'repeat(20, 5%)'}}>
            <img loading='lazy' className='hazel' style={{gridRowStart: `${tutorial.gridhazel[1][0]}`, gridRowEnd: `${tutorial.gridhazel[1][1]}`, gridColumnStart: `${tutorial.gridhazel[0][0]}`, gridColumnEnd: `${tutorial.gridhazel[0][1]}`}} src='/images/hazel.png' height={'128px'} alt='Hazel' />
            <div style={{gridRowStart: `${tutorial.gridbubble[1][0]}`, gridRowEnd: `${tutorial.gridbubble[1][1]}`, gridColumnStart: `${tutorial.gridbubble[0][0]}`, gridColumnEnd: `${tutorial.gridbubble[0][1]}`, padding: '39px 18px 0px 20px', fontFamily: 'ms ui gothic', backgroundImage: 'url(/images/bubble.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}}>
              <p className='tutorial-text' style={{margin: 0}}>{tutorial.text}</p>
            </div>
            <button style={{gridColumnStart: `${tutorial.gridbutton[0][0]}`, gridColumnEnd: `${tutorial.gridbutton[0][1]}`, gridRow: `${tutorial.gridbutton[1][0]}`, backgroundImage: 'url(/images/bgs/play.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', color: 'white'}} onClick={() => tutorialAdvance()}>Continue!</button>
            <button style={{gridColumnStart: 12, gridColumnEnd: 14, gridRow: 13, backgroundImage: 'url(/images/bgs/play.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', color: 'white'}} onClick={() => tutorialSkip()}>Skip</button>
          </div>
        </div>
      : null}
      <div style={{position: 'fixed', width: '100%', top: '15vh', left: '30vw', display: `${popup.active ? "block" : "none"}`, zIndex: '519'}}>
        <img loading='lazy' src={`/images/popups/popup-${popup.popup}.gif`} style={{zIndex: '20', aspectRatio: '1/1', width: '30vw', position: 'absolute'}} alt={`${popupWarnings[popup.popup]}`} title={`${popupWarnings[popup.popup]}`} />
        <img loading='lazy' src={`/images/popups/popup-container.png`} style={{zIndex: '20', aspectRatio: '1/1', width: 'calc(30vw + 74px)', marginLeft: '-35px', marginTop: '-35px', position: 'absolute'}} alt={'decor'} />
      </div>
      <div id='main-container' className="main-container" style={{gridTemplateColumns: 'calc(18% - 5px) 5px 64% 5px calc(18% - 5px)', gridTemplateRows: 'calc(10% - 5px) 5px 40% 20% 5px calc(30% - 5px)'}}>

        <div style={{gridColumn: 'span 3', gridRow: 1}} className="top-header" id='status-highlight'>
          <div className="scrolling-text-div">
            <Suspense>
              <Status/>
            </Suspense>
          </div>
        </div>

        <div draggable className='grid-slider mobile-hide' style={{gridRowStart: 1, gridRowEnd: 7, gridColumn: 2, border: 'blue 1px dashed', height: '100%', cursor: 'ew-resize'}}
        onDrag={(e) => dragHSliderOne(e)}
        ></div>
        
        <CenterPanel/>

        <div draggable className='grid-slider mobile-hide' style={{gridRowStart: 2, gridRowEnd: 7, gridColumn: 4, border: 'blue 1px dashed', height: '100%', cursor: 'ew-resize'}}
        onDrag={(e) => dragHSliderTwo(e)}
        ></div>

        <div className="mobile-hide" style={{gridColumn: 5, gridRowStart: 2, gridRowEnd: 5, height: '100%'}}>
          <Suspense fallback={<Fallback/>}>
            <ChatPanel/>
          </Suspense>
        </div>

        <Suspense fallback={<Fallback/>}>
            <QRD/>
        </Suspense>

        <Suspense fallback={<Fallback/>}>
            <Featured/>
        </Suspense>

        </div>

    </div>
  );
}

export default App;
