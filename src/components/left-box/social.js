import { useEffect, useState } from "react";
import { io } from "socket.io-client"

const socket = io.connect("https://arina.lol")

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

        return (
            <>
                {socials?.map((el) => {
                    var links  = JSON.parse(el.links)
                    return (
                        <div style={{height: '180px', width: '85%'}}>
                            <div style={{background: 'center / contain no-repeat url(/images/bgs/social-container-top.png)', backgroundSize: '100% 100%', display: 'grid', gridTemplateColumns: '30% 70%', height: '25px'}}>
                                <img style={{margin: '8px 0 0 8px', outline: 'white solid 1px'}} src={`${el.avatar !== "" ? el.avatar : "/images/16icons/avatar.png"}`} width={'16px'} height={'16px'} />
                                <h4 style={{padding: 0, margin: 0, color: 'white', paddingTop: '4px'}}>{el.username}</h4>
                            </div>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'center / contain no-repeat url(/images/bgs/social-container-center.png)', backgroundSize: '100% 100%', padding: '5px'}}>
                            {links.map((li) => {
                                return (
                                    <a href={`${li.link}`} style={{background: 'rgba(0, 0, 0, 0.2)', outline: 'solid black 1px', outlineOffset: '1px'}} target="_blank" rel="noreferrer">
                                        <img loading='lazy' alt={`link to ${el.username}'s ${li.title}`} width={'32px'} height={'32px'} src={`/images/16icons/${li.title}.png`} />
                                        <p style={{color: 'lightblue', textAlign: 'center', margin: 0}}>{`${li.title}`}</p>
                                    </a>
                                )
                            })}
                            </div>
                            <div style={{height: '27px', background: 'center / contain no-repeat url(/images/bgs/social-container-bottom.png)', backgroundSize: '100% 100%'}}>
                                <p style={{margin: 0, marginLeft: '12px', color: 'white', border: 'inset 1px', background: 'rgba(70, 0, 70, 0.6)', width: 'fit-content'}}>{el.descs}</p>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }

    return (
        <div className="social-container" style={{background: 'url(/images/bgs/Waves.png)', backgroundSize: '64px', overflowY: 'scroll', marginTop: '6px', height: 'calc(100% - 6px)', width: '100%', justifyItems: 'center', justifyContent: 'space-around'}}>
            <SocialWrapper/>
        </div>
    )
}

export default Social;