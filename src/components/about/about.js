

const About = () => {
    return (
        <div>
            <div>
                <div className='description-banner'>
                    <img src='/images/bgs/opendir.png' alt='decor' style={{margin: '0 8px 0 4px'}} width={'18px'} height={'18px'} /><p>DESCRIPTION</p>
                </div>
                <div style={{padding: '4px'}}>
                        <div className='description-qrd'>
                            <h4>
                                {desc.qrd}
                            </h4>
                        </div>
                    <hr style={{height: '1px', borderBottom: 'solid 1px white'}} />
                    <div className='description-full'>
                        <p>
                            {desc.full}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;