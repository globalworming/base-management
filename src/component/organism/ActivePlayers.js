import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {collection, doc, onSnapshot, query, runTransaction} from "firebase/firestore";
import {GameState} from "../../domain/state";

function ActivePlayers({game}) {

    const [players, setPlayers] = useState(undefined)

    useEffect(() => {
        if (!game) return
        const q = query(collection(db, "games", game.id, "players"));
        return onSnapshot(q, (querySnapshot) => {
            const players = [];
            querySnapshot.forEach((doc) => {
                let player = doc.data();
                player.id = doc.id
                players.push(player);
            });
            setPlayers(players)
        })
    }, [game, JSON.stringify(players)])

    if (!game || players === undefined) {
        return null;
    }


    return <>
        <h2>Active Players (shows inactive after ~1 minute of disconnection)</h2>
        {players.map(player => <p key={player.id}>{(Date.now() - player.heartbeat) < (60 * 1000)  ? '🟢': '🔴'}{player.name}</p>)}
    </>
}

export default ActivePlayers;