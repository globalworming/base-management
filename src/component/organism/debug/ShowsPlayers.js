import React from "react";


function ShowsPlayers({players}) {
    if (!players || players.length <= 0) {
        return null;
    }

    return  <><h2>Players</h2>{players.map(player => <pre key={player.id}>{JSON.stringify(player, null, 2)}</pre>)}</>
}

export default ShowsPlayers