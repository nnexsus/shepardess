

const Group = (ids) => {

    const openStream = () => {
        console.log("click")
    }

    return (
        <div className="group-container-outer">
            <div className='group-container'>
                {ids.ids.length > 0 ? ids.ids.map((el) => {
                    const camtype = ['camera', 'carstream', 'audiostream', 'other']
                    const camtypetext = ['Static Camera', 'Car Camera', 'Screenshare', 'Other']
                    return (
                    <div key={`${el.id}`} className="group-stream-box" id={`stream-${el.id}`}>
                        <div className='group-control-stream-box' onClick={() => openStream(el.id, el.title, el.link)}>
                            <div style={{gridRow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <img alt="decor" className='group-led-light' src="/images/bgs/status-light.png" title={`Camera is ${el.active === 0 ? "off" : "active"}`} id={`stream-active-light-${el.id}`} style={{outlineOffset: '-1px', background: `${el.active === 0 ? "darkgreen" : "lime"}`, boxShadow: `${el.active === 0 ? "0 0 2px darkgreen" : "0 0 5px lime"}`}} />
                                <div style={{overflow: 'hidden', margin: '0px 8px', width: '100%'}}>
                                    <p className="group-cam-title stream-title" title={`${el.title}`} type='text'>{el.title}</p>
                                </div>
                                <img title={`${camtypetext[el.type]}`} src={`/images/16icons/${camtype[el.type]}.png`} alt='decor' className="type-image" />
                            </div>
                            <div style={{gridRow: 'span 2', width: 'calc(100% - 21px)', height: 'calc(100% - 11px)', aspectRatio: '1/1', borderStyle: 'inset', borderWidth: '4px', borderColor: '#879987 #B6FFB6 #B6FFB6 #879987 ', backgroundImage: `url(${el.thumblink})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <div style={{height: '100%', width: '100%', background: 'repeating-linear-gradient(to top, rgba(255, 255, 255, 0.2) 0px 2px, transparent 2px 4px)', backdropFilter: `${el.active === 0 ? "grayscale(1)" : "grayscale(0)"}`}}></div></div>
                            <div className='handle' style={{position: 'absolute', alignItems: 'center', bottom: '10px'}}>
                                <img alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-left.png'/>
                                <p title={`${el.internalname}`} style={{height: '22px', margin: 0, backgroundImage: 'url(/images/bgs/handlebox-center.png)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', fontFamily: 'ms ui gothic', lineHeight: '22px', color: '#3a5212'}}>{el.internalname}</p>
                                <img alt="decor" height={'22px'} width={'7px'} src='/images/bgs/handlebox-right.png'/>
                            </div>
                        </div>
                    </div>
                    )
                }): null}
            </div>
        </div>
    )
}

export default Group;