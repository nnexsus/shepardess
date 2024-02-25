

const Stream = (prop) => {
    const stream = prop.stream

    return (
        <div style={{height: '100%'}}>
            <iframe src={`${stream?.link}`} title={`${prop.title}`} height={"100%"} width={"100%"} />
        </div>
    )
}

export default Stream;