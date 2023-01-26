import Panel from "../atom/Panel";

const Messages = ({game, player}) => {
    if (!player || !player.messages || player.messages.length === 0) {
        return null
    }
    return <div style={{
        maxHeight: "80vh",
        overflowY: "scroll",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%"
    }}>
        {player.messages.map(message => {
            return <Panel style={{width: "100%"}}>{message}</Panel>
        })}
    </div>
}

export default Messages