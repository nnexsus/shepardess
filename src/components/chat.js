import { useEffect, useRef, useState } from "react";

import emotes from '../css/emotes.json';

import '../css/chat.css';

const Chat = ({ socket, username, streams }) => {
    const InputMessage = () => {
        const [activePanel, setActivePanel] = useState('emote')
        const [newmessage, setNewmessage] = useState('')
        const [effects, setEffects] = useState({
            "color": "lightgreen",
            "font": "ms ui gothic",
            "effect": "none",
            "effectColor": "none"
        })

        const sendMessage = () => {
            if (newmessage !== '' && newmessage !== null) {
                const __createdtime__ = Date.now()
                socket.emit('send_message', {'username': `${username}`, 'message': newmessage, '__createdtime__': __createdtime__, 'effects': JSON.stringify(effects)})
                setNewmessage('')
            }
        }
        
        const Emote = () => {
            const addEmote = (path) => {
                updateMessage(newmessage + ` <${path}> `)
            }
            return (
                <div style={{display: 'flex', overflowX: 'hidden', overflowY: 'scroll', maxWidth: '100%', flexWrap: 'wrap', border: 'inset 3px', backgroundImage: 'url(/images/bgs/BlackThatch.png)', padding: '3px', imageRendering: 'auto'}}>
                    {emotes.emotes.map((el, ind) => {
                        return (
                            <img loading='lazy' key={`emoji-${ind}`} className="emote-select" alt="emote" src={`/images/emotes/${el.path}`} width={'16px'} height={'16px'} onClick={() => addEmote(`${el.path}`)} title={`${el.name}`}/>
                        )
                    })}
                </div>
            )
        }
    
        const Effects = () => {
            return (
                <div style={{display: 'flex', flexDirection: 'column', overflowX: 'hidden', overflowY: 'scroll', maxWidth: '100%', border: 'inset 3px', backgroundImage: 'url(/images/bgs/BlackThatch.png)', padding: '3px'}}>
                    <label style={{color: 'white'}} htmlFor="input-fontcolor">Color:</label>
                    <select id="input-fontcolor" defaultValue={'lightgreen'} value={effects.color} onChange={(e) => setEffects({"color": e.currentTarget.value, "font": effects.font, "effect": effects.effect, "effectColor": effects.effectColor})}>
                        <option className="format-dropdown" value={'springgreen'} style={{color: 'springgreen'}}>B-Green</option>
                        <option className="format-dropdown" value={'yellow'} style={{color: 'yellow'}}>Yellow</option>
                        <option className="format-dropdown" value={'orange'} style={{color: 'orange'}}>Orange</option>
                        <option className="format-dropdown" value={'red'} style={{color: 'red'}}>Red</option>
                        <option className="format-dropdown" value={'rebeccapurple'} style={{color: 'rebeccapurple'}}>Purple</option>
                        <option className="format-dropdown" value={'aqua'} style={{color: 'aqua'}}>Blue</option>
                        <option className="format-dropdown" value={'cyan'} style={{color: 'cyan'}}>Cyan</option>
                        <option className="format-dropdown" value={'lime'} style={{color: 'lime'}}>Green</option>
                    </select>
                    <label style={{color: 'white'}} htmlFor="input-fonttype">Font:</label>
                    <select id="input-fonttype" defaultValue={'ms ui gothic'} value={effects.font} onChange={(e) => setEffects({"color": effects.color, "font": e.currentTarget.value, "effect": effects.effect, "effectColor": effects.effectColor})}>
                        <option className="format-dropdown" value={'ms ui gothic'} style={{color: 'white', fontFamily: 'ms ui gothic'}}>ms ui gothic</option>
                        <option className="format-dropdown" value={'blurpix'} style={{color: 'white', fontFamily: 'blurpix'}}>blurpix</option>
                        <option className="format-dropdown" value={'cursive'} style={{color: 'white', fontFamily: 'cursive'}}>Comic Sans</option>
                        <option className="format-dropdown" value={'monospace'} style={{color: 'white', fontFamily: 'monospace'}}>Monospace</option>
                        <option className="format-dropdown" value={'fantasy'} style={{color: 'white', fontFamily: 'fantasy'}}>Fantasy</option>
                    </select>
                    <label style={{color: 'white'}} htmlFor="input-effect">Decor:</label>
                    <select id="input-effect" defaultValue={'none'} value={effects.effect} onChange={(e) => setEffects({"color": effects.color, "font": effects.font, "effect": e.currentTarget.value, "effectColor": effects.effectColor})}>
                        <option className="format-dropdown" value={'none'} style={{color: 'white'}}>None</option>
                        <option className="format-dropdown" value={'underline'} style={{color: 'white', textDecoration: 'underline'}}>Underline</option>
                        <option className="format-dropdown" value={'overline'} style={{color: 'white', textDecoration: 'overline'}}>Overline</option>
                        <option className="format-dropdown" value={'underline wavy'} style={{color: 'white', textDecoration: 'underline wavy'}}>Wavy-U</option>
                        <option className="format-dropdown" value={'overline wavy'} style={{color: 'white', textDecoration: 'underline wavy'}}>Wave-O</option>
                    </select>
                    <label style={{color: 'white'}} htmlFor="input-effectColor">Color:</label>
                    <select id="input-effectColor" defaultValue={'lightgreen'} value={effects.effectColor} onChange={(e) => setEffects({"color": effects.color, "font": effects.font, "effect": effects.effect, "effectColor": e.currentTarget.value})}>
                        <option className="format-dropdown" value={'lightgreen'} style={{color: 'springgreen'}}>B-Green</option>
                        <option className="format-dropdown" value={'yellow'} style={{color: 'yellow'}}>Yellow</option>
                        <option className="format-dropdown" value={'orange'} style={{color: 'orange'}}>Orange</option>
                        <option className="format-dropdown" value={'red'} style={{color: 'red'}}>Red</option>
                        <option className="format-dropdown" value={'rebeccapurple'} style={{color: 'rebeccapurple'}}>Purple</option>
                        <option className="format-dropdown" value={'aqua'} style={{color: 'aqua'}}>Blue</option>
                        <option className="format-dropdown" value={'cyan'} style={{color: 'cyan'}}>Cyan</option>
                        <option className="format-dropdown" value={'lime'} style={{color: 'lime'}}>Green</option>
                    </select>
                </div>
            )
        }
    
        const panels = {
            "emote": Emote,
            "effects": Effects
        }
    
        var Panel = panels[activePanel];

        const updateMessage = (value) => {
            document.getElementById("message-input").style.color = `rgb(${value.length * 1.2}, ${255 - (value.length * 1.2)}, 0)`
            if (value.length <=  255) {
                setNewmessage(value)
            }
        }

        return (
            <div className="message-write">
                <div className="message-input" style={{display: 'flex', margin: '3px', outline: '1px black solid'}}>
                    <input id="message-input" style={{width: 'calc(100% - 12px)', height: '35px', backgroundImage: 'url(/images/bgs/BlackThatch.png)', border: 'inset 3px', borderRight: 'none', fontFamily: 'ms ui gothic'}} type="text" placeholder="Message" value={newmessage} onChange={(e) => updateMessage(e.currentTarget.value)} />
                    <button style={{width: '42px', height: '42px', cursor: 'pointer', backgroundImage: 'url(/images/16icons/arrow.gif)', backgroundSize: 'cover', border: 'inset 3px', borderLeft: 'none', fontFamily: 'ms ui gothic'}} onClick={() => sendMessage()}><b style={{textShadow: '0px 0px 2px white'}}>Send</b></button>
                </div>
                <div className="emote-panel-select" style={{display: 'flex', margin: '3px', outline: '1px black solid'}}>
                    <img loading='lazy' alt="decor" style={{border: 'outset 3px', background: 'black', cursor: 'pointer'}} src="/images/16icons/emote.gif" width={'16px'} height={'16px'} onClick={() => setActivePanel('emote')} />
                    <img loading='lazy' alt="decor" style={{border: 'outset 3px', background: 'black', cursor: 'pointer'}} src="/images/16icons/font.png" width={'16px'} height={'16px'} onClick={() => setActivePanel('effects')} />
                </div>
                <div className="emote-panel-active" style={{display: 'flex', flexDirection: 'column', margin: '3px', height: '40%'}}>
                    <Panel/>
                </div>
            </div>
        )
    }


    const Messages = ({ socket }) => {
        const [streams, setStreams] = useState([])
        const [messages, setMessages] = useState([])
        const messageContainer = useRef(null)

        useEffect(() => {
            messageContainer.current.scrollTop = messageContainer.current.scrollHeight
        }, [messages])

        useEffect(() => {
            socket.on('receive_message', (data) => {
                const d = new Date(data.__createdtime__)
                const date = `${d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "T" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds() + "Z"}`
                setMessages((state) => [
                    ...state,
                    {
                        text: data.message,
                        author: data.username,
                        created: date,
                        new: true,
                        effects: data.effects
                    }
                ]);
            });
    
            return () => socket.off('receive_message')
            
        }, [])
    
        useEffect(() => {
            socket.on('last_100_messages', (data) => {
                var arr = data.reverse()
                setMessages((state) => [...arr, ...state]);
            });
    
            return () => socket.off('last_100_messages')
        }, [socket])

        useEffect(() => {
            socket.on('set_stream', (data) => {
              setStreams(data)
            })
      
            return () => socket.off('set_stream')
        }, [socket, streams, setStreams])

        const attemptOpenStream = (reference) => {
            var obj = document.getElementById(`stream-${reference.id}`)
            if (obj !== null) {
                obj.click()
            } else {
                document.getElementById('close-stream-button').click()
                setTimeout(() => {
                    document.getElementById(`stream-${reference.id}`).click()
                }, [500])
            }
        }

        return (
            <div className="message-container-wrapper" ref={messageContainer}>
                {messages.map((el, ind) => {
                    const date = el.created.toString().split("T")[0].substring(5)
                    const titledate = el.created.toString().split("T")[0].substring(5) + "  ///  " + el.created.toString().split("T")[1].substring(0, 8)

                    const extractTextBetweenTags = (inputString) => {
                    const regex = /<([^>]+)>/g;
                    const matches = inputString.match(regex);

                    if (matches) {
                        return matches.map(match => match.slice(1, -1));
                    } else {
                        return "";
                    }
                    }

                    function removeTextBetweenTags(inputString) {
                        const regex = /<[^>]+>/g;
                        return inputString.replace(regex, ',');
                    }

                    const extractTextBetweenReferences = (inputString) => {
                    const regex = /#\w+/g;
                    const matches = inputString.match(regex);

                    if (matches) {
                        return matches;
                    } else {
                        return false;
                    }
                    }

                    function filterById(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];}

                    var texts = removeTextBetweenTags(el.text)?.split(",")
                    var imgs = extractTextBetweenTags(el.text)
                    var reference = filterById(streams, extractTextBetweenReferences(el.text).toString().substring(1))

                    var effects = el.effects !== undefined ? JSON.parse(el?.effects) : {}
                    var color = effects?.color ? effects.color : 'lightgreen'
                    var font = effects?.font ? effects.font : 'ms ui gothic'
                    var decor = effects?.effect ? `${effects.effect + " " + effects.effectColor}` : 'none'

                    return (
                        <div className={`message-container ${el.new === true ? "new-message" : "old-message"}`} key={`message-${ind}`}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'url(/images/bgs/bordertest.png)', backgroundSize: '100% 100%'}}>
                                <img loading='lazy' alt="decor" style={{margin: '0 5px'}} src={`/images/16icons/${el.author === 'ShepardessBot' ? "hazel.png" : "avatar.png"}`} width={'24px'} height={'24px'} />
                                <p title={`${el.author}`} className="message-author" style={{color: `${el.author === 'ShepardessBot' ? "yellow" : "red"}`, margin: '0 4px', backgroundImage: 'url(/images/bgs/BlackThatch.png)', fontWeight: 700, padding: '0 2px', overflow: 'hidden', textOverflow: 'ellipsis', outline: `${el.author === 'ShepardessBot' ? "yellow" : "red"} solid 1px`}}>{el.author}</p>
                                <p className="message-author" style={{margin: '0 4px'}}><i title={`${titledate}`} style={{fontSize: '8px', color: 'aliceblue', margin: '0 8px 0 0', textDecoration: 'underline'}}>{date}</i></p>
                            </div>
                            <p className="message-message" style={{color: `${color}`, fontFamily: `${font}`, padding: '6px 6px 6px 8px', textDecoration: `${decor}`, fontStyle: `${el.author === 'ShepardessBot' ? "italic" : "normal"}`, backgroundImage: 'url(/images/bgs/test-container.png', backgroundPosition: 'center', backgroundSize: '100% 100%'}}>
                                {texts.map((el, ind) => {
                                    var img = (imgs.length >= ind + 1)
                                    return (
                                        <span key={`emote-${ind}`}>{el}{img ? <img loading='lazy' className="image-render" alt="emote" style={{margin: '0 3px', width: '16px', height: '16px'}} src={`/images/emotes/${imgs[ind]}`} /> : null}</span>
                                    )
                                })}
                            </p>
                            {reference ? 
                                <div style={{outline: '1px solid blue', outlineOffset: '-8px', backgroundImage: 'url(/images/bgs/bordertest3.png)', backgroundSize: '100% 100%'}}>
                                    <p style={{margin: '12px', outline: '2px inset lightblue', padding: '2px', background: 'black'}}><a style={{color: 'lightblue', cursor: 'pointer'}} 
                                    onClick={() => attemptOpenStream(reference)}>Streamlink: {reference.title}</a></p>
                                </div>
                            : null}
                            <div style={{width: '100%', height: '9px', backgroundImage: 'url(/images/bgs/bordertest2.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}}>

                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const Online = ({ socket }) => {
        const [users, setUsers] = useState(0)

        useEffect(() => {
            socket.on('chatroom_users', (data) => {
                setUsers(data);
            });
            return () => socket.off('chatroom_users')
        }, [])    
        return (
            <div style={{height: '10%', backgroundImage: 'url(/images/bgs/bluesteel_widecontainer.png', backgroundSize: "100% 100%", padding: '0 7px', backgroundRepeat: 'no-repeat', display: 'flex', alignItems: 'center'}}>
                <h4 style={{width: '100%', textAlign: 'center', fontSize: '18px', color: 'darkslategray'}}>Online: </h4>
                <p style={{fontFamily: 'dotty', fontSize: '30px', color: 'lime', textShadow: '0 0 4px lime', backgroundImage: 'url(/images/bgs/BlackThatch.png)', border: 'inset 3px', margin: 0, padding: '5px', width: 'calc(100% + 42px)'}}>{users}</p>
            </div>
        )
    }

    return (
        <div className='chat-section'>
            <Online socket={socket}/>
            <div className="chat-full-container">
                <Messages socket={socket}/>
            </div>
            <InputMessage/>
        </div>
    )
}

export default Chat;