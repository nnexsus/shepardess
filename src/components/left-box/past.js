import { useEffect, useState } from 'react';
import axios from 'axios';

const Past = () => {

    const [inits, setInits] = useState(null)

    useEffect(() => {
        axios.get('https://arina.lol/api/mainsite/inits').then((res) => {
            setInits(res.data)
        }).catch((err) => {
            return console.log(err)
        })
    }, [])

    const expand = (ind) => {
        document.getElementById(`pastchase-${ind}`).style.webkitLineClamp = 100;
        document.getElementById(`pastchase-${ind}`).style.overflowY = 'scroll';
        document.getElementById(`pastchase-${ind}`).style.height = '100%';
        document.getElementById(`expandpast-${ind}`).remove()
    }

    return (
        <div className='past-container' style={{backgroundImage: 'url(/images/bgs/moon-bg.png)', backgroundSize: '128px'}}>
            {inits !== null ? inits.map((el, ind) => {
                var datef = el.date.split('T')
                const initcol = ['#5991ff', '#2ed99a', '#23cf5e', '#a2d642', '#ccc000', '#cfb13c', 'rgb(217 128 46)', 'rgb(187 88 86)', 'rgb(207 60 60)', '#d92d27', 'rgb(227 76 203)']
                const links = (el.alttext !== null && el.alttext !== "") ? JSON.parse(el.alttext) : false
                return (
                    <div key={el.date} className='p-grid'>
                        <div style={{border: 'outset 3px'}}>
                            <div className='p-project' style={{backgroundImage: 'url(/images/bgs/past-container-center.png)', backgroundSize: '100%'}}>
                                <h3 style={{color: 'rgb(34, 97, 101)', backgroundColor: 'black', gridColumn: 'span 3', margin: '-6px', padding: '22px 0', textAlign: 'center', backgroundImage: 'url(/images/bgs/past-container-top.png)', backgroundSize: '100% 100%', fontSize: '22px'}}>{el.title}</h3>
                                <h4 className='past-yeartag' style={{gridColumn: 3, padding: 0}}>{datef[0]}</h4>
                                <div style={{gridColumnStart: 1, gridColumnEnd: 3, gridRowStart: 2, gridRowEnd: 4, margin: '3px', backgroundImage: `url(${el.imageref})`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'inset 2px', outline: 'black solid 1px', outlineOffset: '1px'}}>
                                    <h4 style={{opacity: 0.8, color: 'white', background: 'rgba(0,0,0,0.3)', margin: 0}}>Credit: {el.imgcredit}</h4>
                                </div>
                                <img title={`Severity ${el.initresult}/10 - Primary threat: ${el.customid}`} width={'calc(100% - 4px)'} height={'calc(100% - 4px)'} src={`/images/emotes/${el.customid}.gif`} alt='decor' style={{margin: '2px', outline: 'solid black 1px', outlineOffset: '1px', border: 'inset 3px', backgroundColor: `${initcol[el.initresult]}`}} />
                                <div style={{gridColumn: 'span 3', display: 'flex', flexDirection: 'column'}}>
                                    <div id={`pastlinks-${ind}`} className='past-desc' style={{display: 'grid', gridTemplateColumns: '50% 50%', gridTemplateRows: 'repeat(3, 33%)'}}>
                                        {links ?
                                            links.map((el, ind2) => {
                                                return (
                                                    <a key={`pastlinks-${ind}-${ind2}`} rel='noreferrer' target='_blank' href={`${el.link}`}>
                                                        <button className='past-expand' style={{display: 'flex', justifyContent: 'center', paddingTop: '4px', width: '100%'}}><img loading='lazy' width={'24px'} height={'24px'} alt='decor' src='/images/16icons/audiostream.png' style={{paddingRight: '2px'}} /><p>{el.title}</p></button>
                                                    </a>
                                                )
                                            })
                                        :null}
                                    </div>
                                    <p className='past-desc' id={`pastchase-${ind}`} style={{WebkitLineClamp: 2, overflow: 'hidden'}}>{el.HTMLdesc}</p>
                                    <button id={`expandpast-${ind}`} className='past-expand' onClick={() => expand(ind)} style={{display: 'flex', justifyContent: 'center', paddingTop: '4px'}}><p>Expand</p> <img loading='lazy' width={'24px'} height={'24px'} alt='decor' src='/images/bgs/Book.ico' /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }): null}
        </div>
    )
}

export default Past;