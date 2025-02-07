

const Contact = () => {

    return (
        <div className="contact-full" style={{background: 'url(/images/bgs/Circles.png', color: 'white'}}>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <h4>Contact</h4>
                <p>Discord: <u>@nexsu</u></p>
                <p>Twitter: <a rel="noreferrer" target="_blank" href="https://twitter.com/_nnexsus">@_nexsu</a></p>
                <p>Instagram: <a rel="noreferrer" target="_blank" href="https://www.instagram.com/nnexsus/">@slashnexsu</a></p>
            </div>
            <div style={{width: '100%', overflowY: 'scroll', overflowX: 'hidden', display: 'flex', flexDirection: 'column'}}>
                <div className="faq-box">
                    <h4>Shepardess:</h4>
                    <p>Shepardess is a weather/stormchasing/forecasting hub! It's a <i>mostly</i> middle-ground site where a lot of information is gathered to give quick,
                    consise info on weather events. Shepardess is still in its infancy, and will have a lot of development moving forward to accomplish this better and better!</p>
                </div>

                <div className="faq-box">
                    <h4>Markers, older Past entries, user location, etc:</h4>
                    <p>Shepardess originally began development as a personal stormchasing blog for myself, where I gradually added features such as indicators, markers,
                    and my current active location all for personal updates. While a lot are being phased out or reworked, I still plan to keep my personal touch on
                    most features on here.</p>
                </div>

                <div className="faq-box">
                    <h4>Emergency Light Is On / Emergency Notification Popup:</h4>
                    <p>The emergency light refers to a dangerous ongoing weather situation, such as an ongoing outbreak or imminent impact of tornado in a populated area. That indicator serves to inform
                    quickly that a large event is underway, and not just on the way. The Emergency popup (which will cover your screen) is issued by someone (likely me) personally, and will include 
                    information and instructions on what is happening and what is needed. The popup serves as an update or general call for help as something in a personal chase or location has occured to
                    whoever is issuing the popup. These popups will be extremely, extremely rare - but do exist.</p>
                </div>

                <div className="faq-box" style={{gridColumn: 'span 2'}}>
                    <h4>Daily Outlooks:</h4>
                    <p>The rightmost indicator at the top of the screen is the SPC Outlook indicator. Every day the SPC issues ~5 updates to the general risk Outlook, and this is reflected here. </p>
                    <ul>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/thunderstorm.gif" alt="decor" /><p>Thunderstorms expected.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/marginal.gif" alt="decor" /><p>Thunderstorms expected with a low potential for severe weather, potentially some hail, winds up to 60mph, or a breif tornado.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/slight.gif" alt="decor" /><p>Thunderstorms expected with a slight potential for severe weather, some hail, winds up to 60mph, or tornadoes could be possible.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/enhanced.gif" alt="decor" /><p>Thunderstorms expected with a fairly high risk for severe weather, with potentially large hail, damaging winds up to or in excess of 60mph, or tornadoes possible.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/moderate.gif" alt="decor" /><p>Thunderstorms expected with a pretty high risk for severe weather, with large hail, widespread damaging winds in excess of 60mph, or multiple tornadoes with potential for long-lived or destructive nature.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/high.gif" alt="decor" /><p>Thunderstorms expected with a high risk for severe weather. Extremely large hail, destructive widespread winds, or a tornado outbreak with long-lived and destructive tornadoes possible.</p></li>
                    </ul>
                </div>

                <div className="faq-box" style={{gridColumn: 'span 2'}}>
                    <h4>Map Regions:</h4>
                    <p>The 2nd to the right is the Region indicator. This is in place to quickly communicate what region has the highest risk in the SPC Outlook! Regions are pretty generally easy to understand, but may have some slight adjustments based on historical outbreak scenarios.</p>
                    <ul>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/northeast.gif" alt="decor" /><p>Northeast: New York, Pennsylvania, Maryland, Deleware, New Jersey.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/newengland.gif" alt="decor" /><p>New England: Maine, Vermont, New Hampshire, Conneticut, Rhode Island, Massachusetts.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/ohiovalley.gif" alt="decor" /><p>Ohio Valley: Ohio, Kentucky, West Virginia.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/appalachia.gif" alt="decor" /><p>Appalachia: Tennessee, North Carolina, South Carolina, Virginia.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/midwest.gif" alt="decor" /><p>Midwest: Wisconsin, Illinois, Indiana, Iowa, Missouri, Michigan.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/deepsouth.gif" alt="decor" /><p>Deep South: Alabama, Florida, Louisiana, Mississippi, Arkansas, Georgia.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/greatplains.gif" alt="decor" /><p>Great Plains: Nebraska, Kansas, Oklahoma, Texas.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/highplains.gif" alt="decor" /><p>High Plains: North Dakota, South Dakota, Minnesota.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/northwest.gif" alt="decor" /><p>Northwest: Oregon, Washington, Idaho, Montana, Wyoming.</p></li>
                        <li className="flex-list"><img width={'88px'} height={'31px'} src="/images/lights/southwest.gif" alt="decor" /><p>Southwest: California, Nevada, Utah, Arizona.</p></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Contact;