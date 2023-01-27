import Panel from "../atom/Panel";
import Events from "../../domain/event"

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
        {player.messages.map(messageId => {
            let event = messageId.split(".")[0];
            let id = messageId.split(".")[2];
            let message = Events[event].messages[id];
            return <Panel style={{width: "100%"}}>
                <p>{message.from}</p> <p>{message.subject}</p>
                <div>{message.body}</div>
            </Panel>
        })}
    </div>
}

export default Messages