

const Contact = () => {

    return (
        <div className="contact-full" style={{background: 'url(/images/bgs/Circles.png', color: 'white'}}>
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
                    <p>Currently, my personal rig is only running a single camera on the dashbaord. I have more coming in for car views, and am currently working on systems to get in-field
                    deployable static cameras up as well.</p>
                </div>

                <div className="faq-box">
                    <h4>User Streams:</h4>
                    <p>After some testing time, Shepardess will open itself to allow for user streams to be embedded. Whether it's a phone pointing out a window, or another chasers embedded
                    livestream, the more endpoints the better. All streams before this point are added and vetted by purely me.</p>
                </div>

                <div className="faq-box">
                    <h4>Further User Interaction:</h4>
                    <p>User accounts, polls, stream and site effects, and potentially even achievements lie in the short future for improved user interaction.</p>
                </div>

                <div className="faq-box">
                    <h4>Site Design:</h4>
                    <p>Shepardess has a very curated design, inspiried by earlier web assets, which I feel invokes a feeling of cleaner and faster components. While this style isn't going to change
                    , there may be more options to choose from in the future, such as a light mode or a different theming all together.</p>
                </div>

                <div className="faq-box">
                    <h4>Stream Outage/Downtime:</h4>
                    <p>Streams should automatically update about once an hour. If a streamers or one of my streams go down, the embedded link may change, and not work on Shepardess
                    until the next update. I'll be working to keep these as much as possible on chase days.</p>
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