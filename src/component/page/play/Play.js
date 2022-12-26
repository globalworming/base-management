import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, signInAsAnonymous} from "../../../config/firebaseConfig";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {useParams} from "react-router-dom";
import {collection, doc, onSnapshot, query, runTransaction} from "firebase/firestore";
import ShowsGame from "../../organism/debug/ShowsGame";
import ShowsPlayers from "../../organism/debug/ShowsPlayers";
import SelectPlayer from "./SelectPlayer";
import ControlCharacters from "../../organism/ControlCharacters";
import Panel from "../../atom/Panel";
import {useCharacters, useGame, usePlayers} from "../../../persistence";

function Play() {
    const {gameId} = useParams();
    const [user, loading, error] = useAuthState(auth);
    const game = useGame(gameId)
    const players = usePlayers(gameId)
    const characters = useCharacters(gameId)

    const selectedPlayer = players && user && players.find((player) => player.controlledBy === user.uid);


    useEffect(() => {
        if (!game || !selectedPlayer) return
        const interval = setInterval(async () => {
            const playerDocRef = doc(db, "games", game.id, "players", selectedPlayer.id);
            await runTransaction(db, async (transaction) => {
                await transaction.update(playerDocRef, {
                    heartbeat: Date.now()
                });
            });
        }, 30000);
        return () => clearInterval(interval);
    }, [game && game.id, selectedPlayer])

    if (!loading && user === null) {
        signInAsAnonymous()
    }

    if (!game || !user) {
        return null;
    }

    if (!selectedPlayer) {
        return <SelectPlayer game={game} players={players}/>
    }

    return <><h1 style={{width: "100%"}}>you are playing '{game.name}' as
        '{selectedPlayer.name}'</h1>
        <Panel>
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