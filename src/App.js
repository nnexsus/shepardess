import { Suspense, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import LeftPanel from './components/left-box/leftpanel';
import Stream from './components/stream';
import Status from './components/status';

import './css/homepage.css';
import './css/left-box.css';
import './css/status.css';

const texts = [
  "Hi! Welcome to Shepardess!! If you're new and would like a quick, tutorial; I could show you around!",
  "Yeah! I'll show you! First, this is the bottom panel. It has a ton of info behind the different menus! You can hit those red buttons to change the active menu.",
  "Also, you can make the bottom panel bigger by hitting the double arrow button.",
  "These up here are the status indicators. They're a really fast way to know what's going on!! If one of these images has a title, then that means it's active!",
  "Almost done! This is the main action, the stream panel. Click on any of these to start watching! You can hit the 4 squares button in a stream to activate multi-stream too, try it!",
  "I think you're all set!! Just watch for popups on the site! They will notify if a stream has a funnel cloud, tornado, shelf cloud, hail, etc. on it currently!! Enjoy Shepardess!!"
]
 //[rowS, rowE], [colS, colE] -- except for button, which is [colS, colE], [row]
const gridhazel =  [[[9, 11], [9, 11]],  [[4, 11], [12, 11]], [[4, 11], [12, 11]], [[6, 6], [6, 6]],  [[1, 1], [8, 8]],         [[1, 1], [8, 8]]]
const gridbubble = [[[12, 16], [7, 11]], [[7, 11], [7, 11]],  [[7, 11], [7, 11]],  [[9, 13], [3, 7]], [[1, 5], [3, 7]],         [[1, 5], [3, 7]]]
const gridbutton = [[[8, 12], [13]],     [[8, 11], [13]],     [[8, 11], [13]],     [[5, 10], [10]],   [[1, 4], [12]],           [[1, 4], [12]]]
const highlightid =['tutorial-panel',    'bottom-panel',      'bottom-panel',      'status-highlight','main-sliding-container', 'main-sliding-container', 'main-sliding-container']

const App = () => {

  const camtype = ['camera', 'carstream', 'audiostream', 'other', 'videoicon']
  const camtypetext = ['Static Camera', 'Car Camera', 'Screenshare', 'Other', 'Video']

  var socket = io.connect('https://arina.lol');

  const toggleGroup = (id) => {
    document.getElementById(`${id}`).classList.toggle('group-grid-default')
    document.getElementById(`${id}`).classList.toggle('group-grid')
  }

  const popupWarnings = {
    "tornado": "If you're recieving this popup, we have a Tornado spotted and confirmed on stream! Click the OPEN STREAM button below to watch live!",
    "flooding": "If you're recieving this popup, we have major Flooding occuring right now on stream! Click the OPEN STREAM button below to watch live!",
    "bighail": "If you're recieving this popup, we have major hail occuring right now on stream - at least greater than one inch! Click the OPEN STREAM button below to watch live!",
    "derecho": "If you're recieving this popup, we have a Derecho occuring right now on stream! Derechos can have up to 160mph widespread winds! Click the OPEN STREAM button below to watch live!",
    "highwind": "If you're recieving this popup, we have High Winds of 65mph (29m/s, 56kts) or higher just confirmed on stream! Click the OPEN STREAM button below to watch live!",
    "funnelcloud": "If you're recieving this popup, we have a Funnel cloud spotted on stream! Click the OPEN STREAM button below to watch live!",
    "emergency001": "If you're recieving this popup, we have an emergency ongoing! Emergency 001: Major technical issues. Major technical issues may bring streams and/or location reporting down, as well as potential site updates during chases. However, there is no other issues occuring.",
    "emergency002": "If you're recieving this popup, we have an emergency ongoing! Emergency 002: Car functional issues. Car functional issues may result in suspension of chasing and/or updates. These issues are not ones that require emergency services, such as windshield cracks, dents, minor accidents, or other non-destructive issues.",
    "emergency003": "If you're recieving this popup, we have an emergency ongoing! Emergency 003: Major car functional issues. Major car functional issues means my car is not in a state to chase or drive. This can range from accidents, full windshield loss, headlight loss (during nighttime periods), or some other form of destruction that I remain unharmed from.",
    "emergency004": "If you're recieving this popup, we have an emergency ongoing! Emergency 004: Stranded. I am stranded and need help to get out, but have not sustained any major injuries, nor am I in immediate danger - my car is likely caught in a ditch or muddy road I can't escape, or perhaps my battery died or I have managed to run out of gas.",
    "emergency005": "If you're recieving this popup, we have an emergency ongoing! Emergency 005: Injury. I or another chaser with me has sustained a major injury that may result is suspension of chase. Technical and electronics are fine, and we have a method to get help (eg. car is functional and drivable, we are getting assistance, etc). No assistance is needed.",
    "emergency006": "If you're recieving this popup, we have an emergency ongoing! Emergency 006: Major comprimise. I and/or other chasers with me have sustained a major comprimise. This means that we likely have sustained major injuries, and are in a position where emergency asssitance is needed.",
    "emergency007": "If you're recieving this popup, we have an emergency ongoing! Emergency 007: Desperation call! I and/or other chasers with me have sustained major injuries and need assistance ASAP. If you see this warning, please call emergency services to my location on the map panel below. Clicking my location marker (rotating red marker) will display my exact coordinates if needed. Please do not hesitate, this warning is set behind several physical and network locks and will never go off unless emergency help is of absolute need for a situation.",
    "emergency008": "If you're recieving this popup, we have an emergency ongoing! Emergency 008: Search and rescue assistance needed! I and/or other chasers with me are performing search and rescue after potential storm damage. This popup is a request for people to request for assistance, as major damage or potentially better gear is required to continue - or, there may be more people in need of help that we cannot fit.",
    "emergency009": "If you're recieving this popup, we have an emergency ongoing! Emergency 009: Particularly Dangerous Situation! The storm we are chasing is particularly dangerous, and is a major threat for anyone that could be potentially affected. This popup is a request for people to relay the severity of the event ongoing.",
    "emergency010": "If you're recieving this popup, we have an emergency ongoing! Emergency 010: Unwarned or unconfirmed tornado! The storm we are chasing is currently unwarned or the tornado is not set to spotter confirmed. This popup is a request to relay information to correct sources to confirm this tornado, as I am in a position where I can not comfortably.",
    "shelfcloud": "If you're recieving this popup, we have a Shelf Cloud ongoing on stream! Click the OPEN STREAM button below to watch live!",
    "landfall": "If you're recieving this popup, a Tropical Storm or Hurricane is making landfall on stream! Click the OPEN STREAM button below to watch live!",
  }

  const Fallback = () => {
    return (
      <div>
        <img alt='fallback loading logo' src='/images/bgs/skull-logo-mini.png' />
      </div>
    )
  }

  const CenterPanel = () => {

  useEffect(() => {
    socket.emit('sync_stream')
    socket.emit('sync_group')
  }, [])

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
                      return (
                      <div key={`${el.id}`} className={`group-stream-box stream-box-${el.active}`}>
                          <div className='group-control-stream-box' id={`stream-${el.id}`} onClick={() => openStream(el)}>
                              <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                  <img loading='lazy' alt="decor" className='group-led-light' src="/images/bgs/status-light.png" title={`Camera is ${el.active == 0 ? "off" : "active"}`} id={`stream-active-light-${el.id}`} style={{outlineOffset: '-1px', background: `${el.active == 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active == 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`}} />
                                  <div className='group-stream-name' style={{overflow: 'hidden'}}>
                                      <p className="group-cam-title stream-title" title={`${el.title}-{ID: #${el.id}}`} type='text'>{el.title}<b style={{fontSize: '12px', margin: '0 4px', color: 'darkgray'}}>{`ID:${el.id}`}</b></p>
                                  </div>
                                  <img loading='lazy' title={`${camtypetext[el.type]}`} src={`/images/16icons/${camtype[el.type]}.png`} alt='decor' className="type-image group-type-image" />
                              </div>
                              <div className='colored-box' style={{gridRow: 'span 2', width: 'calc(100% - 21px)', height: 'calc(100% - 11px)', aspectRatio: '1/1', borderStyle: 'inset', borderWidth: '4px', backgroundImage: `url(${el.thumblink}), url(/images/bgs/snowbackground.gif)`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                <div style={{height: '100%', width: '100%', background: 'repeating-linear-gradient(to top, rgba(255, 255, 255, 0.2) 0px 2px, transparent 2px 4px)', backdropFilter: `${el.active == 0 ? "grayscale(1)" : "grayscale(0)"}`}}></div>
                              </div>
                              <div className='handle' style={{position: 'absolute', alignItems: 'center', bottom: '10px'}}>
                                  <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src={`/images/bgs/handlebox-left${el.active === 2 ? "-gold" : ""}.png`}/>
                                  <p title={`${el.internalname}`} style={{height: '22px', margin: 0, backgroundImage: `url(/images/bgs/handlebox-center${el.active === 2 ? "-gold" : ""}.png)`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', lineHeight: '22px', color: '#3a5212'}}>{el.internalname}</p>
                                  <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src={`/images/bgs/handlebox-right${el.active === 2 ? "-gold" : ""}.png`}/>
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
            if (el.groupname !== null && el.groupname !== "0") {
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
                    const si = el
                    var newdata = {
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
            streamgroup.forEach((el, ind) => {
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
                  var newarr = [...streamgroup]
                  newarr[ind] = newdata
                  setStreamgroup(newarr)
              }
          })
          })    
          return () => socket.off('update_stream')
      }, [socket, streams, setStreams, streamgroup, setStreamgroup])
    
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
              <p style={{color: 'white', maxWidth: '180px'}}>Click on group titles to expand the folder, or click on a stream title/thumbnail to open it!</p>
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
                      <legend title='Click to expand.' style={{background: 'rgba(0,0,0,0.75)', maxWidth: '175px', textAlign: 'center', color: 'lime', cursor: 'pointer', textDecoration: 'underline', textShadow: '1px 1px 5px #000, -1px 1px 5px #000, -1px -1px 5px #000, 1px -1px 5px #000'}} onClick={() => toggleGroup(`group-default-${el.id}`)}><img style={{paddingRight: '5px'}} src={`${el.icon}`} alt="decor" width={'16px'} height={'16px'} />{el.title}</legend>
                    </fieldset>
                  )
                }) : null}
                {streams.length > 0 ? streams.map((el) => {
                    return (
                      <div key={el.id} className={`stream-box-container stream-box-${el.active}`} style={{overflow: 'hidden', marginBottom: '10px'}}>
                        <div id={`stream-${el.id}`} className='control-stream-box' style={{cursor: `${el.active == 0 ? 'default' : 'pointer'}`, alignItems: 'stretch'}} onClick={() => openStream(el)}>
                            <div id={`stream-thumb-${el.id}`} style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <img loading='lazy' src='/images/bgs/status-light.png' className='stream-status-light' alt={`Camera is ${el.active == 0 ? "off." : "active."}`} title={`Camera is ${el.active == 0 ? "off" : "active"}`} id={`stream-active-light-${el.id}`} style={{background: `${el.active == 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active == 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`, borderRadius: '50%'}} />
                                <div className='stream-title-container' style={{overflow: 'hidden', margin: '4px 9px'}}>
                                  <p className='stream-title' title={`${el.title}-{ID: #${el.id}}`} type='text'>{el.title}<b style={{fontSize: '12px', margin: '0 4px', color: 'darkgray'}}>{`ID:${el.id}`}</b></p>
                                </div>
                                <img loading='lazy' title={`${camtypetext[el.type]}`} src={`/images/16icons/${camtype[el.type]}.png`} alt='decor' className='type-image' />
                            </div>
                            <div className='colored-border' style={{gridRow: 'span 2', width: 'calc(100% - 16px)', height: 'calc(100% - 16px)', aspectRatio: '1/1', borderStyle: 'inset', borderWidth: '4px', backgroundImage: `url(${el.thumblink})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                              <div style={{height: '100%', width: '100%', background: 'repeating-linear-gradient(to top, rgba(255, 255, 255, 0.1) 0px 2px, transparent 2px 4px)', backdropFilter: `${el.active == 0 ? "grayscale(1)" : "grayscale(0)"}`}}></div>
                            </div>
                            <div className='handle' style={{position: 'absolute', alignItems: 'center', bottom: '12px'}}>
                              <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-left.png'/>
                              <p title={`${el.internalname}`} style={{height: '22px', margin: 0, backgroundImage: 'url(/images/bgs/handlebox-center.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', lineHeight: '22px', color: '#3a5212'}}>{el.internalname}</p>
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

    const StreamList = () => {
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

      const onDragStart = (e, el) => {
        e.dataTransfer.setData("test", el)
      }

      return (
        <div className='stream-list' style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', overflowY: 'scroll', margin: '10px', padding: '10px', outline: 'inset 3px', background: 'url(/images/bgs/logo-bg.png)', pointerEvents: 'all'}}>
          {streams.length > 0 ? streams.map((el) => {
            var isfeatured = el.active === 2 ? "-gold" : ""
              return (
                <div draggable onDragStart={(e) => onDragStart(e, JSON.stringify(el))} key={el.id} className='stream-list-container' style={{marginBottom: '10px'}}>
                  <div id={`stream-${el.id}`} className='control-stream-list' style={{cursor: `${el.active == 0 ? 'default' : 'grab'}`, alignItems: 'stretch'}}>
                      <div id={`stream-thumb-${el.id}`} style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', border: 'solid gray 1px', borderRadius: '3px', padding: '3px', background: 'rgba(125,125,125,0.4)'}}>
                          <img loading='lazy' src='/images/bgs/status-light.png' className='stream-status-light' alt={`Camera is ${el.active == 0 ? "off." : "active."}`} title={`Camera is ${el.active == 0 ? "off" : "active"}`} id={`stream-active-light-${el.id}`} style={{background: `${el.active == 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active == 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`, borderRadius: '50%'}} />
                          <div className='stream-title-container' style={{overflow: 'hidden', margin: '4px 9px', width: '100%'}}>
                            <p className='stream-title' title={`${el.title}-{ID: #${el.id}}`} type='text'>{el.title}<b style={{fontSize: '12px', margin: '0 4px', color: 'darkgray'}}>{`ID:${el.id}`}</b></p>
                          </div>
                          <img loading='lazy' title={`${camtypetext[el.type]}`} src={`/images/16icons/${camtype[el.type]}.png`} alt='decor' className='stream-status-light' />
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', bottom: '12px'}}>
                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src={`/images/bgs/handlebox-left-inverse${isfeatured}.png`}/>
                        <p title={`${el.internalname}`} style={{height: '22px', margin: 0, backgroundImage: `url(/images/bgs/handlebox-center-inverse${isfeatured}.png`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', lineHeight: '22px', color: '#3a5212'}}>{el.internalname}</p>
                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src={`/images/bgs/handlebox-right-inverse${isfeatured}.png`}/>

                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src={`/images/bgs/handlebox-left-inverse${isfeatured}.png`}/>
                        <p title={`${el.groupname}`} style={{height: '22px', margin: 0, backgroundImage: `url(/images/bgs/handlebox-center-inverse${isfeatured}.png)`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', lineHeight: '22px', color: '#3a5212', whiteSpace: 'nowrap'}}>Tag: {el.groupname}</p>
                        <img loading='lazy' alt="decor" height={'22px'} width={'7px'} src={`/images/bgs/handlebox-right-inverse${isfeatured}.png`}/>
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
        document.getElementById('multi-stream-container').style.gridTemplateColumns = `calc(${((e.pageX / window.innerWidth) * 100).toFixed(1)}% - 8px) 3px calc(${(100 - ((e.pageX / window.innerWidth) * 100)).toFixed(1)}% - 8px)`
      } 
    }
  
    const dragVSliderOne = (e) => {
      e.preventDefault()
      if (e.pageY !== 0) {
        document.getElementById('multi-stream-container').style.gridTemplateRows = `calc(${((e.pageY / e.target.offsetParent.clientHeight) * 100).toFixed(1)}% - 4px) 3px calc(${(100 - ((e.pageY / e.target.offsetParent.clientHeight) * 100)).toFixed(1)}% - 4px)`
      } 
    }

    const onDragOver = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const onDrop = (e, pos) => {
      openStreamMulti(JSON.parse(e.dataTransfer.getData("test")), pos)
    }

    const toggleSidePanel = () => {
      var ele = document.getElementById('stream-list-panel')
      if (ele.classList.contains('stream-list-active')) {
        ele.style.right = `${window.innerWidth - 250}px`
      } else {
        ele.style.right = `${window.innerWidth - 40}px`
      }
      ele.classList.toggle('stream-list-active')
      document.getElementById('stream-list-toggle').classList.toggle('invert-img')
    }

    const closeMultiStream = (pos, close) => {
      if (close) {
        toggleSidePanel()
      }
      var newarr = [...activestream]
      newarr[pos] = null
      setActiveStream(newarr)
    }

    const editMultiStream = (pos) => {
      var link = document.getElementById(`url-set-activestream${pos}`).value
      var newarr = [...activestream]
      newarr[pos] = {link: `${link}`, title: `Custom Stream ${pos}`}
      setActiveStream(newarr)
    }

    return (
      <>
        {activestream[0] !== null ?
          <div id='single-stream' style={{height: 'calc(100% - 20px)'}}>
            <div style={{position: 'absolute'}}>
              <img src='/images/16icons/x-button.png' id='close-stream-button' width={'32px'} height={'32px'} alt='close stream' onClick={() => closeStream()} style={{cursor: 'pointer'}} />
              <img src='/images/16icons/multi-button.png' className='mobile-hide' width={'32px'} height={'32px'} alt='open multi-stream' onClick={() => toggleMulti()} style={{cursor: 'pointer'}} />
            </div>
              {multistream ? 
                <>
                  <div id='multi-stream-container' style={{display: 'grid', gridTemplateColumns: 'calc(50% - 8px) 3px calc(50% - 8px)', gridTemplateRows: 'calc(50% - 4px) 3px calc(50% - 4px)', height: '103%', gap: '5px'}}>
                    <div style={{position: 'absolute', overflow: 'hidden', top: 'auto', left: 'auto', height: '100%', width: '100%', zIndex: 500, pointerEvents: 'none'}}>
                      <div id='stream-list-panel' style={{position: 'absolute', right: `${window.innerWidth - 250}px`, width: '250px', height: '87%', overflow: 'hidden', display: 'flex', alignItems: 'center', transition: '0.4s ease'}}>
                        <StreamList/>
                        <img id='stream-list-toggle' src='/images/16icons/stream-panel-button.png' onClick={() => toggleSidePanel()} className='mobile-hide' width={'32px'} height={'32px'} alt='close stream' style={{cursor: 'pointer', pointerEvents: 'all'}} />
                      </div>
                    </div>
                    <Stream stream={activestream[0]} />
                    
                    {activestream[1] !== null ?                     <div>
                      <div style={{position: 'absolute', background: 'rgba(0,0,0,0.5)', display: 'flex'}}>
                        <img style={{cursor: 'pointer'}} onClick={() => closeMultiStream(1, true)} src='/images/16icons/singlestream-play.png' width={'24px'} height={'24px'} alt='Clear stream and open drag and drop menu' />
                        <img style={{cursor: 'pointer'}} onClick={() => closeMultiStream(1, false)} src='/images/16icons/singlestream-x.png' width={'24px'} height={'24px'} alt='Clear stream' />
                      </div>
                      <Stream stream={activestream[1]} />
                    </div> : <div className='empty-stream-container' onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, 1)}><p>Drag and drop a stream from the left panel</p></div>}
                    
                    <div draggable className='grid-slider' style={{gridRowStart: 1, gridRowEnd: 4, gridColumn: 2, border: 'blue 1px dashed', height: '100%', cursor: 'ew-resize'}}
                    onDrag={(e) => dragHSliderOne(e)}
                    ></div>

                    {activestream[2] !== null ? 
                    <div>
                      <div className='op-low' style={{position: 'absolute', background: 'rgba(0,0,0,0.5)', display: 'flex'}}>
                        <img title='Exit stream.' style={{cursor: 'pointer'}} onClick={() => closeMultiStream(2, true)} src='/images/16icons/singlestream-play.png' width={'24px'} height={'24px'} alt='Clear stream and open drag and drop menu' />
                        <img title='Exit stream and open stream list.' style={{cursor: 'pointer'}} onClick={() => closeMultiStream(2, false)} src='/images/16icons/singlestream-x.png' width={'24px'} height={'24px'} alt='Clear stream' />
                        <div style={{display: 'flex', borderRadius: '4px', border: 'solid 1px gray'}}>
                          <img title='Edit link to right, then click this button to update the stream.' style={{cursor: 'pointer'}} onClick={() => editMultiStream(2)} src='/images/16icons/singlestream-url.png' width={'24px'} height={'24px'} alt='Change stream url' />
                          <input id='url-set-activestream2' defaultValue={`${activestream[2]?.link}`} style={{border: 'solid black 1px', background: 'transparent', color: 'steelblue'}} />
                        </div>
                      </div>
                      <Stream stream={activestream[2]} />
                    </div> : <div className='empty-stream-container' onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, 2)}><p>Drag and drop a stream from the left panel</p></div>}
                    
                    {activestream[3] !== null ?                     <div>
                      <div style={{position: 'absolute', background: 'rgba(0,0,0,0.5)', display: 'flex'}}>
                        <img style={{cursor: 'pointer'}} onClick={() => closeMultiStream(3, true)} src='/images/16icons/singlestream-play.png' width={'24px'} height={'24px'} alt='Clear stream and open drag and drop menu' />
                        <img style={{cursor: 'pointer'}} onClick={() => closeMultiStream(3, false)} src='/images/16icons/singlestream-x.png' width={'24px'} height={'24px'} alt='Clear stream' />
                      </div>
                      <Stream stream={activestream[3]} />
                    </div> : <div className='empty-stream-container' onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e, 3)}><p>Drag and drop a stream from the left panel</p></div>}
                    
                    <div draggable className='grid-slider' style={{gridColumnStart: 1, gridColumnEnd: 4, gridRow: 2, border: 'blue 1px dashed', height: '100%', cursor: 'ns-resize'}}
                    onDrag={(e) => dragVSliderOne(e)}
                    ></div>
                  </div>
                </>
              : <Stream stream={activestream[0]} />}
          </div>
        : <Streams/>}
      </>
    )
  }

    return (
      <div id='main-sliding-container' className="feeds-container sliding-expanded">
        <StreamContainer/>

        <div style={{gridRow: 2}} className="left-section" id='bottom-panel'>
            
        </div>
      </div>
    )
  }

  const Featured = () => {

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
          "scrolling": ["Connecting", " to ", "server"],
          "threat": "none",
          "outlook": "marginal",
          "area": "midwest"
        })
    
        useEffect(() => {
          socket.emit('sync_status')
          socket.emit('sync_description')
        }, [socket])
    
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
              var newscroll = data[0].text.split(",")
              setDesc({
                "scrolling": newscroll,
                "threat": data[4].text,
                "outlook": data[6].text,
                "area": data[7].text,
                "recentChange": 0,
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
                  "recentChange": desc.lastUpdate,
                  "outlook": desc.outlook,
                  "area": desc.area,
                  [`${vals[data.title]}`]: data.newtext
              }
              setDesc(newarr, setTimeout(() => {
                var newarr = {
                  "scrolling": desc.scrolling,
                  "qrd": desc.qrd,
                  "desc": desc.desc,
                  "threat": desc.threat,
                  "outlook": desc.outlook,
                  "area": desc.area,
                  "recentChange": 10,
                  [`${vals[data.title]}`]: data.newtext
                }
                setDesc(newarr)
              }, [2500]))
            })
            return () => socket.off('update_desc')
        }, [socket, desc, setDesc])

    return (
      <div style={{height: '97%', zIndex: '20', display: 'flex', flexDirection: 'column'}} className="description-section">
        <div className='logo-container' style={{gridColumn: 1, gridRow: 1, width: '100%', flexDirection: 'column'}}>
          <div style={{background: 'url(/images/bgs/skull-logo-final.png)', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <h1 style={{fontFamily: 'blurpix', color: 'white', margin: 0, textShadow: '3px 1px 3px black', fontSize: '300%', fontStyle: 'italic', fontWeight: 400, textAlign: 'center'}}>SHEPARDESS</h1>
          </div>
        </div>
        <div className="status-indicators" style={{justifyContent: 'space-between'}}>
            <img loading='lazy' className={`${desc?.recentChange === 6 ? "updated" :  ""}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/" + desc.outlook + "-notitle.webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/" + desc.outlook + ".webp"}`} 
            src={`${"/images/lights/" + desc.outlook + ".webp"}`} width="100%" alt={`SPC has issued a ${desc.outlook} risk today.`} />

            <img loading='lazy' className={`${desc?.recentChange === 7 ? "updated" :  ""}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/" + desc.area + "-notitle.webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/" + desc.area + ".webp"}`} 
            src={`${"/images/lights/" + desc.area + ".webp"}`} width="100%" alt={`Todays risk is primarily in the ${desc.area} reigon(s).`} />

            <img loading='lazy' className={`${desc?.recentChange === 4 ? "updated" :  ""}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/" + desc.threat + "-notitle.webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/" + desc.threat + ".webp"}`} 
            src={`${"/images/lights/" + desc.threat + ".webp"}`} width="100%" alt={`todays threat type: ${desc.threat} threat.`} />

            <img loading='lazy' className={`${stat?.chaseday ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${stat?.chaseday ? "/images/lights/derecho-notitle.webp" :  "/images/lights/chaseday-off.webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/chaseday" + (stat?.chaseday ? "" : "-off") + ".webp"}`} 
            src={`${"/images/lights/chaseday" + (stat?.chaseday ? "" : "-off") + ".webp"}`} width="100%" alt="status light for it being a chase day" />

            <img loading='lazy' className={`${stat?.traveling ? "updated" :  "off"} hidden-indicators`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/traveling" + (stat?.traveling ? "-notitle" : "-off") + ".webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/traveling" + (stat?.traveling ? "" : "-off") + ".webp"}`} 
            src={`${"/images/lights/traveling" + (stat?.traveling ? "" : "-off") + ".webp"}`} width="100%" alt="status light for traveling" />

            <img loading='lazy' className={`${stat?.chasing ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/chasing" + (stat?.chasing ? "-notitle" : "-off") + ".webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/chasing" + (stat?.chasing ? "" : "-off") + ".webp"}`} 
            src={`${"/images/lights/chasing" + (stat?.chasing ? "" : "-off") + ".webp"}`} width="100%" alt="status light for chasing" />

            <img loading='lazy' className={`${stat?.onhold ? "updated" :  "off"} hidden-indicators`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/onhold" + (stat?.onhold ? "-notitle" : "-off") + ".webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/onhold" + (stat?.onhold ? "" : "-off") + ".webp"}`} 
            src={`${"/images/lights/onhold" + (stat?.onhold ? "" : "-off") + ".webp"}`} width="100%" alt="status light for being on hold" />

            <img loading='lazy' className={`${stat?.ending ? "updated" :  "off"} hidden-indicators`} 
            onMouseEnter={(e) => e.currentTarget.src = `${"/images/lights/ending" + (stat?.ending ? "-notitle" : "-off") + ".webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/ending" + (stat?.ending ? "" : "-off") + ".webp"}`} 
            src={`${"/images/lights/ending" + (stat?.ending ? "" : "-off") + ".webp"}`} width="100%" alt="status light for ending the chase" />

            <img loading='lazy' className={`${stat?.emergency ? "updated" :  "off"}`} 
            onMouseEnter={(e) => e.currentTarget.src = `${stat?.emergency ? "/images/lights/emergency-notitle.webp" :  "/images/lights/emergency-off.webp"}`} 
            onMouseLeave={(e) => e.currentTarget.src = `${"/images/lights/emergency" + (stat?.emergency ? "" : "-off") + ".webp"}`} 
            src={`${"/images/lights/emergency" + (stat?.emergency ? "" : "-off") + ".webp"}`} width="100%" alt="status light for emergency" />
        </div>
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
      <div className='qrd-section' style={{overflow: 'scroll', height: '97%', zIndex: '20', minHeight: '200px', background: 'url(/images/bgs/BlackThatch.png)', border: 'outset 3px', outline: 'black 1px solid', outlineOffset: '-1px'}}>
        <div className='description-banner'>
            <img loading='lazy' src='/images/bgs/opendir.gif' alt='decor' style={{margin: '0 8px 0 4px'}} width={'18px'} height={'18px'} /><p style={{}}>INFO</p>
        </div>
        <div style={{padding: '4px'}}>
                <div className='description-qrd'>
                    <h4 style={{}}>
                        <img loading='lazy' src={`${desc?.qrd?.split('|')[1]}`} style={{maxWidth: '32px', maxHeight: '32px'}} alt='qrd decor'/>
                        {desc?.qrd?.split('|')[0]}
                    </h4>
                </div>
            <hr style={{height: '1px', borderBottom: 'solid 1px white'}} />
            <div className='description-full'>
                <p style={{}}>
                  {desc?.full?.split('|')[0]}
                  <br/>
                  <img loading='lazy' src={`${desc?.full?.split('|')[1]}`} alt='description decor'/>
                </p>
            </div>
        </div>
    </div>
    )
  }

  const SitePopup = () => {
    const [popup, setPopup] = useState({
      "popup": {"popup": "tornado", "id": 0},
      "active": false
    })

    useEffect(() => {
      socket.on('receive_popup', (data) => {
        console.log(data)
        setPopup({
          active: true,
          "popup": data
        })
      })
  
      return () => socket.off('receive_popup')
    }, [socket])

    useEffect(() => {
      if (popup.active) {
        sendNotifiation()
      }
    }, [popup, setPopup])

    const sendNotifiation = () => {
      if (!("Notification" in window)) {
        console.log('notifications not supported in this browser type')
      } else if (Notification.permission === "granted") {
        const notification = new Notification(`${popupWarnings[popup.popup.popup]}`, {title: `${popup.popup.popup}`, icon: `/images/popups/popup-${popup.popup.popup}.gif`});
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(`${popupWarnings[popup.popup.popup]}`, {title: `${popup.popup.popup}`, icon: `/images/popups/popup-${popup.popup.popup}.gif`});
          }
        });
      }
    }    

    return (
      <div style={{position: 'fixed', width: '100%', top: '15vh', left: '30vw', display: `${popup.active ? "block" : "none"}`, zIndex: '519'}}>
        <div style={{display: 'grid', gridTemplateColumns: '50% 50%', gridTemplateRows: '28px calc(100% - 28px)', border: 'outset 3px', boxShadow: '3px 3px 5px 0 black', width: '50%', background: 'lightgray'}}>
          <div className='description-banner' style={{gridColumn: 'span 2'}}>
            <img style={{padding: '0 4px'}} alt='decor' src='/images/bgs/skull-logo-mini.png' width={'18px'} height={'18px'} />
            <p style={{}}>URGENT UPDATE: {popup.popup.popup.toUpperCase()}</p>
          </div>
          <img loading='lazy' src={`/images/popups/popup-${popup.popup.popup}.gif`} style={{zIndex: '20', aspectRatio: '1/1', gridRow: 2}} alt={`${popupWarnings[popup.popup.popup]}`} title={`${popupWarnings[popup.popup.popup]}`} />
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p style={{}}>{popupWarnings[popup.popup.popup]}</p>
            <div style={{display: 'flex'}}>
              <button style={{border: 'outset 3px', outline: '1px solid black', margin: '1px', cursor: 'pointer'}} onClick={() => document.getElementById(`stream-${popup.popup.id}`).click()}>OPEN STREAM</button>
              <button style={{border: 'outset 3px', outline: '1px solid black', margin: '1px', cursor: 'pointer'}} onClick={() => setPopup({active: false, "popup": popup.popup})}>CLOSE ALERT</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Tutorial = () => {
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
      if ((newnum) >= 7) {
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

    return (
      <>
        <img src='/images/stopwatchrotate.webp' width={'64px'} height={'64px'} alt='decor' className='stopwatch' />
        {tutorial.active ?
          <div className='mobile-hide' style={{position: 'fixed', width: '100%', height: '100%', zIndex: 500}}>
            <div style={{position: 'absolute', top: 0, backdropFilter: 'saturate(0) brightness(0.8) sepia(0.7)', width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(20, 5%)', gridTemplateRows: 'repeat(20, 5%)'}}>
              <img loading='lazy' className='hazel' style={{gridRowStart: `${tutorial.gridhazel[1][0]}`, gridRowEnd: `${tutorial.gridhazel[1][1]}`, gridColumnStart: `${tutorial.gridhazel[0][0]}`, gridColumnEnd: `${tutorial.gridhazel[0][1]}`}} src='/images/hazel.png' height={'128px'} alt='Hazel' />
              <div style={{backgroundImage: 'url(/images/bubble.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', gridRowStart: `${tutorial.gridbubble[1][0]}`, gridRowEnd: `${tutorial.gridbubble[1][1]}`, gridColumnStart: `${tutorial.gridbubble[0][0]}`, gridColumnEnd: `${tutorial.gridbubble[0][1]}`, marginBottom: '-10px', overflowY: 'scroll'}}>
                <p className='tutorial-text' style={{padding: '20px 12px 0px 12px', margin: 0, marginBottom: '10px'}}>{tutorial.text}</p>
              </div>
              <button style={{gridColumnStart: `${tutorial.gridbutton[0][0]}`, gridColumnEnd: `${tutorial.gridbutton[0][1]}`, gridRow: `${tutorial.gridbutton[1][0]}`, backgroundImage: 'url(/images/bgs/play.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', color: 'white'}} onClick={() => tutorialAdvance()}>Continue!</button>
              <button style={{gridColumnStart: 12, gridColumnEnd: 14, gridRow: 13, backgroundImage: 'url(/images/bgs/play.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', color: 'white'}} onClick={() => tutorialSkip()}>Skip</button>
            </div>
          </div>
        : null}
      </>
    )
  }

  const LeftBox = () => {

    const [panel, setPanel] = useState("map")

    const openPanel = (pane) => {
      if (pane === panel) {
        document.getElementById('left-viewer').classList.toggle('viewer-expanded')
      } else {
        setPanel(pane)
        document.getElementById('left-viewer').classList.add('viewer-expanded')
      }
    }

    return (
      <div className="left-box" style={{border: 'blue 1px dashed', height: '100%'}}>
        <div className="left-buttons" style={{flexDirection: 'column', alignItems: 'center'}}>
          <img loading='lazy' className='expand-button left-expand' alt='expand' src='/images/16icons/up-button.png' title='Expand/Contract bottom container.' style={{pointerEvents: 'all', cursor: 'pointer'}} onClick={() => document.getElementById('left-viewer').classList.toggle('viewer-expanded')} />
          <button onClick={() => openPanel("map")} >Map <img loading='lazy' alt='decor icon' src='/images/16icons/map.png' className='left-button-icon'/></button>
          <button onClick={() => openPanel("past")} >Past <img loading='lazy' alt='decor icon' src='/images/16icons/past.png' className='left-button-icon'/></button>
          <button onClick={() => openPanel("social")} >Social <img loading='lazy' alt='decor icon' src='/images/16icons/social.png' className='left-button-icon'/></button>
          <button id='about-button' onClick={() => openPanel("contact")} >About+ <img loading='lazy' alt='decor icon' src='/images/16icons/contact.png' className='left-button-icon'/></button>
        </div>
        <div id='left-viewer' style={{position: 'absolute', zIndex: '10'}} className="left-viewer">
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

  return (
    <div className="App">
      <Tutorial/>
      <SitePopup/>
      <div id='main-container' className="main-container">

        <div className="top-header" id='status-highlight'>
          <div className="scrolling-text-div">
            <Suspense>
              <Status/>
            </Suspense>
          </div>
        </div>

        <LeftBox/>
        <CenterPanel/>

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
