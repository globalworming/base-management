const Messages = ({game, player}) => {
    if (!player || !player.messages || player.messages.length === 0) {
        return null
    }
    return <div style={{
        maxHeight: "80vh",
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%"
    }}>
        {player.messages.map(message => {
            return <p style={{width: "100%"}}>{message}</p>
        })}
    </div>
}

export default Messages