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
        <div className='past-container'>
            {inits !== null ? inits.map((el, ind) => {
                var datef = el.date.split('T')
                var initresult = ['Absolute Failure', 'Terrible', 'Bad', 'Sucky', 'Meh', 'Fair', 'Decent', 'Good', 'Great', 'Amazing', 'Perfect']
                var initcol = ['#d92d27', 'rgb(217 46 183)', 'rgb(217 128 46)', '#cfb13c', '#a2d642', '#23cf5e', '#2ed99a', '#5991ff', '#7859ff', '#7b2ed9', '#fff200']
                var indexcolor = ['#FFC2D4', '#FF9EBB', '#FF7AA2', '#E05780', '#B9375E', '#8A2846', '#023E8A', '#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#ADE8F4']
                return (
                    <div key={el.date} className='p-grid'>
                        <div style={{backgroundImage: `url(${el.imageref})`, backgroundSize: 'auto 100%', backgroundPosition: 'center', border: 'outset 3px'}}>
                            <div className='p-project'>
                                <div style={{border: 'inset 3px', backgroundColor: `${initcol[el.initresult]}`, margin: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title={`${el.initresult}/10 - Observed: ${el.customid}`}>
                                    <img width={'calc(100% - 4px)'} height={'calc(100% - 4px)'} src={`/images/emotes/${el.customid}.gif`} alt='decor' style={{margin: '2px', outline: 'solid black 2px'}} />
                                </div>
                                <div className='past-tags' style={{margin: '12px'}}>
                                    <h4 className='past-h4' style={{backgroundColor: `${initcol[el.initresult]}`}}>{initresult[el.initresult]} - {el.initresult}/10</h4>
                                    <h4 className='past-yeartag'>{datef[0]}</h4>
                                    {el.alttext !== null ? 
                                        <a href={`${el.alttext}`} target='_blank' rel='noreferrer'><button className='past-expand'>Media<img loading='lazy' style={{padding: '3px'}} width={'24px'} height={'24px'} alt='decor' src='/images/16icons/audiostream.png' /></button></a>
                                    :
                                        <button style={{filter: 'grayscale(1)'}} className='past-expand'>No media<img loading='lazy' style={{padding: '3px'}} width={'24px'} height={'24px'} alt='decor' src='/images/16icons/audiostream.png' /></button>
                                    }
                                </div>
                                <div className='past-titles' style={{gridColumn: 'span 2'}}>
                                    <h3 style={{color: `${indexcolor[ind]}`, backgroundColor: 'black'}}>{el.title}</h3>
                                </div>
                                <div style={{gridColumn: 'span 2'}}>
                                    <p className='past-desc' id={`pastchase-${ind}`} style={{WebkitLineClamp: 2, overflow: 'hidden'}}>{el.HTMLdesc}</p>
                                    <button id={`expandpast-${ind}`} className='past-expand' onClick={() => expand(ind)}>Expand <img loading='lazy' style={{marginLeft: '3px'}} width={'24px'} height={'24px'} alt='decor' src='/images/bgs/Book.ico' /></button>
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

//<img loading='lazy' style={{cursor: 'pointer'}} title='click to expand' alt='project preview' className='webimg' loading={'lazy'} src={`${el.imageref}`} width="90%" height={'100%'} />