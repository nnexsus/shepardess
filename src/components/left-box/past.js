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
        document.getElementById(`expandpast-${ind}`).remove()
    }

    return (
        <div className='past-container'>
            {inits !== null ? inits.map((el, ind) => {
                var datef = el.date.split('T')
                var initresult = ['Terrible', 'Bad', 'Meh', 'Fair', 'Decent', 'Good', 'Great', 'Amazing']
                var initcol = ['#d92d27', 'rgb(217 46 183)', 'rgb(217 128 46)', '#cfb13c', '#2ebcd9', '#3ba35f', '#2ed99a', '#7b2ed9']
                var indexcolor = ['#FFC2D4', '#FF9EBB', '#FF7AA2', '#E05780', '#B9375E', '#8A2846', '#023E8A', '#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#ADE8F4']
                return (
                    <div key={el.date} className='p-grid'>
                        <div style={{backgroundImage: `url(https://nnexsus.net/${el.imageref})`, backgroundSize: 'cover', borderRadius: '10px', border: 'solid var(--accentThemeDarker) 2px'}}>
                            <div className='p-project'>
                                <div className='past-titles'>
                                    <h3 style={{color: `${indexcolor[ind]}`}}>{el.title}</h3>
                                </div>
                                <div className='past-tags'>
                                    <h4 className='past-h4' style={{backgroundColor: `${initcol[el.initresult]}`}}>Outcome: {initresult[el.initresult]} - {el.initresult}/7</h4>
                                    <h4 className='past-yeartag'>{datef[0]}</h4>
                                </div>
                                <p className='past-desc' id={`pastchase-${ind}`} style={{WebkitLineClamp: 2}}>{el.alttext}</p>
                                <button id={`expandpast-${ind}`} className='past-expand' onClick={() => expand(ind)}>Expand <img loading='lazy' style={{marginLeft: '3px'}} width={'24px'} height={'24px'} alt='decor' src='/images/bgs/Book.ico' /></button>
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