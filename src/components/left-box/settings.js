

const Settings = () => {
    return (
        <div className="settings-full" style={{backgroundImage: 'url(/images/bgs/moon-bg.png)'}}>
            <h4>Account</h4>
            <p>Access the control panel using the link below.</p>
            <a href="/control"><img loading='lazy' src="/images/16icons/group.png" height={'16px'} width={'16px'} alt="decor" /><p>Control Panel Access</p></a>
            <p>Contact me in the <span style={{textDecoration: 'underline', color: 'lightblue', cursor: 'pointer'}} onClick={() => document.getElementById("about-button").click()} >About
            </span> panel to request access for an api key. New api keys will be restricted to only Live Updates posting, Past Outbreak listings, 
            and some map editing permissions, but access to indicator lights, scrolling text and descriptions, social accounts, past outbreaks, creating/editing streams and groups,
            and issuing popups will require requests for additional access.</p>
        </div>
    )
}

export default Settings;