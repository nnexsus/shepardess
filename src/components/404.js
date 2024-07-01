
const NotFound = () => {
    return (
        <div style={{width: '100vw', height: '100vh', display: 'grid', gridTemplateColumns: '33% 34% 33%', gridTemplateRows: '20% 60% 20%'}}>
            <div style={{gridRow: 2, gridColumn: 2, background: 'lightgray', border: 'outset 3px'}}>
                <h1>404</h1>
                <div style={{margin: '0 5px', border: 'inset 4px', background: 'gray'}}>
                    <h4><u>Links:</u></h4>
                    <ul>
                        <li><img width={'17px'} height={'16px'} alt="decor" src="/images/bgs/skull-logo-mini.png" /><a style={{color: 'lightblue'}} href="/home">/home</a></li>
                        <li><img width={'17px'} height={'16px'} alt="decor" src="/images/16icons/terminalicon.png" /><a style={{color: 'lightblue'}} href="/control">/control</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NotFound;