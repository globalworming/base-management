import React from "react";


function ShowsGame({game}) {
    if (!game) {
        return null
    }
    return  <><h2>Game</h2><pre>{JSON.stringify(game, Object.keys(game).sort(), 2)}</pre></>
}

export default ShowsGame