import React from "react";

function ActivePlayers({players}) {
    if (players === undefined) {
        return null;
    }

    return <><div>
        <h2>Players</h2>
        {players.map(player => <p key={player.id}>{(Date.now() - player.heartbeat) < (35 * 1000)  ? '🟢': '🔴'}{player.name}</p>)}
    </div></>
}

export default ActivePlayers;