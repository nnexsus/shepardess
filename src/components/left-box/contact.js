

const Contact = () => {

    return (
        <div className="contact-full" style={{display: 'grid', gridTemplateColumns: '25% 75%', background: 'url(/images/bgs/Circles.png', color: 'white', fontFamily: 'ms ui gothic'}}>
            <div>
                <h4>Contact</h4>
                <p>Email: <a href="mailto:nnexsus.service@gmail.com" style={{color: 'lightblue', lineBreak: 'anywhere'}}>nnexsus.service @ gmail</a></p>
                <p>Twitter: <a href="https://twitter.com/_nnexsus">@_nnexsus</a></p>
            </div>
            <div style={{width: '100%', overflowY: 'scroll', overflowX: 'hidden', display: 'grid', gridTemplateColumns: '50% 50%'}}>
                <p style={{gridColumn: 'span 2', textShadow: 'white 2px 1px 2px'}}>Click the expansion key on the <i>left of the red menu buttons</i> to make these easier to read!</p>
                <div className="faq-box">
                    <h4>When Is The First/Next Chase Day:</h4>
                    <p>Check the Info section to the Left for a potential debrief. If there is none, then I'd recommend checking my Twitter, or going to the
                    <a style={{color: 'lightblue'}} href="https://www.spc.noaa.gov"> NOAA SPC Site</a> and check if any Marginal, Slight, or higher risks have been issued for the Midwest.</p>
                </div>

                <div className="faq-box">
                    <h4>New Streams and Updates:</h4>
                    <p>Initially, Shepardess will begin in 3-4 active streams, but gain new views over time. Besides car cameras, Static Cams, Screensharing, and directed/multi-view streams
                    are planned for the future!</p>
                </div>

                <div className="faq-box">
                    <h4>User Streams:</h4>
                    <p>After some testing time, Shepardess will open itself to allow for user streams to be embedded. Whether it's a phone pointing out a window, or another chasers embedded
                    livestream, the more endpoints the better.</p>
                </div>

                <div className="faq-box">
                    <h4>Further User Interaction:</h4>
                    <p>There will also be new user interaction features after the testing period is over. User accounts are a likely future, as well as public polls, achivements and age 
                    recognition, support, and potentially some fun effects to play in/on stream depending on the view.</p>
                </div>

                <div className="faq-box">
                    <h4>Site Design:</h4>
                    <p>The Shepardess site - as you can see, has a fairly unique and expiremental design. I highly suggest creating custom-css front-ends if that feels better suited. 
                    There will likely be multiple site themes in the future to help with navigation, including complete tonal shifts to material-esc design, and light modes.</p>
                </div>

                <div className="faq-box">
                    <h4>Stream Outage/Downtime:</h4>
                    <p></p>
                </div>

                <div className="faq-box">
                    <h4>Emergency Light Is On / Emergency Notification Popup:</h4>
                    <p>Tune into my dashboard camera stream for a debrief on the emergency. This can range anything from severe weather emergencies (ex: tornado emergency issued)
                    to personal emergencies (ex: car issues / assitance needed). The emergency indicator may take a while to disable once on, so be sure to check the dashboard stream.</p>
                </div>
            </div>
        </div>
    )
}

export default Contact;