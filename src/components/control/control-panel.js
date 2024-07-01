import { useEffect, useState } from "react"
import { io } from "socket.io-client";
import axios from "axios";

const socket = io.connect('https://arina.lol');

const PanelWrapper = () => {

    const f = (e) => {
        localStorage.setItem("kaepyi", e.currentTarget.value)
    }

    const ControlPanel = () => {

        const Past = () => {

            const [inits, setInits] = useState(null)
            const initcol = ['#5991ff', '#2ed99a', '#23cf5e', '#a2d642', '#ccc000', '#cfb13c', 'rgb(217 128 46)', 'rgb(187 88 86)', 'rgb(207 60 60)', '#d92d27', 'rgb(227 76 203)']

            useEffect(() => {
                axios.get('https://arina.lol/api/mainsite/inits').then((res) => {
                    setInits(res.data)
                }).catch((err) => {
                    return console.log(err)
                })
            }, [])

            const updateOutbreak = (ind) => {

            }

            const NewOutbreak = () => {

                const [title, setTitle] = useState("Title")
                const [date, setDate] = useState("3-31-23")
                const [image, setImage] = useState("/Screenshot_2.png")
                const [imagecred, setImagecred] = useState("nnexsus")
                const [severity, setSeverity] = useState(0)
                const [desc, setDesc] = useState("Outbreak/weather event description")
                const [obsthreat, setObsthreat] = useState("supercell")
                const [links, setLinks] = useState([])

                const createOutbreak = () => {

                }

                const addLink = () => {
                    setLinks((state) => [
                        ...state,
                        {
                            "title": document.getElementById('newtitle-a').value,
                            "link": document.getElementById('newlink-a').value
                        }
                    ]);
                }

                return (
                    <div className='p-grid p-control-grid'>
                    <div style={{border: 'outset 3px'}}>
                        <div className='p-project' style={{backgroundImage: 'url(/images/bgs/past-container-center.png)', backgroundSize: '100%', minHeight: '250px'}}>
                            <input type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)} style={{color: 'rgb(34, 97, 101)', backgroundColor: 'black', gridColumn: 'span 2', margin: '-6px', padding: '22px 0', textAlign: 'center', backgroundImage: 'url(/images/bgs/past-container-top.png)', backgroundSize: '100% 100%', fontSize: '22px'}}/>
                            <button onClick={() => createOutbreak()}>Create</button>
                            <input type="date" value={date} onChange={(e) => setDate(e.currentTarget.value)} className='past-yeartag' style={{gridColumn: 3, padding: 0}}/>
                            <div style={{gridColumnStart: 1, gridColumnEnd: 3, gridRowStart: 2, gridRowEnd: 4, margin: '3px', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'inset 2px', outline: 'black solid 1px', outlineOffset: '1px'}}>
                                <input onChange={(e) => setImage(e.currentTarget.value)} placeholder="Image link" style={{opacity: 0.8, color: 'white', background: 'rgba(0,0,0,0.5)', margin: 0}}/>
                                <input onChange={(e) => setImagecred(e.currentTarget.value)} value={imagecred} placeholder="Image credit" style={{opacity: 0.8, color: 'white', background: 'rgba(0,0,0,0.5)', margin: 0}}/>
                            </div>
                            <div style={{width: 'calc(100% - 4px)', height: 'calc(100% - 4px)', display: 'grid', gridTemplateColumns: '50% 50%', margin: '2px', outline: 'solid black 1px', outlineOffset: '1px', border: 'inset 3px', backgroundColor: `${initcol[severity]}`}}>
                                <select value={obsthreat} onChange={(e) => setObsthreat(e.currentTarget.value)} style={{border: 0, background: 'none'}} title={`Primary threat: ${obsthreat}`}>
                                    <option value={'supercell'}>Supercell</option>
                                    <option value={'hail'}>Hail</option>
                                    <option value={'tornado'}>Tornado</option>
                                    <option value={'aurora'}>Aurora</option>
                                </select>
                                <select value={severity} onChange={(e) => setSeverity(e.currentTarget.value)} style={{border: 0, background: 'none'}} title={`Severity ${severity}/10`}>
                                    <option value={'0'}>0</option>
                                    <option value={'1'}>1</option>
                                    <option value={'2'}>2</option>
                                    <option value={'3'}>3</option>
                                    <option value={'4'}>4</option>
                                    <option value={'5'}>5</option>
                                    <option value={'6'}>6</option>
                                    <option value={'7'}>7</option>
                                    <option value={'8'}>8</option>
                                    <option value={'9'}>9</option>
                                    <option value={'10'}>10</option>
                                </select>
                            </div>
                            <div style={{gridColumn: 'span 3', display: 'flex', flexDirection: 'column'}}>
                                <div className='past-desc' style={{display: 'grid', gridTemplateColumns: '50% 50%'}}>
                                    {links.length > 0 ? 
                                        links.map((el, ind) => {
                                            return (
                                                <a rel='noreferrer' target='_blank' href={`${el.link}`}>
                                                    <button className='past-expand' style={{display: 'flex', justifyContent: 'center', paddingTop: '4px', width: '100%'}}><img loading='lazy' width={'24px'} height={'24px'} alt='decor' src='/images/16icons/audiostream.png' /><p>{el.title}</p></button>
                                                </a>
                                                )
                                            })
                                    :null}
                                </div>
                                <div style={{display: 'grid', gridTemplateColumns: '33% 34% 33%'}}>
                                    <input type="text" placeholder="Link/url" id="newlink-a" />
                                    <input type="text" placeholder="Button title" id="newtitle-a" />
                                    <button onClick={() => addLink()}>Add Link</button>
                                </div>
                                <textarea className='past-desc' value={desc} onChange={(e) => setDesc(e.currentTarget.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        
            return (
                <div className='past-container' style={{backgroundImage: 'url(/images/bgs/moon-bg.png)', backgroundSize: '128px', overflowY: 'scroll', height: '100%', marginTop: 0, padding: '4px'}}>
                    <NewOutbreak/>
                    {inits !== null ? inits.map((el, ind) => {
                        const datef = el.date.split('T')
                        return (
                            <div key={el.date} className='p-grid p-control-grid'>
                                <div style={{border: 'outset 3px'}}>
                                    <div className='p-project' style={{backgroundImage: 'url(/images/bgs/past-container-center.png)', backgroundSize: '100%', minHeight: '250px'}}>
                                        <input type="text" defaultValue={el.title} id={`pasttitle-${ind}`} style={{color: 'rgb(34, 97, 101)', backgroundColor: 'black', gridColumn: 'span 2', margin: '-6px', padding: '22px 0', textAlign: 'center', backgroundImage: 'url(/images/bgs/past-container-top.png)', backgroundSize: '100% 100%', fontSize: '22px'}}/>
                                        <button onClick={() => updateOutbreak(ind)}>Update</button>
                                        <input type="text" defaultValue={datef[0]} className='past-yeartag' style={{gridColumn: 3, padding: 0}}/>
                                        <div style={{gridColumnStart: 1, gridColumnEnd: 3, gridRowStart: 2, gridRowEnd: 4, margin: '3px', backgroundImage: `url(${el.imageref})`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'inset 2px', outline: 'black solid 1px', outlineOffset: '1px'}}>
                                            <input id={`imgcredit-${ind}`} defaultValue={el.imgcredit} placeholder="Image credit" style={{opacity: 0.8, color: 'white', background: 'rgba(0,0,0,0.3)', margin: 0}}/>
                                        </div>
                                        <div style={{width: 'calc(100% - 4px)', height: 'calc(100% - 4px)', display: 'grid', gridTemplateColumns: '50% 50%', margin: '2px', outline: 'solid black 1px', outlineOffset: '1px', border: 'inset 3px', backgroundColor: `${initcol[el.initresult]}`}}>
                                            <select style={{border: 0, background: 'none'}} title={`Primary threat: ${el.customid}`} defaultValue={el.customid} id={`threattype-${ind}`}>
                                                <option value={'supercell'}>Supercell</option>
                                                <option value={'hail'}>Hail</option>
                                                <option value={'tornado'}>Tornado</option>
                                                <option value={'aurora'}>Aurora</option>
                                            </select>
                                            <select style={{border: 0, background: 'none'}} title={`Severity ${el.initresult}/10`} defaultValue={el.initresult} id={`threatseverity-${ind}`} >
                                                <option value={'0'}>0</option>
                                                <option value={'1'}>1</option>
                                                <option value={'2'}>2</option>
                                                <option value={'3'}>3</option>
                                                <option value={'4'}>4</option>
                                                <option value={'5'}>5</option>
                                                <option value={'6'}>6</option>
                                                <option value={'7'}>7</option>
                                                <option value={'8'}>8</option>
                                                <option value={'9'}>9</option>
                                                <option value={'10'}>10</option>
                                            </select>
                                        </div>
                                        <div style={{gridColumn: 'span 3', display: 'flex', flexDirection: 'column'}}>
                                            <div id={`pastlinks-${ind}`} className='past-desc' style={{display: 'grid', gridTemplateColumns: '50% 50%', gridTemplateRows: 'repeat(3, 33%)'}}>
                                                {el.alttext ?
                                                    <a rel='noreferrer' target='_blank' href={`${el.alttext}`}>
                                                        <button className='past-expand' style={{display: 'flex', justifyContent: 'center', paddingTop: '4px', width: '100%'}}><img loading='lazy' width={'24px'} height={'24px'} alt='decor' src='/images/16icons/audiostream.png' /><p>Link</p>
                                                        </button>
                                                    </a>
                                                :null}
                                            </div>
                                            <textarea className='past-desc' id={`pastchase-${ind}`} defaultValue={el.htmldesc} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }): null}
                </div>
            )
        }

        const Social = () => {

            useEffect(() => {
                socket.emit('sync_social')
            }, [])
        
            const SocialWrapper = () => {
        
                const [socials, setSocials] = useState([{"username": "nnexsus", "descs": "Developer, Stormchaser", "avatar": "", "links": '[{"title": "youtube", "link": "https://www.youtube.com/@_nexsus/videos"}, {"title": "bird", "link": "https://twitter.com/_nnexsus"}, {"title": "discord", "link": "https://discord.gg/d8R2tDaBK2"}, {"title": "github", "link": "https://github.com/nnexsus/shepardess"}]'}])
        
                useEffect(() => {
                    socket.on('set_social', (data) => {
                        setSocials(data)
                    })
                    return () => socket.off('set_social')
                }, [socials, setSocials])

                const addLink = (username, ind) => {
                    console.log(ind)
                    const newarr = [...socials[ind].links]
                    const newlink = document.querySelector(`#newlink-social-${ind}`).value
                    const newtitle = document.querySelector(`#newtitle-social-${ind}`).value
                    newarr.push({"link": `${newlink}`, "title": `${newtitle}`})
                    socket.emit('update_social', {'key': localStorage.getItem("kaepyi"), 'category': 'link', 'newvalue': newarr, 'username': username})
                }

                return (
                    <>
                        {socials?.map((el, ind) => {
                            var links  = JSON.parse(el.links)
                            return (
                                <div key={`socials-${ind}`} style={{height: '180px', width: '85%'}}>
                                    <div style={{background: 'center / contain no-repeat url(/images/bgs/social-container-top.png)', backgroundSize: '100% 100%', display: 'grid', gridTemplateColumns: '15% 43% 42%', height: '25px'}}>
                                        <img style={{margin: '8px 0 0 8px', outline: 'white solid 1px'}} src={`${el.avatar !== "" ? el.avatar : "/images/16icons/avatar.png"}`} width={'16px'} height={'16px'} />
                                        <input type="text" defaultValue={el.username} placeholder="Username" style={{padding: 0, margin: 0, color: 'white', paddingTop: '4px', background: 'none', border: 'solid 1px black'}}/>
                                        <input type="text" defaultValue={el.avatar} placeholder="Avatar url" style={{padding: 0, margin: 0, color: 'white', paddingTop: '4px', background: 'none', border: 'solid 1px black'}}/>
                                    </div>
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'center / contain no-repeat url(/images/bgs/social-container-center.png)', backgroundSize: '100% 100%', padding: '5px'}}>
                                        <div style={{display: 'flex', width: '100%'}}>
                                            <input type="text" placeholder="" id={`newlink-social-${ind}`} />
                                            <input type="text" placeholder="" id={`newtitle-social-${ind}`} />
                                            <button onClick={() => addLink(el.username, ind)}>Add link</button>
                                        </div>
                                    {links.map((li) => {
                                        return (
                                            <a href={`${li.link}`} key={`socials-${ind}-${ind}`} style={{background: 'rgba(0, 0, 0, 0.2)', outline: 'solid black 1px', outlineOffset: '1px'}} target="_blank" rel="noreferrer">
                                                <img loading='lazy' alt={`link to ${el.username}'s ${li.title}`} width={'32px'} height={'32px'} src={`/images/16icons/${li.title}.png`} />
                                                <p style={{color: 'lightblue', textAlign: 'center', margin: 0}}>{`${li.title}`}</p>
                                            </a>
                                        )
                                    })}
                                    <div style={{background: 'rgba(0, 0, 0, 0.2)', outline: 'solid black 1px', outlineOffset: '1px'}} target="_blank" rel="noreferrer">
                                        <img loading='lazy' alt={`delete ${el.username}'s links`} width={'32px'} height={'32px'} src={`/images/16icons/singlestream-x.png`} />
                                        <p style={{color: 'lightblue', textAlign: 'center', margin: 0}}>Remove Links</p>
                                    </div>
                                    </div>
                                    <div style={{height: '27px', background: 'center / contain no-repeat url(/images/bgs/social-container-bottom.png)', backgroundSize: '100% 100%'}}>
                                        <input type="text" defaultValue={el.descs} placeholder="Quick descriptions/titles" style={{margin: 0, marginLeft: '12px', color: 'white', border: 'inset 1px', background: 'rgba(70, 0, 70, 0.6)', width: 'fit-content'}}/>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )
            }

            const NewSocial = () => {
                const [desc, setDesc] = useState("")
                const [links, setLinks] = useState([])
                const [avatar, setAvatar] = useState("")
                const [username, setUsername] = useState("")

                const addLink = () => {
                    setLinks((state) => [
                        ...state,
                        {
                            "title": document.getElementById(`newtitle-social-a`).value,
                            "link": document.getElementById('newlink-social-a').value
                        }
                    ]);
                }

                const createSocial = () => {
                    const newarr = {
                        "key": localStorage.getItem("kaepyi"),
                        "username": username,
                        "descs": desc,
                        "avatar": avatar,
                        "links": links
                    }
                    socket.emit('update_socials', newarr)
                    setDesc("")
                    setLinks([])
                    setAvatar("")
                    setUsername("")
                }

                return (
                    <div style={{height: '180px', width: '85%'}}>
                        <div style={{background: 'center / contain no-repeat url(/images/bgs/social-container-top.png)', backgroundSize: '100% 100%', display: 'grid', gridTemplateColumns: '15% 43% 42%', height: '25px'}}>
                            <img style={{margin: '8px 0 0 8px', outline: 'white solid 1px'}} src={"/images/16icons/avatar.png"} width={'16px'} height={'16px'} />
                            <input onClick={(e) => setUsername(e.currentTarget.value)} value={username} type="text" placeholder="Username" style={{padding: 0, margin: 0, color: 'white', paddingTop: '4px', background: 'none', border: 'solid 1px black'}}/>
                            <input onClick={(e) => setAvatar(e.currentTarget.value)} value={avatar} type="text" placeholder="Avatar url" style={{padding: 0, margin: 0, color: 'white', paddingTop: '4px', background: 'none', border: 'solid 1px black'}}/>
                        </div>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'center / contain no-repeat url(/images/bgs/social-container-center.png)', backgroundSize: '100% 100%', padding: '5px'}}>
                            <div style={{display: 'flex', width: '100%'}}>
                                <input type="text" placeholder="" id={`newlink-social-a`} />
                                <input type="text" placeholder="" id={`newtitle-social-a`} />
                                <button onClick={() => addLink()}>Add link</button>
                            </div>
                        {links.map((li, ind) => {
                            return (
                                <a key={`newsociallink-${ind}`} href={`${li.link}`} style={{background: 'rgba(0, 0, 0, 0.2)', outline: 'solid black 1px', outlineOffset: '1px'}} target="_blank" rel="noreferrer">
                                    <img loading='lazy' alt={`link to ${li.title}`} width={'32px'} height={'32px'} src={`/images/16icons/${li.title}.png`} />
                                    <p style={{color: 'lightblue', textAlign: 'center', margin: 0}}>{`${li.title}`}</p>
                                </a>
                            )
                        })}
                        <div onClick={() => setLinks([])} style={{background: 'rgba(0, 0, 0, 0.2)', outline: 'solid black 1px', outlineOffset: '1px'}} target="_blank" rel="noreferrer">
                            <img loading='lazy' alt={`delete links`} width={'32px'} height={'32px'} src={`/images/16icons/singlestream-x.png`} />
                            <p style={{color: 'lightblue', textAlign: 'center', margin: 0}}>Remove Links</p>
                        </div>
                        </div>
                        <div style={{height: '27px', background: 'center / contain no-repeat url(/images/bgs/social-container-bottom.png)', backgroundSize: '100% 100%'}}>
                            <input onChange={(e) => setDesc(e.currentTarget.value)} value={desc} type="text" placeholder="Quick descriptions/titles" style={{margin: 0, marginLeft: '12px', color: 'white', border: 'inset 1px', background: 'rgba(70, 0, 70, 0.6)', width: 'fit-content'}}/>
                            <button onClick={() => createSocial()}>Add social account.</button>
                        </div>
                    </div>
                )
            }
        
            return (
                <div style={{background: 'url(/images/bgs/Waves.png)', backgroundSize: '64px', overflowY: 'scroll', paddingTop: '6px', height: 'calc(100% - 6px)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <NewSocial/>
                    <SocialWrapper/>
                </div>
            )
        }

        return (
            <div style={{width: 'calc(100% - 26px)', height: 'calc(100% - 26px)', border: 'outset 3px', background: 'lightgray', display: 'grid', gridTemplateColumns: '50% 50%', gridTemplateRows: '100%', margin: '10px'}}>
                <div className="control-socials" style={{height: 'calc(100% - 6px)', width: 'calc(100% - 6px)', border: 'inset 3px'}}>
                    <Social/>
                </div>
                <div className="control-outbreaks" style={{height: 'calc(100% - 12px)', width: 'calc(100% - 6px)', border: 'inset 3px'}}>
                    <Past/>
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
                <a style={{outline: 'outset 2px'}} href='/control' ><img loading='lazy' height={'24px'} src="/images/16icons/control.png" alt="logo" /></a>
                <a style={{outline: 'outset 2px'}} href='/control/streams' ><img loading='lazy' height={'24px'} src="/images/16icons/terminallinkicon.png" alt="logo" /></a>
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
                <ControlPanel/>
            </div>
        </div>
    )
}

export default PanelWrapper;