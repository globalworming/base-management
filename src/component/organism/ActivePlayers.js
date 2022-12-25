import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {collection, onSnapshot, query} from "firebase/firestore";

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
    }, [game])

    if (!game || players === undefined) {
        return null;
    }


    return <><div>
        <h2>Players</h2>
        {players.map(player => <p key={player.id}>{(Date.now() - player.heartbeat) < (35 * 1000)  ? '🟢': '🔴'}{player.name}</p>)}
    </div></>
}

export default ActivePlayers;