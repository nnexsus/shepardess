import { useEffect, useRef, useState } from "react";

import '../css/chat.css';

const Chat = ({ socket }) => {
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

        const addEmbed = (link) => {
            document.getElementById(`load-${link}`).remove()
            var div = document.getElementById(`div-${link}`)
            var ele = document.createElement('iframe')
            ele.setAttribute('src', `${link}`)
            ele.setAttribute('width', '100%')
            ele.setAttribute('height', '140px')
            ele.setAttribute('title', `${link}`)
            div.appendChild(ele)
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
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'url(/images/bgs/bordertest.png)', backgroundSize: '100% 100%', height: '41px'}}>
                                <img loading='lazy' alt="decor" style={{margin: '0 5px'}} src={`/images/16icons/${el.author === 'ShepardessBot' ? "hazel.png" : "avatar.png"}`} width={'24px'} height={'24px'} />
                                <p title={`${el.author}`} className="message-author" style={{color: `${el.author === 'ShepardessBot' ? "yellow" : "red"}`, margin: '0 4px', backgroundImage: 'url(/images/bgs/BlackThatch.png)', fontWeight: 700, padding: '0 2px', overflow: 'hidden', textOverflow: 'ellipsis', outline: `${el.author === 'ShepardessBot' ? "yellow" : "red"} solid 1px`}}>{el.author}</p>
                                <p className="message-author" style={{margin: '0 4px'}}><i title={`${titledate}`} style={{fontSize: '8px', color: 'aliceblue', margin: '0 8px 0 0', textDecoration: 'underline'}}>{date}</i></p>
                            </div>
                            <p className="message-message" style={{color: `${color}`, fontFamily: `${font}`, padding: '6px 6px 6px 8px', overflowWrap: 'anywhere', textDecoration: `${decor}`, fontStyle: `${el.author === 'ShepardessBot' ? "italic" : "normal"}`, backgroundImage: 'url(/images/bgs/test-container.png)', backgroundPosition: 'center', backgroundSize: '100% 100%'}}>
                                {texts.map((el, ind) => {
                                    var img = (imgs.length >= ind + 1)
                                    return (
                                        <span key={`emote-${ind}`}>{el}{img ? <img loading='lazy' className="image-render" alt="emote" style={{margin: '0 3px', width: '16px', height: '16px'}} src={`/images/emotes/${imgs[ind]}`} /> : null}</span>
                                    )
                                })}
                            </p>
                            {(el?.embed !== undefined && el?.embed !== null) ? 
                                <div className="message-message message-embed" style={{backgroundImage: 'url(/images/bgs/test-container.png', backgroundPosition: 'center', backgroundSize: '100% 100%'}}>
                                    <div style={{width: 'calc(100% - 24px)', margin: '7px', padding: '2px', background: 'darkblue', border: 'inset 2px', outline: 'solid black 1px', outlineOffset: '1px', overflow: 'hidden'}}>
                                        <p style={{overflowWrap: 'anywhere', color: 'white', margin: '3px'}}><b>{el.embed.split("|")[0]}</b></p>
                                        <p style={{overflowWrap: 'anywhere', color: 'lightgray', margin: '1px'}}>{el.embed.split("|")[1]}</p>
                                        <hr style={{color: 'black', margin: '2px'}} />
                                        {el.image ?
                                            <div id={`div-${el.image}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '2px'}}>
                                                <a target="_blank" href={`${el.image}`} rel="noreferrer">
                                                    <p style={{margin: 0, padding: 0, color: 'lightblue'}}>Open link</p>
                                                </a>
                                                <div id={`load-${el.image}`} onClick={() => addEmbed(el.image)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'url(/images/bgs/Waves.png)', height: '140px', width: '100%', cursor: 'pointer', border: 'inset 2px'}}>
                                                    <p style={{margin: 0, padding: 0, color: 'lightblue', textDecoration: 'underline'}}>Load media</p>
                                                    <h3 style={{margin: 0, padding: 0, color: 'lightblue', textDecoration: 'underline'}}>⟳</h3>
                                                </div>
                                            </div> 
                                        : null}
                                    </div>
                                </div>
                            : null}
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
            <>
                <div className='description-banner'>
                    <img loading='lazy' src='/images/16icons/control.png' alt='decor' style={{margin: '0 8px 0 4px'}} width={'18px'} height={'18px'} /><p><span className="smallscreen-hide">LIVE</span> UPDATES</p>
                </div>
                <div style={{height: '10%', backgroundImage: 'url(/images/bgs/bluesteel_widecontainer.png', backgroundSize: "100% 100%", padding: '0 7px', backgroundRepeat: 'no-repeat', display: 'flex', alignItems: 'center'}}>
                    <h4 style={{width: '100%', textAlign: 'center', fontSize: '18px', color: 'darkslategray'}}>Online: </h4>
                    <p style={{fontFamily: 'dotty', fontSize: '30px', color: 'lime', textShadow: '0 0 4px lime', backgroundImage: 'url(/images/bgs/BlackThatch.png)', border: 'inset 3px', margin: 0, padding: '5px', width: 'calc(100% + 42px)'}}>{users}</p>
                </div>
            </>
        )
    }

    return (
        <div className='chat-section'>
            <Online socket={socket}/>
            <div className="chat-full-container">
                <Messages socket={socket}/>
            </div>
        </div>
    )
}

export default Chat;