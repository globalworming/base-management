import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, signInAsAnonymous} from "../../../config/firebaseConfig";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {useParams} from "react-router-dom";
import {collection, doc, onSnapshot, query, runTransaction} from "firebase/firestore";
import ShowsGame from "../../organism/debug/ShowsGame";
import ShowsPlayers from "../../organism/debug/ShowsPlayers";
import SelectPlayer from "./SelectPlayer";
import ShowsPlayerCharacters from "../../organism/ShowsPlayerCharacters";


function Play() {
    const [user, loading, error] = useAuthState(auth);
    const [game, setGame] = useState(undefined)
    const [players, setPlayers] = useState(undefined)
    const {gameId} = useParams();
    const selectedPlayer = players && user && players.find((player) => player.controlledBy === user.uid);

    useEffect(() => {
        return onSnapshot(doc(db, "games", gameId), (doc) => {
            let game = doc.data();
            game.id = doc.id;
            setGame(game);
        });
    }, [gameId])

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
    }, [game && game.id])

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
        return <SelectPlayer gameId={game.id}/>
    }

    return <><h1 style={{width: "100%"}}>you are playing '{game.name}' as
        '{selectedPlayer.name}'</h1>
        <div>
            <ShowsPlayerCharacters game={game}></ShowsPlayerCharacters>
        </div>
        {game.activeEvents.find(e => e === "FIRE_IN_SMELTER") && <h2>🔥🔥🔥 Your smelter is on fire, better hurry 🔥🔥🔥</h2>}
        <hr style={{width: "100%"}}/>
        <ShowsGame gameId={game.id}/>
        <hr style={{width: "100%"}}/>
        <ShowsPlayers gameId={game.id}/>
        <hr style={{width: "100%"}}/>
        <ShowsAuth/>
    </>
}

export default Play;