import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, signInAsAnonymous} from "../../../config/firebaseConfig";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {useParams} from "react-router-dom";
import ShowsGame from "../../organism/debug/ShowsGame";
import ShowsPlayers from "../../organism/debug/ShowsPlayers";
import SelectPlayer from "./SelectPlayer";
import ControlCharacters from "../../organism/ControlCharacters";
import Panel from "../../atom/Panel";
import {useCharacters, useGame, usePlayers} from "../../../persistence";
import GameOver from "../../atom/GameOver";

function Play() {
    const {gameId} = useParams();
    const [user, loading, error] = useAuthState(auth);
    const game = useGame(gameId)
    const players = usePlayers(gameId)
    const characters = useCharacters(gameId)
    const selectedPlayer = players && user && players.find((player) => player.controlledBy === user.uid);
    // FIXME turned off for the moment
    // useHeartbeat(game, selectedPlayer)


    if (!loading && user === null) {
        signInAsAnonymous()
    }

    if (!game || !user) {
        return null;
    }

    if (!selectedPlayer) {
        return <SelectPlayer game={game} players={players}/>
    }

    return <>
        <GameOver game={game}/>
        <Panel style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "stretch",
            width: "100%"
        }}>
            <ControlCharacters characters={characters} game={game}></ControlCharacters>
        </Panel>
        {game.activeEvents.find(e => e === "FIRE_IN_SMELTER") && <h2>🔥🔥🔥 Your smelter is on fire, better hurry 🔥🔥🔥</h2>}
        <hr style={{width: "100%"}}/>
        <ShowsGame game={game}/>
        <hr style={{width: "100%"}}/>
        <ShowsPlayers players={players}/>
        <hr style={{width: "100%"}}/>
        <ShowsAuth/>
    </>
}

export default Play;