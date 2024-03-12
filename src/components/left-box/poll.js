

const Poll = () => {
    return (
        <div style={{background: 'url(/images/bgs/Waves.png)', backgroundSize: '64px', overflowY: 'scroll', marginTop: '6px', height: 'calc(100% - 6px)', width: '100%', display: 'grid', gridTemplateColumns: "25% 25% 25% 25%", justifyItems: 'center', justifyContent: 'space-around'}}>
            <a href="https://nnexsus.net/" target="_blank" rel="noreferrer">
                <img loading='lazy' alt="link to my site" width={'64px'} height={'64px'} src="/images/16icons/moon.png" />
                <p style={{color: 'lightblue', fontFamily: 'ms ui gothic'}}>My site.</p>
            </a>
            <a href="https://www.youtube.com/@_nexsus/videos" target="_blank" rel="noreferrer">
                <img loading='lazy' alt="link to my youtube" width={'64px'} height={'64px'} src="/images/16icons/youtube.png" />
                <p style={{color: 'lightblue', fontFamily: 'ms ui gothic'}}>Youtube</p>
            </a>
            <a href="https://twitter.com/_nnexsus" target="_blank" rel="noreferrer">
                <img loading='lazy' alt="link to my twitter" width={'64px'} height={'64px'} src="/images/16icons/bird.png" />
                <p style={{color: 'lightblue', fontFamily: 'ms ui gothic'}}>Twitter</p>
            </a>
            <a href="https://discord.gg/d8R2tDaBK2" target="_blank" rel="noreferrer">
                <img loading='lazy' alt="link to my discord" width={'64px'} height={'64px'} src="/images/16icons/discord.png" />
                <p style={{color: 'lightblue', fontFamily: 'ms ui gothic', textAlign: 'center'}}>Discord <br/><u>@nnexsus</u></p>
            </a>
            <a href="https://github.com/nnexsus/shepardess" target="_blank" rel="noreferrer">
                <img loading='lazy' alt="link to the github repo for this" width={'64px'} height={'64px'} src="/images/16icons/github.png" />
                <p style={{color: 'lightblue', fontFamily: 'ms ui gothic', textAlign: 'center'}}>Github</p>
            </a>
        </div>
    )
}

export default Poll;